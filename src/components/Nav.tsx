'use client'
import { useState } from 'react'
import Link from 'next/link'

const CITIES = [
  { name: 'Pune', slug: 'pune' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Thane', slug: 'thane' },
  { name: 'Nashik', slug: 'nashik' },
  { name: 'Aurangabad', slug: 'aurangabad' },
  { name: 'Kolhapur', slug: 'kolhapur' },
  { name: 'Navi Mumbai', slug: 'navi-mumbai' },
  { name: 'Pimpri-Chinchwad', slug: 'pimpri-chinchwad' },
]

const MORE_LINKS = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Disclaimer', href: '/disclaimer' },
]

export function Nav() {
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <nav className="bg-[#6B1B1B] border-b border-[#7d2020] relative">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-0.5 sm:gap-1 h-12 whitespace-nowrap w-max min-w-full text-xs sm:text-sm">

          {/* Cities dropdown */}
          <div className="relative">
            <button
              onClick={() => { setCitiesOpen(o => !o); setMoreOpen(false) }}
              className="flex items-center gap-1 text-[#e8d5b0] hover:text-white px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition"
            >
              Cities
              <svg className={`w-3.5 h-3.5 transition-transform ${citiesOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {citiesOpen && (
              <div
                className="fixed mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-[9999]"
                style={{ top: 'auto' }}
                onMouseLeave={() => setCitiesOpen(false)}
              >
                {CITIES.map(city => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    onClick={() => setCitiesOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/rent-agreement" className="text-[#e8d5b0] hover:text-white px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition">
            Rent Agreement
          </Link>
          <Link href="/sales-deed" className="text-[#e8d5b0] hover:text-white px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition">
            Sale Deed
          </Link>
          <Link href="/calculator" className="text-[#e8d5b0] hover:text-white px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition">
            Calculator
          </Link>
          <Link href="/blog" className="text-[#e8d5b0] hover:text-white px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition">
            Blog
          </Link>

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => { setMoreOpen(o => !o); setCitiesOpen(false) }}
              className="flex items-center gap-1 text-[#e8d5b0] hover:text-white px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition"
            >
              More
              <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {moreOpen && (
              <div
                className="fixed mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-[9999]"
                onMouseLeave={() => setMoreOpen(false)}
              >
                {MORE_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto pl-2">
            <Link
              href="/doorstep-registration"
              className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg transition whitespace-nowrap"
            >
              Doorstep Service
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}
