import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | Mudrankseva',
  description: 'Contact Mudrankseva for help with rent agreements, property registration, stamp duty and more. Available 7 days a week on WhatsApp.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-500 mb-10">We are based in Pune and available 7 days a week. Fastest response is on WhatsApp.</p>
        <div className="space-y-4 mb-10">
          {[
            { label: 'WhatsApp', value: '+91 77559 84622', href: 'https://wa.me/917755984622' },
            { label: 'Email', value: 'hello@mudrankseva.in', href: 'mailto:hello@mudrankseva.in' },
            { label: 'Location', value: 'Pune, Maharashtra', href: null },
            { label: 'Hours', value: 'Monday – Sunday, 9 AM to 8 PM', href: null },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-4 border border-gray-200 rounded-xl px-5 py-4">
              <span className="text-sm font-medium text-gray-500 w-24 shrink-0">{item.label}</span>
              {item.href ? (
                <Link href={item.href} className="text-amber-600 hover:underline font-medium">{item.value}</Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-gray-900 mb-2">Quickest way to reach us</p>
          <p className="text-sm text-gray-600 mb-4">Send us a WhatsApp message and we will respond within 2 hours during business hours.</p>
          <Link href="https://wa.me/917755984622?text=Hi, I need help with a property document" className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition inline-block">
            Open WhatsApp
          </Link>
        </div>
      </main>
    </>
  )
}
