import { useState } from 'react'
import { FaQuoteRight } from 'react-icons/fa'
import aboutBanner from '../../assets/about-banner.jpg.png'
const testimonials = [
  {
    id: 1,
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque felis vitae tortor augue. Velit nascetur Consequat faucibus porttitor enim et.',
    name: 'John Doe',
    role: 'Patient',
  },
  {
    id: 2,
    quote: 'Quisque placerat scelerisque tortor ornare ornare. Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et lorem ipsum dolor sit amet.',
    name: 'Jane Smith',
    role: 'Patient',
  },
  {
    id: 3,
    quote: 'Convallis felis vitae tortor augue. Velit nascetur proin massa in. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare.',
    name: 'Mark Johnson',
    role: 'Patient',
  },
]

const AboutTestimonial = () => {
  const [active, setActive] = useState(0)

  return (
    <section
      className="relative py-20 px-6 overflow-hidden"
      style={{
        backgroundImage: `url(${aboutBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative max-w-2xl mx-auto text-center text-white">
        {/* quote icon */}
        <FaQuoteRight className="text-cyan text-4xl mx-auto mb-6" />

        {/* quote text */}
        <p className="text-gray-200 text-sm leading-relaxed mb-6 min-h-[80px] transition-all">
          {testimonials[active].quote}
        </p>

        {/* divider */}
        <div className="w-16 border-t border-white mx-auto mb-4" />

        {/* name */}
        <p className="text-white font-medium text-sm">
          {testimonials[active].name}
        </p>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition ${active === i ? 'bg-white' : 'bg-white/40'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutTestimonial