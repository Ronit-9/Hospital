import { Link } from 'react-router-dom'
import { MdCalendarMonth, MdGroup, MdPayment } from 'react-icons/md'
import heroImage from '../../assets/hero.jpg'

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[640px] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(to right, #f0f4ff 55%, transparent 100%)' }}
    >
      {/* ✅ top-left decorative blob */}
      <div
        className="absolute top-0 left-0 w-48 h-48 rounded-br-full opacity-40"
        style={{ background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)' }}
      />

      {/* hero image on the right */}
      <div
        className="absolute right-0 top-0 bottom-0 w-3/4"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#f0f4ff] via-[#f0f4ff]/70 to-transparent" />
      </div>

      {/* ✅ decorative blob on the right side too */}
      <div
        className="absolute top-8 right-8 w-32 h-32 rounded-full opacity-30"
        style={{ background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)' }}
      />

      {/* main content */}
      <div className="relative max-w-7xl mx-auto px-6 w-full py-24">
        <p className="text-cyan text-xs font-bold tracking-widest uppercase mb-4">
          Caring For Life
        </p>
        <h1 className="text-5xl font-bold text-navy leading-tight mb-10 max-w-lg">
          Leading the Way<br />in Medical Excellence
        </h1>
        <Link
          to="/services"
          className="inline-block bg-[#dce8f8] text-navy px-10 py-3 rounded-full font-medium hover:bg-cyan hover:text-white transition"
        >
          Our Services
        </Link>
      </div>
      {/* bottom cards — centered with padding */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-3">
            <Link
              to="/appointments/book"
              className="bg-navy text-white p-6 flex items-center justify-between hover:bg-navy-light transition"
            >
              <span className="font-medium text-sm">Book an Appointment</span>
              <MdCalendarMonth size={32} className="opacity-60" />
            </Link>
            <Link
              to="/doctors"
              className="bg-[#c8daf5] text-navy p-6 flex items-center justify-between hover:bg-cyan hover:text-white transition"
            >
              <span className="font-medium text-sm">Book an Appointment</span>
              <MdGroup size={32} className="opacity-60" />
            </Link>
            <Link
              to="/contact"
              className="bg-cyan text-white p-6 flex items-center justify-between hover:bg-navy transition"
            >
              <span className="font-medium text-sm">Book an Appointment</span>
              <MdPayment size={32} className="opacity-60" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection