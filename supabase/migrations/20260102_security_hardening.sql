-- ==============================================================================
-- SECURITY HARDENING + SERVER-SIDE QUIZ ENGINE
-- Fixes issues in 20260101_init.sql:
--  * quiz_options.is_correct was readable by everyone (answer key leak)
--  * students could UPDATE their own quiz_attempts.score (score tampering)
--  * teachers could grant themselves/others the admin role
--  * all profiles (email/phone) were publicly readable
--  * placement_attempts / site_settings had RLS enabled but no policies
-- ==============================================================================

-- ---------- Helper functions (search_path pinned) ----------
CREATE OR REPLACE FUNCTION public.has_role(r TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = r);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role('admin');
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin','teacher'));
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(course_uuid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.enrollments
    WHERE student_id = auth.uid() AND course_id = course_uuid AND status IN ('active','completed'));
$$;

-- ---------- Schema additions ----------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS english_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
  CHECK (status IN ('active','suspended'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public'
  CHECK (visibility IN ('public','unlisted','private'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS enrollment_open BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS resources_downloadable BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.lesson_resources ADD COLUMN IF NOT EXISTS storage_path TEXT;

ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'in_progress'
  CHECK (status IN ('in_progress','submitted'));
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS question_order UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS total_questions INTEGER;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS correct_answers INTEGER;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
CREATE UNIQUE INDEX IF NOT EXISTS uq_quiz_answers_attempt_question ON public.quiz_answers(attempt_id, question_id);

ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS announcement_id UUID
  REFERENCES public.announcements(id) ON DELETE CASCADE;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS course_id UUID
  REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE public.course_applications ADD COLUMN IF NOT EXISTS course_id UUID
  REFERENCES public.courses(id) ON DELETE SET NULL;

-- Simple DB-backed rate limit table (works on serverless without Redis)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (key, window_start)
);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY; -- no policies: service role only

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.course_applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON public.quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON public.quizzes(lesson_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;
DO $$ DECLARE t TEXT; BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','courses','lessons','quizzes','blog_posts','lesson_progress'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_touch_%1$s ON public.%1$s;', t);
    EXECUTE format('CREATE TRIGGER trg_touch_%1$s BEFORE UPDATE ON public.%1$s FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();', t);
  END LOOP;
END $$;

-- Prevent users from changing protected profile columns themselves
CREATE OR REPLACE FUNCTION public.protect_profile_columns() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin_or_teacher() THEN
    NEW.email := OLD.email;
    NEW.status := OLD.status;
    NEW.email_verified := OLD.email_verified;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_protect_profile ON public.profiles;
CREATE TRIGGER trg_protect_profile BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();

-- ---------- Replace weak policies ----------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin_or_teacher());
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_admin_update ON public.profiles FOR UPDATE
  USING (public.is_admin_or_teacher());

-- Roles: ONLY admins can write. Teachers cannot escalate.
DROP POLICY IF EXISTS "Only admins can modify roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY roles_select ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_or_teacher());
CREATE POLICY roles_admin_insert ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY roles_admin_update ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY roles_admin_delete ON public.user_roles FOR DELETE USING (public.is_admin());

-- Courses: private courses only visible to enrolled
DROP POLICY IF EXISTS "Published courses viewable by all" ON public.courses;
CREATE POLICY courses_select ON public.courses FOR SELECT USING (
  (status = 'published' AND visibility IN ('public','unlisted'))
  OR public.is_enrolled_in_course(id)
  OR public.is_admin_or_teacher()
);

DROP POLICY IF EXISTS "Modules viewable if course is accessible" ON public.course_modules;
CREATE POLICY modules_select ON public.course_modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id)
);

-- Lessons: catalog needs titles; content gated via lesson_catalog view + RLS
DROP POLICY IF EXISTS "Lesson previews or enrolled access" ON public.lessons;
CREATE POLICY lessons_select ON public.lessons FOR SELECT USING (
  public.is_admin_or_teacher()
  OR (is_published AND (is_preview OR public.is_enrolled_in_course(course_id)))
);

-- Public curriculum outline (no video URLs / content) for course detail pages
CREATE OR REPLACE VIEW public.lesson_catalog WITH (security_invoker = false) AS
  SELECT l.id, l.course_id, l.module_id, l.title, l.lesson_type, l.video_duration_seconds,
         l.order_index, l.is_preview
  FROM public.lessons l JOIN public.courses c ON c.id = l.course_id
  WHERE l.is_published AND c.status = 'published' AND c.visibility IN ('public','unlisted');
