import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Mudrankseva',
  description: 'Refund and cancellation policy for Mudrankseva property documentation services.',
}

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund & Cancellation Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2026</p>
        {[
          { heading: 'Online document services (₹299 and above)', body: 'If your document has not yet been generated, you may request a full refund within 24 hours of payment by contacting us on WhatsApp. Once a document has been generated and delivered, refunds are not available as the service has been rendered.' },
          { heading: 'Doorstep registration service (₹999–₹1299)', body: 'You may cancel your doorstep registration booking up to 24 hours before the scheduled appointment for a full refund. Cancellations within 24 hours of the appointment will incur a 50% cancellation fee to cover executive scheduling costs. No refund is available after the executive has visited your location.' },
          { heading: 'Government fees', body: 'Stamp duty and registration fees paid to the Maharashtra government are non-refundable under any circumstances as these are government charges outside our control.' },
          { heading: 'How to request a refund', body: 'Contact us on WhatsApp at +91 77559 84622 or email hello@mudrankseva.in with your order details. Approved refunds are processed within 5-7 business days to your original payment method.' },
          { heading: 'Disputes', body: 'If you are unhappy with our service, please contact us first and we will do our best to resolve the issue. We take customer satisfaction seriously and will work with you to find a fair resolution.' },
        ].map(section => (
          <div key={section.heading} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-4">
          <p className="text-sm text-gray-600">Questions about a refund? <Link href="https://wa.me/917755984622" className="text-amber-600 font-medium hover:underline">Contact us on WhatsApp</Link> — we respond within 2 hours.</p>
        </div>
      </main>
    </>
  )
}
