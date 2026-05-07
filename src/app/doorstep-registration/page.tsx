'use client'
import { useState } from 'react'
import Link from 'next/link'

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

export default function DoorstepRegistration() {
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
  const isMR = service.id === 'rent-agreement' ? 999 : 1299

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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent</h1>
          <p className="text-gray-500 mb-6">
            Our team will confirm your appointment within 2 hours on WhatsApp.
            The executive will arrive at your address within 48 hours of confirmation.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
            <p className="font-semibold mb-1">What happens next</p>
            <ol className="text-left space-y-1 list-decimal list-inside">
              <li>Team confirms slot on WhatsApp</li>
              <li>Executive visits your address</li>
              <li>Biometrics collected from both parties</li>
              <li>SRO registration completed</li>
              <li>Registered document delivered by email</li>
            </ol>
          </div>
          <Link href="/" className="text-amber-600 hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm your booking</h1>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 mb-6">
            {[
              ['Service', service.label],
              ['Name', form.name],
              ['Phone', form.phone],
              ['Address', `${form.address}, ${form.city}`],
              ['Date', form.date],
              ['Time slot', form.slot],
              ['Amount', `₹${price}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between px-5 py-3 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Clicking confirm will open WhatsApp with your booking details.
            Payment is collected by the executive at your doorstep.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Edit
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Confirm & WhatsApp
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doorstep Registration</h1>
        <p className="text-gray-500 mb-4">
          Our executive visits your address, collects biometrics, and completes SRO registration.
          Payment collected at doorstep. Turnaround: 48 hours.
        </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-8">
            📍 Doorstep service is currently available in <strong>Pune and Pimpri-Chinchwad</strong> only.
            We are expanding to Mumbai, Thane and Nashik soon.{' '}
            <Link href="https://wa.me/917755984622" className="underline font-medium">
              Contact us on WhatsApp
            </Link>{' '}
            if your city is not listed.
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Rahul Deshmukh"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Full address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Flat 4B, Sahyadri Apartments, Karve Road"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Pune"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred date</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Time slot</label>
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
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any special instructions for the executive"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition mt-2"
          >
            Review booking — ₹{price}
          </button>
        </form>

        <div className="mt-8 bg-gray-50 rounded-xl p-5 text-sm text-gray-500">
          <p className="font-medium text-gray-700 mb-2">What&apos;s included</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Document drafting &amp; review</li>
            <li>Stamp duty calculation &amp; payment</li>
            <li>Executive visit for biometric collection</li>
            <li>SRO registration</li>
            <li>Registered document delivered by email</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