GRANT SELECT ON public.lesson_catalog TO anon, authenticated;

CREATE POLICY resources_select ON public.lesson_resources FOR SELECT USING (
  public.is_admin_or_teacher() OR EXISTS (
    SELECT 1 FROM public.lessons l WHERE l.id = lesson_id
    AND l.resources_downloadable AND public.is_enrolled_in_course(l.course_id))
);
CREATE POLICY resources_admin ON public.lesson_resources FOR ALL USING (public.is_admin_or_teacher());

-- Progress: students may read/write only their own rows for courses they are enrolled in
DROP POLICY IF EXISTS "Students see and update own progress" ON public.lesson_progress;
CREATE POLICY progress_select ON public.lesson_progress FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin_or_teacher());
CREATE POLICY progress_insert ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id AND public.is_enrolled_in_course(course_id));
CREATE POLICY progress_update ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id AND public.is_enrolled_in_course(course_id));

-- Quizzes: only published or admin; questions only for enrolled/admin
DROP POLICY IF EXISTS "Quizzes viewable by enrolled or admins" ON public.quizzes;
DROP POLICY IF EXISTS "Questions viewable by enrolled or admins" ON public.quiz_questions;
DROP POLICY IF EXISTS "Quiz options text viewable by all" ON public.quiz_options;
CREATE POLICY quizzes_select ON public.quizzes FOR SELECT USING (
  public.is_admin_or_teacher() OR (is_published AND (course_id IS NULL OR public.is_enrolled_in_course(course_id)))
);
-- Students NEVER read quiz_questions/quiz_options directly. They use get_quiz_for_attempt().
CREATE POLICY questions_admin_select ON public.quiz_questions FOR SELECT USING (public.is_admin_or_teacher());
CREATE POLICY options_admin_select ON public.quiz_options FOR SELECT USING (public.is_admin_or_teacher());

-- Attempts/answers: students may only READ. All writes go through SECURITY DEFINER RPCs.
DROP POLICY IF EXISTS "Students manage own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Students manage own quiz answers" ON public.quiz_answers;
CREATE POLICY attempts_select ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin_or_teacher());
CREATE POLICY answers_select ON public.quiz_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.id = attempt_id AND a.student_id = auth.uid() AND a.status = 'submitted')
  OR public.is_admin_or_teacher()
);

-- Applications: public insert with consent required; never readable by anon
DROP POLICY IF EXISTS "Anyone can submit course application" ON public.course_applications;
CREATE POLICY applications_insert ON public.course_applications FOR INSERT
  WITH CHECK (privacy_consent = TRUE AND status = 'pending' AND admin_notes IS NULL);

-- Notifications: users can read and mark-as-read their own; only staff create
DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;
CREATE POLICY notif_select ON public.notifications FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher());
CREATE POLICY notif_update_own ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY notif_delete_own ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY notif_admin ON public.notifications FOR ALL USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Published announcements viewable by all" ON public.announcements;
CREATE POLICY ann_select ON public.announcements FOR SELECT USING (
  public.is_admin_or_teacher() OR (is_published AND auth.uid() IS NOT NULL)
);

-- Certificates: verification happens via verify_certificate() RPC (limited columns)
DROP POLICY IF EXISTS "Certificates public for verification" ON public.certificates;
CREATE POLICY cert_select ON public.certificates FOR SELECT USING (auth.uid() = student_id OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY audit_insert ON public.audit_logs FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY placement_insert ON public.placement_attempts FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY placement_select ON public.placement_attempts FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin_or_teacher());

CREATE POLICY settings_select ON public.site_settings FOR SELECT USING (true);
CREATE POLICY settings_admin ON public.site_settings FOR ALL USING (public.is_admin());

