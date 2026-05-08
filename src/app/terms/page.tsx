import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Mudrankseva',
  description: 'Terms and Conditions for using Mudrankseva property documentation services.',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2026</p>
        {[
          { heading: '1. About Mudrankseva', body: 'Mudrankseva (mudrankseva.in) is a technology platform that assists individuals with property documentation services in Maharashtra, including rent agreements, sale deeds, gift deeds, power of attorney, and stamp duty calculation. We are not a law firm and do not provide legal advice.' },
          { heading: '2. Disclaimer', body: 'Mudrankseva is not a government website and is not affiliated with the Maharashtra government, IGR Maharashtra, or any government department. We are a private technology service that facilitates document preparation and registration.' },
          { heading: '3. Services', body: 'Our services include AI-assisted document drafting, stamp duty calculation, and facilitation of SRO registration. The final legal validity of all documents depends on compliance with applicable Maharashtra laws and proper execution by the parties involved.' },
          { heading: '4. User responsibilities', body: 'You are responsible for providing accurate information when using our services. Mudrankseva is not liable for errors in documents resulting from incorrect information provided by you. Please review all documents carefully before signing.' },
          { heading: '5. Payments', body: 'All payments are processed securely through Razorpay. Service fees paid to Mudrankseva are for document preparation and facilitation services only and do not include government stamp duty or registration fees, which are payable separately to the government.' },
          { heading: '6. Refunds', body: 'Please refer to our Refund Policy for details on cancellations and refunds.' },
          { heading: '7. Limitation of liability', body: 'Mudrankseva\'s liability is limited to the service fee paid. We are not liable for any loss, damage, or legal consequence arising from the use of documents generated on our platform.' },
          { heading: '8. Governing law', body: 'These terms are governed by the laws of India and the state of Maharashtra. Any disputes shall be subject to the jurisdiction of courts in Pune, Maharashtra.' },
          { heading: '9. Contact', body: 'For any queries regarding these terms, contact us at hello@mudrankseva.in.' },
        ].map(section => (
          <div key={section.heading} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </main>
    </>
  )
}
