import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../store/api/authApi'
import { clearCredentials } from '../store/slices/authSlice'
import { MdPhone, MdAccessTime, MdLocationOn, MdSearch, MdMenu, MdClose } from 'react-icons/md'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
]

const Header = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Only admins have a dashboard to view here — every other logged-in role goes home.
  const accountLink = user?.role === 'admin' ? '/admin/dashboard' : '/'

  const handleLogout = async () => {
    await logout()
    dispatch(clearCredentials())
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header>
      {/* TOP BAR */}
      <div className="bg-white py-3 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold" onClick={() => setMenuOpen(false)}>
            <span className="text-navy">MED</span>
            <span className="text-cyan">DICAL</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-2">
              <MdPhone className="text-cyan text-xl" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Emergency</p>
                <p className="text-cyan text-sm font-medium">(237) 681-812-255</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-cyan text-xl" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Work Hour</p>
                <p className="text-cyan text-sm font-medium">09:00 - 20:00 Everyday</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MdLocationOn className="text-cyan text-xl" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</p>
                <p className="text-cyan text-sm font-medium">0123 Some Place</p>
              </div>
            </div>
          </div>

          {/* mobile/tablet menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden text-navy text-2xl p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* NAV BAR */}
      <nav className="bg-navy py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-white font-semibold hover:text-cyan transition">Home</Link>
            <Link to="/about" className="text-white hover:text-cyan transition">About us</Link>
            <Link to="/services" className="text-white hover:text-cyan transition">Services</Link>
            <Link to="/doctors" className="text-white hover:text-cyan transition">Doctors</Link>
            <Link to="/news" className="text-white hover:text-cyan transition">News</Link>
            <Link to="/contact" className="text-white hover:text-cyan transition">Contact</Link>
          </div>

          {/* desktop right controls */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-white hover:text-cyan transition">
              <MdSearch className="text-xl" />
            </button>

            <Link
              to="/appointment"
              className="bg-transparent border border-cyan-light text-white px-6 py-2 rounded-full hover:bg-cyan hover:border-cyan transition text-sm font-medium"
            >
              Appointment
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to={accountLink}
                  className="text-white text-sm hover:text-cyan transition"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-white text-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-navy transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-cyan text-white px-6 py-2 rounded-full hover:bg-navy-light transition text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* mobile/tablet condensed row */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <button className="text-white hover:text-cyan transition" aria-label="Search">
              <MdSearch className="text-xl" />
            </button>

            {isLoggedIn ? (
              <Link
                to={accountLink}
                onClick={() => setMenuOpen(false)}
                className="text-white text-sm font-medium hover:text-cyan transition"
              >
                {user?.name}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-cyan text-white px-5 py-1.5 rounded-full hover:bg-navy-light transition text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* mobile/tablet dropdown panel */}
        {menuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-navy-light flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-cyan transition text-sm font-medium py-2"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/appointment"
              onClick={() => setMenuOpen(false)}
              className="mt-3 bg-transparent border border-cyan-light text-white px-6 py-2.5 rounded-full hover:bg-cyan hover:border-cyan transition text-sm font-medium text-center"
            >
              Appointment
            </Link>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="mt-3 border border-white text-white px-4 py-2.5 rounded-full text-sm hover:bg-white hover:text-navy transition"
              >
                Logout
              </button>
            )}

            {/* contact info, visible on mobile/tablet since the top bar version is hidden below lg */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-navy-light">
              <div className="flex items-center gap-2">
                <MdPhone className="text-cyan text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Emergency</p>
                  <p className="text-cyan text-sm font-medium">(237) 681-812-255</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-cyan text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Work Hour</p>
                  <p className="text-cyan text-sm font-medium">09:00 - 20:00 Everyday</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-cyan text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Location</p>
                  <p className="text-cyan text-sm font-medium">0123 Some Place</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header