-- ==============================================================================
-- RPC: start or resume a quiz attempt. Returns questions WITHOUT correct answers.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.start_quiz_attempt(p_quiz_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  q public.quizzes%ROWTYPE;
  a public.quiz_attempts%ROWTYPE;
  used INTEGER;
  ord UUID[];
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
  SELECT * INTO q FROM public.quizzes WHERE id = p_quiz_id;
  IF NOT FOUND OR (NOT q.is_published AND NOT public.is_admin_or_teacher()) THEN RAISE EXCEPTION 'QUIZ_NOT_FOUND'; END IF;
  IF q.course_id IS NOT NULL AND NOT public.is_enrolled_in_course(q.course_id) AND NOT public.is_admin_or_teacher() THEN
    RAISE EXCEPTION 'NOT_ENROLLED';
  END IF;

  -- resume an unexpired in-progress attempt
  SELECT * INTO a FROM public.quiz_attempts
   WHERE quiz_id = p_quiz_id AND student_id = auth.uid() AND status = 'in_progress'
   ORDER BY started_at DESC LIMIT 1;

  IF FOUND AND a.expires_at IS NOT NULL AND a.expires_at < NOW() THEN
    PERFORM public.submit_quiz_attempt(a.id);
    a := NULL;
  END IF;

  IF a.id IS NULL THEN
    SELECT COUNT(*) INTO used FROM public.quiz_attempts WHERE quiz_id = p_quiz_id AND student_id = auth.uid();
    IF q.max_attempts IS NOT NULL AND q.max_attempts > 0 AND used >= q.max_attempts THEN
      RAISE EXCEPTION 'ATTEMPTS_EXHAUSTED';
    END IF;
    IF q.randomize_questions THEN
      SELECT array_agg(id ORDER BY random()) INTO ord FROM public.quiz_questions WHERE quiz_id = p_quiz_id;
    ELSE
      SELECT array_agg(id ORDER BY order_index) INTO ord FROM public.quiz_questions WHERE quiz_id = p_quiz_id;
    END IF;
    IF ord IS NULL THEN RAISE EXCEPTION 'QUIZ_EMPTY'; END IF;
    INSERT INTO public.quiz_attempts (quiz_id, student_id, status, question_order, total_questions, expires_at)
    VALUES (p_quiz_id, auth.uid(), 'in_progress', ord, array_length(ord,1),
      CASE WHEN q.time_limit_minutes > 0 THEN NOW() + make_interval(mins => q.time_limit_minutes) END)
    RETURNING * INTO a;
  END IF;

  RETURN jsonb_build_object(
    'attempt_id', a.id,
    'expires_at', a.expires_at,
    'quiz', jsonb_build_object('id', q.id, 'title', q.title, 'description', q.description,
       'difficulty', q.difficulty, 'time_limit_minutes', q.time_limit_minutes,
       'passing_percentage', q.passing_percentage),
    'questions', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', qq.id, 'question_text', qq.question_text,
        'options', (SELECT jsonb_agg(jsonb_build_object('id', o.id, 'option_text', o.option_text) ORDER BY o.order_index)
                    FROM public.quiz_options o WHERE o.question_id = qq.id)
      ) ORDER BY array_position(a.question_order, qq.id)), '[]'::jsonb)
      FROM public.quiz_questions qq WHERE qq.id = ANY(a.question_order)
    ),
    'saved_answers', (
      SELECT COALESCE(jsonb_object_agg(question_id, selected_option_id), '{}'::jsonb)
      FROM public.quiz_answers WHERE attempt_id = a.id
    )
  );
END; $$;

-- Autosave a draft answer
CREATE OR REPLACE FUNCTION public.save_quiz_answer(p_attempt_id UUID, p_question_id UUID, p_option_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.quiz_attempts%ROWTYPE;
BEGIN
  SELECT * INTO a FROM public.quiz_attempts WHERE id = p_attempt_id AND student_id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'ATTEMPT_NOT_FOUND'; END IF;
  IF a.status <> 'in_progress' THEN RAISE EXCEPTION 'ATTEMPT_CLOSED'; END IF;
  IF a.expires_at IS NOT NULL AND a.expires_at < NOW() THEN RAISE EXCEPTION 'ATTEMPT_EXPIRED'; END IF;
  IF NOT (p_question_id = ANY(a.question_order)) THEN RAISE EXCEPTION 'INVALID_QUESTION'; END IF;
  IF p_option_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.quiz_options WHERE id = p_option_id AND question_id = p_question_id) THEN
    RAISE EXCEPTION 'INVALID_OPTION';
  END IF;
  INSERT INTO public.quiz_answers (attempt_id, question_id, selected_option_id)
  VALUES (p_attempt_id, p_question_id, p_option_id)
  ON CONFLICT (attempt_id, question_id) DO UPDATE SET selected_option_id = EXCLUDED.selected_option_id;
