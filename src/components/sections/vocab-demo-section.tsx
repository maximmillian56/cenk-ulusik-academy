'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, RefreshCw, Volume2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const vocabCards = [
  {
    word: 'Perseverance',
    phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
    level: 'B2',
    partOfSpeech: 'noun (isim)',
    turkish: 'Azim, kararlılık, sebat',
    sentence: 'Learning English requires patience and perseverance.',
    sentenceTr: 'İngilizce öğrenmek sabır ve kararlılık gerektirir.',
  },
  {
    word: 'Fluency',
    phonetic: '/ˈfluː.ən.si/',
    level: 'B1',
    partOfSpeech: 'noun (isim)',
    turkish: 'Akıcılık, fasihlik',
    sentence: 'Daily speaking practice is essential for fluency.',
    sentenceTr: 'Günlük konuşma pratiği akıcılık için elzemdir.',
  },
  {
    word: 'Confidence',
    phonetic: '/ˈkɒn.fɪ.dəns/',
    level: 'A2',
    partOfSpeech: 'noun (isim)',
    turkish: 'Özgüven, güven',
    sentence: 'Speak with confidence even if you make mistakes.',
    sentenceTr: 'Hata yapsanız bile özgüvenle konuşun.',
  },
  {
    word: 'Eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    level: 'C1',
    partOfSpeech: 'adjective (sıfat)',
    turkish: 'Dili güzel kullanan, etkili konuşan',
    sentence: 'She gave an eloquent speech at the international conference.',
    sentenceTr: 'Uluslararası konferansta etkileyici ve akıcı bir konuşma yaptı.',
  },
  {
    word: 'Opportunity',
    phonetic: '/ˌɒp.əˈtjuː.nə.ti/',
    level: 'A2',
    partOfSpeech: 'noun (isim)',
    turkish: 'Fırsat, olanak',
    sentence: 'English opens up endless career opportunities.',
    sentenceTr: 'İngilizce sonsuz kariyer fırsatlarının kapısını açar.',
  },
]

export function VocabDemoSection() {
  const [index, setIndex] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)

  const current = vocabCards[index]

  const handleNext = () => {
    setIsFlipped(false)
    setIndex((prev) => (prev + 1) % vocabCards.length)
  }

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Badge variant="outline" className="text-gold-600 dark:text-gold-400 border-gold-500/30 px-3 py-1 mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            İnteraktif Kelime Kartı
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Kelimeleri Bağlamıyla Öğrenin
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Kartın üzerine tıklayarak Türkçe karşılığını ve örnek cümlesini keşfedin.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[300px] rounded-3xl p-8 bg-card border-2 border-royal-600/30 dark:border-royal-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group hover:scale-[1.02]"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <Badge variant="gold" className="font-bold text-xs">
                {current.level}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                {current.partOfSpeech}
              </span>
            </div>

            {/* Center Content */}
            <div className="text-center py-6">
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="en"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-display text-4xl sm:text-5xl font-black text-foreground mb-2">
                      {current.word}
                    </h3>
                    <p className="text-royal-600 dark:text-royal-400 font-mono text-sm">
                      {current.phonetic}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-muted-foreground hover:text-royal-600 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSpeak(current.word)
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                        Telaffuzu Dinle
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tr"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <span className="text-xs uppercase font-bold text-gold-600 dark:text-gold-400">
                      Türkçe Anlamı
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      {current.turkish}
                    </h3>
                    <div className="p-3 rounded-2xl bg-muted/60 text-left mt-3">
                      <p className="text-xs font-semibold text-foreground">
                        &ldquo;{current.sentence}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {current.sentenceTr}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom cue */}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-4">
              <span>{index + 1} / {vocabCards.length}</span>
              <span className="text-royal-600 dark:text-royal-400 font-medium">
                {isFlipped ? 'İngilizceye dön' : 'Anlamı görmek için dokun'} ↻
              </span>
            </div>
          </div>

          {/* Controller */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleNext}
              className="gap-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Sıradaki Kelime
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
