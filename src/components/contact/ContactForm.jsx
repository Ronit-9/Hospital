import { useState } from 'react'
import { MdPhone, MdLocationOn, MdEmail, MdAccessTime } from 'react-icons/md'
import { useSendMessageMutation } from '../../store/api/contactApi'

const contacts = [
  { icon: <MdPhone size={24} />, title: 'Emergency', lines: ['(237) 681-812-255', '(237) 666-331-894'] },
  { icon: <MdLocationOn size={24} />, title: 'Location', lines: ['0123 Some place', '9876 Some country'] },
  { icon: <MdEmail size={24} />, title: 'Email', lines: ['fildineeesoe@gmil.com', 'myebstudios@gmail.com'] },
  { icon: <MdAccessTime size={24} />, title: 'Working Hours', lines: ['Mon-Sat 09:00-20:00', 'Sunday Emergency only'] },
]

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [sendMessage, { isLoading }] = useSendMessageMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await sendMessage(form).unwrap()
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.data?.message || 'Failed to send message')
    }
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* left form */}
          <div className="flex-1 min-w-0">
            <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-1">
              Get In Touch
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-serif mb-6">Contact</h2>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-semibold text-lg mb-1">Message Sent!</h3>
                <p className="text-sm">We will get back to you soon.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-cyan text-sm underline"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-200">
                  <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="p-4 border-b sm:border-r border-gray-200 text-sm outline-none focus:bg-bg-light"
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="p-4 border-b border-gray-200 text-sm outline-none focus:bg-bg-light"
                  />
                  <textarea
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    rows={1}
                    className="col-span-1 sm:col-span-2 p-4 border-b border-gray-200 text-sm outline-none focus:bg-bg-light resize-none"
                  />
                  <textarea
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="col-span-1 sm:col-span-2 p-4 border-b border-gray-200 text-sm outline-none focus:bg-bg-light resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-bg-light text-navy py-4 font-semibold tracking-widest uppercase text-sm hover:bg-cyan hover:text-white transition border border-t-0 border-gray-200 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Submit'}
                </button>
              </>
            )}
          </div>

          {/* right contact cards */}
          <div className="w-full lg:w-72 flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 content-start">
            {contacts.map((item, i) => (
              <div
                key={item.title}
                className={`p-4 sm:p-5 rounded-lg ${i === 1 ? 'bg-navy text-white' : 'bg-bg-light text-navy'}`}
              >
                <div className={`mb-3 ${i === 1 ? 'text-white' : 'text-navy'}`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-xs tracking-widest uppercase mb-2">
                  {item.title}
                </h4>
                {item.lines.map((line) => (
                  <p key={line} className={`text-xs leading-relaxed ${i === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default ContactForm