END; $$;

-- Server-side scoring
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(p_attempt_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  a public.quiz_attempts%ROWTYPE;
  q public.quizzes%ROWTYPE;
  correct INTEGER;
  total INTEGER;
  pct NUMERIC;
BEGIN
  SELECT * INTO a FROM public.quiz_attempts WHERE id = p_attempt_id;
  IF NOT FOUND OR (a.student_id <> auth.uid() AND auth.uid() IS NOT NULL) THEN RAISE EXCEPTION 'ATTEMPT_NOT_FOUND'; END IF;
  SELECT * INTO q FROM public.quizzes WHERE id = a.quiz_id;

  IF a.status = 'in_progress' THEN
    UPDATE public.quiz_answers qa SET is_correct = COALESCE(o.is_correct, FALSE)
      FROM public.quiz_options o WHERE qa.attempt_id = a.id AND o.id = qa.selected_option_id;
    UPDATE public.quiz_answers SET is_correct = FALSE WHERE attempt_id = a.id AND selected_option_id IS NULL;

    total := COALESCE(array_length(a.question_order, 1), 0);
    SELECT COUNT(*) INTO correct FROM public.quiz_answers WHERE attempt_id = a.id AND is_correct;
    pct := CASE WHEN total = 0 THEN 0 ELSE ROUND(correct::NUMERIC * 100 / total, 2) END;

    UPDATE public.quiz_attempts SET status = 'submitted', completed_at = NOW(),
      score = pct, passed = pct >= q.passing_percentage, correct_answers = correct, total_questions = total,
      time_spent_seconds = LEAST(EXTRACT(EPOCH FROM (NOW() - started_at))::INT,
        COALESCE(q.time_limit_minutes * 60, 2147483647))
    WHERE id = a.id RETURNING * INTO a;
  END IF;

  RETURN jsonb_build_object('attempt_id', a.id, 'score', a.score, 'passed', a.passed,
    'correct_answers', a.correct_answers, 'total_questions', a.total_questions,
    'show_results', q.show_results_immediately);
END; $$;

-- Post-submission review (correct answers revealed only after submit and if allowed)
CREATE OR REPLACE FUNCTION public.get_attempt_review(p_attempt_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.quiz_attempts%ROWTYPE; q public.quizzes%ROWTYPE;
BEGIN
  SELECT * INTO a FROM public.quiz_attempts WHERE id = p_attempt_id;
  IF NOT FOUND OR (a.student_id <> auth.uid() AND NOT public.is_admin_or_teacher()) THEN RAISE EXCEPTION 'ATTEMPT_NOT_FOUND'; END IF;
  IF a.status <> 'submitted' THEN RAISE EXCEPTION 'ATTEMPT_NOT_SUBMITTED'; END IF;
  SELECT * INTO q FROM public.quizzes WHERE id = a.quiz_id;
  IF NOT q.show_results_immediately AND NOT public.is_admin_or_teacher() THEN
    RETURN jsonb_build_object('hidden', TRUE, 'score', a.score, 'passed', a.passed);
  END IF;
  RETURN jsonb_build_object(
    'hidden', FALSE, 'score', a.score, 'passed', a.passed, 'quiz_title', q.title,
    'correct_answers', a.correct_answers, 'total_questions', a.total_questions,
    'items', (SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'question_id', qq.id, 'question_text', qq.question_text, 'explanation', qq.explanation,
        'selected_option_id', qa.selected_option_id, 'is_correct', COALESCE(qa.is_correct, FALSE),
        'options', (SELECT jsonb_agg(jsonb_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct) ORDER BY o.order_index)
                    FROM public.quiz_options o WHERE o.question_id = qq.id)
      ) ORDER BY array_position(a.question_order, qq.id)), '[]'::jsonb)
      FROM public.quiz_questions qq
      LEFT JOIN public.quiz_answers qa ON qa.attempt_id = a.id AND qa.question_id = qq.id
      WHERE qq.id = ANY(a.question_order))
  );
END; $$;

-- Public certificate verification (limited fields only)
CREATE OR REPLACE FUNCTION public.verify_certificate(p_verification_id TEXT)
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('verification_id', c.verification_id, 'issued_at', c.issued_at,
    'student_name', p.full_name, 'course_title', co.title, 'cefr_level', co.cefr_level)
  FROM public.certificates c
  JOIN public.profiles p ON p.id = c.student_id
  JOIN public.courses co ON co.id = c.course_id
  WHERE c.verification_id = upper(p_verification_id);
$$;

-- Issue certificate when every published lesson is completed (callable by the student)
CREATE OR REPLACE FUNCTION public.claim_certificate(p_course_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE total INT; done INT; vid TEXT; existing TEXT; enabled BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
  IF NOT public.is_enrolled_in_course(p_course_id) THEN RAISE EXCEPTION 'NOT_ENROLLED'; END IF;
  SELECT certificate_enabled INTO enabled FROM public.courses WHERE id = p_course_id;
  IF NOT COALESCE(enabled, FALSE) THEN RAISE EXCEPTION 'CERTIFICATE_DISABLED'; END IF;
  SELECT verification_id INTO existing FROM public.certificates WHERE student_id = auth.uid() AND course_id = p_course_id;
  IF existing IS NOT NULL THEN RETURN jsonb_build_object('verification_id', existing); END IF;
  SELECT COUNT(*) INTO total FROM public.lessons WHERE course_id = p_course_id AND is_published;
  SELECT COUNT(*) INTO done FROM public.lesson_progress lp JOIN public.lessons l ON l.id = lp.lesson_id
    WHERE lp.student_id = auth.uid() AND lp.course_id = p_course_id AND lp.is_completed AND l.is_published;
  IF total = 0 OR done < total THEN RAISE EXCEPTION 'COURSE_NOT_COMPLETED'; END IF;
  vid := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  INSERT INTO public.certificates (student_id, course_id, verification_id) VALUES (auth.uid(), p_course_id, vid);
  UPDATE public.enrollments SET status = 'completed', completed_at = NOW()
    WHERE student_id = auth.uid() AND course_id = p_course_id;
  RETURN jsonb_build_object('verification_id', vid);
END; $$;

-- Fan-out announcement to notifications
CREATE OR REPLACE FUNCTION public.fanout_announcement() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.is_published AND (TG_OP = 'INSERT' OR NOT OLD.is_published) THEN
    INSERT INTO public.notifications (user_id, title, message, type, link, announcement_id)
    SELECT DISTINCT p.id, NEW.title, left(NEW.content, 280), 'info', '/ogrenci/bildirimler', NEW.id
    FROM public.profiles p
    JOIN public.user_roles r ON r.user_id = p.id AND r.role = 'student'
    WHERE NEW.course_id IS NULL OR EXISTS (
      SELECT 1 FROM public.enrollments e WHERE e.student_id = p.id AND e.course_id = NEW.course_id);
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_fanout_announcement ON public.announcements;
CREATE TRIGGER trg_fanout_announcement AFTER INSERT OR UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.fanout_announcement();

-- Lock down function execution
REVOKE ALL ON FUNCTION public.submit_quiz_attempt(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.start_quiz_attempt(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.save_quiz_answer(UUID, UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_attempt_review(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_certificate(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(UUID), public.start_quiz_attempt(UUID),
  public.save_quiz_answer(UUID, UUID, UUID), public.get_attempt_review(UUID),
  public.claim_certificate(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_certificate(TEXT) TO anon, authenticated;

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('course-covers', 'course-covers', TRUE, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('blog-images', 'blog-images', TRUE, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('lesson-resources', 'lesson-resources', FALSE, 26214400,
     ARRAY['application/pdf','image/jpeg','image/png','audio/mpeg','application/zip']),
  ('lesson-videos', 'lesson-videos', FALSE, 524288000, ARRAY['video/mp4','video/webm'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY storage_public_read ON storage.objects FOR SELECT
  USING (bucket_id IN ('course-covers','blog-images'));
CREATE POLICY storage_staff_write ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('course-covers','blog-images','lesson-resources','lesson-videos') AND public.is_admin_or_teacher());
CREATE POLICY storage_staff_update ON storage.objects FOR UPDATE USING (public.is_admin_or_teacher());
CREATE POLICY storage_staff_delete ON storage.objects FOR DELETE USING (public.is_admin_or_teacher());
CREATE POLICY storage_staff_read_private ON storage.objects FOR SELECT
  USING (bucket_id IN ('lesson-resources','lesson-videos') AND public.is_admin_or_teacher());
-- Students receive short-lived signed URLs generated server-side after enrollment checks.
