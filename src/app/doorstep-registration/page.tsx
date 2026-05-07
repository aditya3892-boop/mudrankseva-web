'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { Header } from '@/components/Header'

const SERVICES = [
  { id: 'rent-agreement', label: 'Rent Agreement', price: 999 },
  { id: 'sale-deed', label: 'Sale Deed', price: 1299 },
  { id: 'gift-deed', label: 'Gift Deed', price: 1299 },
  { id: 'poa', label: 'Power of Attorney', price: 1299 },
]

const SLOTS = [
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
]

const WHAT_NEXT_EN = [
  'Team confirms slot on WhatsApp',
  'Executive visits your address',
  'Biometrics collected from both parties',
  'SRO registration completed',
  'Registered document delivered by email',
]

const WHAT_NEXT_MR = [
  'टीम WhatsApp वर वेळ निश्चित करते',
  'प्रतिनिधी तुमच्या पत्त्यावर येतो',
  'दोन्ही पक्षांचे बायोमेट्रिक घेतले जाते',
  'SRO नोंदणी पूर्ण होते',
  'नोंदणीकृत दस्तऐवज ईमेलवर मिळतो',
]

export default function DoorstepRegistration() {
  const [lang, setLang] = useState<'en' | 'mr'>('en')
  const [service, setService] = useState(SERVICES[0])
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    date: '',
    slot: SLOTS[0],
    notes: '',
  })

  const price = service.price
  const isMr = lang === 'mr'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('confirm')
  }

  async function handleConfirm() {
    const msg = encodeURIComponent(
      `Hi, I'd like to book a doorstep registration.\n\nService: ${service.label}\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city}\nDate: ${form.date}\nSlot: ${form.slot}\nNotes: ${form.notes || 'None'}\n\nAmount: ₹${price}`
    )
    window.open(`https://wa.me/917755984622?text=${msg}`, '_blank')
    setStep('done')
  }

  if (step === 'done') {
    return (
      <>
        <Header />
        <Nav />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isMr ? 'बुकिंग विनंती पाठवली' : 'Booking Request Sent'}
            </h1>
            <p className="text-gray-500 mb-6">
              {isMr
                ? 'आमची टीम २ तासांत WhatsApp वर तुमची वेळ निश्चित करेल.'
                : 'Our team will confirm your appointment within 2 hours on WhatsApp. The executive will arrive at your address within 48 hours of confirmation.'}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
              <p className="font-semibold mb-1">{isMr ? 'पुढे काय होते' : 'What happens next'}</p>
              <ol className="text-left space-y-1 list-decimal list-inside">
                {(isMr ? WHAT_NEXT_MR : WHAT_NEXT_EN).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
            <Link href="/" className="text-amber-600 hover:underline text-sm">
              {isMr ? 'मुख्यपृष्ठावर परत' : 'Back to home'}
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (step === 'confirm') {
    return (
      <>
        <Header />
        <Nav />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isMr ? 'बुकिंग निश्चित करा' : 'Confirm your booking'}
            </h1>
            <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 mb-6">
              {[
                [isMr ? 'सेवा' : 'Service', service.label],
                [isMr ? 'नाव' : 'Name', form.name],
                [isMr ? 'फोन' : 'Phone', form.phone],
                [isMr ? 'पत्ता' : 'Address', `${form.address}, ${form.city}`],
                [isMr ? 'तारीख' : 'Date', form.date],
                [isMr ? 'वेळ' : 'Time slot', form.slot],
                [isMr ? 'रक्कम' : 'Amount', `₹${price}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              {isMr
                ? 'निश्चित केल्यावर WhatsApp उघडेल. पेमेंट घरी घेतले जाते.'
                : 'Clicking confirm will open WhatsApp with your booking details. Payment is collected by the executive at your doorstep.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition"
              >
                {isMr ? 'संपादित करा' : 'Edit'}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition"
              >
                {isMr ? 'निश्चित करा आणि WhatsApp' : 'Confirm & WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <Nav />
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
            ← {isMr ? 'मागे' : 'Back'}
          </Link>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLang('en')}
              className={`text-sm px-3 py-1 rounded-lg border transition ${lang === 'en' ? 'bg-[#6B1B1B] text-white border-[#6B1B1B]' : 'text-gray-500 border-gray-300 hover:border-gray-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`text-sm px-3 py-1 rounded-lg border transition ${lang === 'mr' ? 'bg-[#6B1B1B] text-white border-[#6B1B1B]' : 'text-gray-500 border-gray-300 hover:border-gray-400'}`}
            >
              मराठी
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isMr ? 'घरपोच नोंदणी' : 'Doorstep Registration'}
          </h1>
          <p className="text-gray-500 mb-4">
            {isMr
              ? 'आमचा प्रतिनिधी तुमच्या घरी येतो, बायोमेट्रिक घेतो आणि SRO नोंदणी पूर्ण करतो. पेमेंट घरी घेतले जाते. कालावधी: ४८ तास.'
              : 'Our executive visits your address, collects biometrics, and completes SRO registration. Payment collected at doorstep. Turnaround: 48 hours.'}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-8">
            {isMr
              ? '📍 घरपोच सेवा सध्या फक्त पुणे आणि पिंपरी-चिंचवडमध्ये उपलब्ध आहे. लवकरच मुंबई, ठाणे आणि नाशिकमध्ये विस्तार होणार आहे.'
              : <>📍 Doorstep service is currently available in <strong>Pune and Pimpri-Chinchwad</strong> only. We are expanding to Mumbai, Thane and Nashik soon.</>}{' '}
            <Link href="https://wa.me/917755984622" className="underline font-medium">
              {isMr ? 'WhatsApp वर संपर्क करा' : 'Contact us on WhatsApp'}
            </Link>{' '}
            {!isMr && 'if your city is not listed.'}
          </div>

          {/* Service picker */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {SERVICES.map(s => (
              <button
                key={s.id}
                onClick={() => setService(s)}
                className={`border rounded-xl p-4 text-left transition ${
                  service.id === s.id
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">{s.label}</p>
                <p className="text-amber-600 font-semibold mt-1">₹{s.price}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isMr ? 'पूर्ण नाव' : 'Full name'}
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={isMr ? 'राहुल देशमुख' : 'Rahul Deshmukh'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isMr ? 'फोन नंबर' : 'Phone number'}
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                type="tel"
                placeholder="98765 43210"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isMr ? 'पूर्ण पत्ता' : 'Full address'}
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={2}
                placeholder={isMr ? 'फ्लॅट ४B, सह्याद्री अपार्टमेंट, कर्वे रोड' : 'Flat 4B, Sahyadri Apartments, Karve Road'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isMr ? 'शहर' : 'City'}
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder={isMr ? 'पुणे' : 'Pune'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? 'पसंतीची तारीख' : 'Preferred date'}
                </label>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? 'वेळ' : 'Time slot'}
                </label>
                <select
                  name="slot"
                  value={form.slot}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                >
                  {SLOTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isMr ? 'टिपा' : 'Notes'}{' '}
                <span className="text-gray-400 font-normal">({isMr ? 'ऐच्छिक' : 'optional'})</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder={isMr ? 'प्रतिनिधीसाठी कोणत्याही विशेष सूचना' : 'Any special instructions for the executive'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition mt-2"
            >
              {isMr ? `बुकिंग तपासा — ₹${price}` : `Review booking — ₹${price}`}
            </button>
          </form>

          <div className="mt-8 bg-gray-50 rounded-xl p-5 text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-2">
              {isMr ? 'समाविष्ट आहे' : "What's included"}
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>{isMr ? 'दस्तऐवज मसुदा आणि तपासणी' : 'Document drafting & review'}</li>
              <li>{isMr ? 'स्टँप ड्युटी गणना आणि पेमेंट' : 'Stamp duty calculation & payment'}</li>
              <li>{isMr ? 'बायोमेट्रिकसाठी प्रतिनिधी भेट' : 'Executive visit for biometric collection'}</li>
              <li>{isMr ? 'SRO नोंदणी' : 'SRO registration'}</li>
              <li>{isMr ? 'नोंदणीकृत दस्तऐवज ईमेलवर' : 'Registered document delivered by email'}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
