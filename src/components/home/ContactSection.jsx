import { MdPhone, MdLocationOn, MdEmail, MdAccessTime } from 'react-icons/md'

const contacts = [
  { icon: <MdPhone size={28} />, title: 'Emergency', lines: ['(237) 681-812-255', '(237) 666-331-894'] },
  { icon: <MdLocationOn size={28} />, title: 'Location', lines: ['0123 Some place', '9876 Some country'] },
  { icon: <MdEmail size={28} />, title: 'Email', lines: ['fildineeesoe@gmil.com', 'myebstudios@gmail.com'] },
  { icon: <MdAccessTime size={28} />, title: 'Working Hours', lines: ['Mon-Sat 09:00-20:00', 'Sunday Emergency only'] },
]

const ContactSection = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
            Get In Touch
          </p>
          <h2 className="text-4xl font-bold text-navy font-serif">Contact</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {contacts.map((item, i) => (
            <div key={item.title} className={`p-8 rounded-lg ${i === 1 ? 'bg-navy text-white' : 'bg-bg-light text-navy'}`}>
              <div className={`mb-4 ${i === 1 ? 'text-white' : 'text-navy'}`}>{item.icon}</div>
              <h4 className="font-bold text-xs tracking-widest uppercase mb-3">{item.title}</h4>
              {item.lines.map((line) => (
                <p key={line} className={`text-sm ${i === 1 ? 'text-gray-300' : 'text-gray-600'}`}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContactSection