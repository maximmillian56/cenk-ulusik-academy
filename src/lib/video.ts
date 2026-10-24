import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Video source abstraction.
 * - demo: locally configured sample media, clearly labeled "Demo" in the UI. NOT secure delivery.
 * - mux: signed playback (requires MUX_SIGNING_KEY_ID + MUX_SIGNING_PRIVATE_KEY).
 * - cloudflare: signed tokens via Cloudflare Stream API (requires CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_STREAM_TOKEN).
 * - external / storage path: short-lived Supabase Storage signed URL from private bucket "lesson-videos".
 * Public YouTube embeds are intentionally unsupported for paid content.
 */
export type VideoProvider = 'demo' | 'mux' | 'cloudflare' | 'external'

export interface PlaybackSource {
  kind: 'mp4' | 'hls' | 'iframe' | 'none'
  url: string | null
  provider: VideoProvider
  isDemo: boolean
  notice?: string
}

const DEMO_FALLBACK = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || '/demo/demo-lesson.mp4'

export async function resolvePlayback(provider: VideoProvider, ref: string | null): Promise<PlaybackSource> {
  if (!ref && provider !== 'demo') {
    return { kind: 'none', url: null, provider, isDemo: false, notice: 'Bu ders için henüz video eklenmedi.' }
  }

  switch (provider) {
    case 'mux': {
      const token = await signMuxToken(ref!)
      if (!token) {
        return { kind: 'none', url: null, provider, isDemo: false, notice: 'Mux imzalama anahtarları yapılandırılmamış.' }
      }
      return { kind: 'hls', url: `https://stream.mux.com/${ref}.m3u8?token=${token}`, provider, isDemo: false }
    }
    case 'cloudflare': {
      const token = await signCloudflareToken(ref!)
      if (!token) {
        return { kind: 'none', url: null, provider, isDemo: false, notice: 'Cloudflare Stream yapılandırılmamış.' }
      }
      return { kind: 'iframe', url: `https://iframe.videodelivery.net/${token}`, provider, isDemo: false }
    }
    case 'external': {
      // ref is a path inside the private "lesson-videos" bucket
      const admin = createAdminClient()
      if (!admin) return { kind: 'none', url: null, provider, isDemo: false, notice: 'Depolama yapılandırılmamış.' }
      const { data } = await admin.storage.from('lesson-videos').createSignedUrl(ref!, 60 * 60)
      return data?.signedUrl
        ? { kind: 'mp4', url: data.signedUrl, provider, isDemo: false }
        : { kind: 'none', url: null, provider, isDemo: false, notice: 'Video dosyası bulunamadı.' }
    }
    case 'demo':
    default:
      return {
        kind: 'mp4',
        url: ref || DEMO_FALLBACK,
        provider: 'demo',
        isDemo: true,
        notice: 'Demo modu: Bu örnek bir videodur, gerçek ders içeriği değildir.',
      }
  }
}

async function signMuxToken(playbackId: string): Promise<string | null> {
  const keyId = process.env.MUX_SIGNING_KEY_ID
  const privateKeyB64 = process.env.MUX_SIGNING_PRIVATE_KEY
  if (!keyId || !privateKeyB64) return null
  try {
    const { createSign } = await import('node:crypto')
    const header = { alg: 'RS256', typ: 'JWT', kid: keyId }
    const payload = { sub: playbackId, aud: 'v', exp: Math.floor(Date.now() / 1000) + 3600, kid: keyId }
    const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url')
    const data = `${enc(header)}.${enc(payload)}`
    const signer = createSign('RSA-SHA256')
    signer.update(data)
    const sig = signer.sign(Buffer.from(privateKeyB64, 'base64').toString('utf8')).toString('base64url')
    return `${data}.${sig}`
  } catch {
    return null
  }
}

async function signCloudflareToken(videoId: string): Promise<string | null> {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_STREAM_TOKEN
  if (!account || !apiToken) return null
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/stream/${videoId}/token`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}` },
      cache: 'no-store',
    })
    const json = (await res.json()) as { result?: { token?: string } }
    return json.result?.token ?? null
  } catch {
    return null
  }
}
