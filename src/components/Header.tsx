'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const MARATHI_ROUTES: Record<string, string> = {
  '/': '/',
  '/about': '/about-mr',
  '/contact': '/contact-mr',
  '/privacy-policy': '/privacy-policy-mr',
  '/terms': '/terms-mr',
  '/refund-policy': '/refund-policy-mr',
  '/disclaimer': '/disclaimer-mr',
  '/rent-agreement': '/rent-agreement',
  '/sales-deed': '/sales-deed',
  '/gift-deed': '/gift-deed',
  '/poa': '/poa',
  '/calculator': '/calculator',
  '/blog': '/blog',
  '/doorstep-registration': '/doorstep-registration',
}

function getMarathiPath(path: string): string {
  if (MARATHI_ROUTES[path]) return MARATHI_ROUTES[path]
  if (path.startsWith('/cities/') && !path.endsWith('-mr')) return path + '-mr'
  if (path.startsWith('/cities/') && path.endsWith('-mr')) return path
  return path
}

function getEnglishPath(path: string): string {
  if (path.endsWith('-mr')) {
    const base = path.replace(/-mr$/, '')
    if (path.startsWith('/cities/')) return base
    const reverse = Object.entries(MARATHI_ROUTES).find(([, v]) => v === path)
    if (reverse) return reverse[0]
  }
  return path
}

function isMarathiPath(path: string): boolean {
  return Object.values(MARATHI_ROUTES).includes(path) && path !== '/'
    ? path !== getEnglishPath(path)
    : path.endsWith('-mr')
}

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState<'en' | 'mr'>('en')

  useEffect(() => {
    const stored = localStorage.getItem('mudrankseva-lang') as 'en' | 'mr' | null
    if (stored) {
      setLang(stored)
    } else if (isMarathiPath(pathname)) {
      setLang('mr')
    }
  }, [pathname])

  function handleLangToggle(newLang: 'en' | 'mr') {
    setLang(newLang)
    localStorage.setItem('mudrankseva-lang', newLang)
    window.dispatchEvent(new Event('mudrankseva-lang-change'))
    if (newLang === 'mr') {
      const marathiPath = getMarathiPath(pathname)
      if (marathiPath !== pathname) router.push(marathiPath)
    } else {
      const englishPath = getEnglishPath(pathname)
      if (englishPath !== pathname) router.push(englishPath)
    }
  }

  return (
    <header className="bg-[#6B1B1B] px-4 py-3 flex items-center justify-between">
      <Link href="/">
        <div className="bg-[#f5f0e8] border border-[#c9a84c] rounded-full px-3 py-1 flex items-center gap-2">
          <Image src="/logo.jpg" alt="Mudrankseva" width={36} height={36} className="rounded-full" />
          <span className="text-[#6B1B1B] text-xs font-bold tracking-wide hidden sm:inline">MUDRANKSEVA</span>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[#5a1515] rounded-full p-0.5 border border-[#7d2020]">
          <button
            onClick={() => handleLangToggle('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              lang === 'en' ? 'bg-[#c9a84c] text-white' : 'text-[#e8d5b0] hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLangToggle('mr')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              lang === 'mr' ? 'bg-[#c9a84c] text-white' : 'text-[#e8d5b0] hover:text-white'
            }`}
          >
            मराठी
          </button>
        </div>
        <span className="hidden sm:inline text-[#c9a84c] text-xs font-semibold border border-[#c9a84c] rounded-full px-3 py-1">
          MAHARASHTRA
        </span>
      </div>
    </header>
  )
}
