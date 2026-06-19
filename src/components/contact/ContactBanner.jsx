import { Link } from 'react-router-dom'
import contactBanner from '../../assets/contact.jpg'

const ContactBanner = () => {
  return (
    <section
      className="relative h-40 sm:h-48 md:h-56 flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${contactBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-navy/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
          <Link to="/" className="hover:text-cyan transition">Home</Link>
          <span>/</span>
          <span className="text-white">Contact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Our Contacts</h1>
      </div>
    </section>
  )
}

export default ContactBanner