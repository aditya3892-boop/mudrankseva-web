'use client'
import { useState } from 'react'
import Image from 'next/image'
import { type Lang } from '@/lib/content'

export function Header() {
  const [lang, setLang] = useState<Lang>('en')

  return (
    <header className="bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
      <div className="rounded-xl overflow-hidden border border-gold/30 bg-cream px-3 py-1.5 flex-shrink-0">
        <Image
          src="/logo.jpg"
          alt="Mudrankseva — मुद्रांकसेवा"
          width={200}
          height={48}
          priority
          className="h-11 w-auto object-contain"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-gold/50 overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 transition-colors ${lang === 'en' ? 'bg-gold text-oxblood-dark' : 'text-gold/70 hover:text-gold'}`}
          >
            EN
          </button>
          <span className="w-px h-4 bg-gold/30" />
          <button
            onClick={() => setLang('mr')}
            className={`px-3.5 py-1.5 font-devanagari transition-colors ${lang === 'mr' ? 'bg-gold text-oxblood-dark' : 'text-gold/70 hover:text-gold'}`}
          >
            मराठी
          </button>
        </div>
        <span className="hidden sm:inline text-xs text-gold/70 border border-gold/35 rounded-full px-3 py-1 tracking-widest uppercase font-sans">
          Maharashtra
        </span>
      </div>
    </header>
  )
}
