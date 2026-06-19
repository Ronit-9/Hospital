import { Link } from 'react-router-dom'
import { MdSend } from 'react-icons/md'
import { FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-white">MED</span>
              <span className="text-cyan">DICAL</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading the Way in Medical Excellence, Trusted Care.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Important Links</h4>
            {[
              { label: 'Appointment', to: '/login' },
              { label: 'Doctors', to: '/doctors' },
              { label: 'Services', to: '/services' },
              { label: 'About Us', to: '/about' },
            ].map((link) => (
              <Link key={link.label} to={link.to} className="block text-gray-400 text-sm mb-2 hover:text-cyan transition">
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact Us</h4>
            <p className="text-gray-400 text-sm mb-2">Call: (237) 681-812-255</p>
            <p className="text-gray-400 text-sm mb-2">Email: info@meddical.com</p>
            <p className="text-gray-400 text-sm mb-2">Address: 0123 Some place</p>
            <p className="text-gray-400 text-sm">Some country</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Newsletter</h4>
            <div className="flex">
              <input
                placeholder="Enter your email address"
                className="flex-1 bg-navy-light text-white text-sm px-4 py-3 outline-none placeholder-gray-400 border border-gray-600"
              />
              <button className="bg-cyan px-4 py-3 hover:bg-cyan-light transition">
                <MdSend size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center gap-4 justify-between text-center sm:text-left">
          <p className="text-gray-400 text-sm">
            © 2024 Hospital's name All Rights Reserved by PNTEC-LTD
          </p>
          <div className="flex gap-3">
            {[FaLinkedinIn, FaFacebookF, FaInstagram].map((Icon, i) => (
              <span key={i} className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:border-cyan hover:text-cyan cursor-pointer transition">
                <Icon size={13} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer