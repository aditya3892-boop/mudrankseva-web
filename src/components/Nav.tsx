import Link from 'next/link'

export function Nav() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-11 text-sm">
        <Link href="/" className="text-gray-500 hover:text-gray-900 transition">Home</Link>
        <Link href="/cities/pune" className="text-gray-500 hover:text-gray-900 transition">Cities</Link>
        <Link href="/rent-agreement" className="text-gray-500 hover:text-gray-900 transition">Rent Agreement</Link>
        <Link href="/sales-deed" className="text-gray-500 hover:text-gray-900 transition">Sale Deed</Link>
        <Link href="/calculator" className="text-gray-500 hover:text-gray-900 transition">Calculator</Link>
        <Link href="/blog" className="text-gray-500 hover:text-gray-900 transition">Blog</Link>
        <Link href="/doorstep-registration" className="text-gray-500 hover:text-gray-900 transition ml-auto font-medium text-amber-600">Doorstep Service</Link>
      </div>
    </nav>
  )
}
