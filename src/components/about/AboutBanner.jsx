import { Link } from 'react-router-dom'
import aboutBanner from '../../assets/about-banner.jpg.png'

const AboutBanner = () => {
  return (
    <section
      className="relative h-56 flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${aboutBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-navy/60" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
          <Link to="/" className="hover:text-cyan transition">Home</Link>
          <span>/</span>
          <span className="text-white">About</span>
        </div>
        <h1 className="text-5xl font-bold text-white">About us</h1>
      </div>
    </section>
  )
}

export default AboutBanner