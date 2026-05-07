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

export function Nav() {
  const [citiesOpen, setCitiesOpen] = useState(false)

  return (
    <nav className="bg-[#6B1B1B] border-b border-[#7d2020]">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-12">
        <div className="relative mr-2">
          <button
            onClick={() => setCitiesOpen(o => !o)}
            className="flex items-center gap-1 text-[#e8d5b0] hover:text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition"
          >
            Cities
            <svg className={`w-3.5 h-3.5 transition-transform ${citiesOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {citiesOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
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

        <Link href="/rent-agreement" className="text-[#e8d5b0] hover:text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition">
          Rent Agreement
        </Link>
        <Link href="/sales-deed" className="text-[#e8d5b0] hover:text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition">
          Sale Deed
        </Link>
        <Link href="/calculator" className="text-[#e8d5b0] hover:text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition">
          Calculator
        </Link>
        <Link href="/blog" className="text-[#e8d5b0] hover:text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition">
          Blog
        </Link>

        <div className="ml-auto">
          <Link
            href="/doorstep-registration"
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Doorstep Service
          </Link>
        </div>
      </div>
    </nav>
  )
}
