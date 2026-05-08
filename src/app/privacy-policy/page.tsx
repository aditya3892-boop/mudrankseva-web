import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Privacy Policy | Mudrankseva',
  description: 'Privacy Policy for Mudrankseva — how we collect, use and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2026</p>
        {[
          { heading: '1. Information we collect', body: 'We collect information you provide when using our services — including your name, phone number, email address, Aadhaar number (for registration purposes only), and property details. We also collect basic usage data such as pages visited and device type to improve our platform.' },
          { heading: '2. How we use your information', body: 'Your information is used solely to provide the service you have requested — drafting documents, processing registrations, and communicating with you about your order. We do not sell, rent, or share your personal data with third parties for marketing purposes.' },
          { heading: '3. Aadhaar and biometric data', body: 'Aadhaar information collected during the registration process is used only for the purpose of document registration with the Maharashtra government\'s IGR portal. Biometric data is processed through the official government biometric system and is not stored on our servers.' },
          { heading: '4. Data security', body: 'We use industry-standard encryption and security practices to protect your data. All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your payment card details.' },
          { heading: '5. Data retention', body: 'We retain your documents and personal information for a period of 3 years to allow you to re-download documents and for legal compliance purposes. You may request deletion of your data by contacting us at hello@mudrankseva.in.' },
          { heading: '6. Cookies', body: 'We use minimal cookies required for the website to function. We do not use advertising or tracking cookies.' },
          { heading: '7. Contact', body: 'For any privacy-related questions, contact us at hello@mudrankseva.in or on WhatsApp at +91 77559 84622.' },
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
