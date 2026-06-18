import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../store/api/authApi'
import { clearCredentials } from '../store/slices/authSlice'
import { MdPhone, MdAccessTime, MdLocationOn, MdSearch } from 'react-icons/md'

const Header = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    await logout()
    dispatch(clearCredentials())
    navigate('/')
  }

  return (
    <header>
      {/* TOP BAR */}
      <div className="bg-white py-3 px-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-navy">MED</span>
            <span className="text-cyan">DICAL</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
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
        </div>
      </div>

      {/* NAV BAR */}
      <nav className="bg-navy py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-white font-semibold hover:text-cyan transition">Home</Link>
            <Link to="/about" className="text-white hover:text-cyan transition">About us</Link>
            <Link to="/services" className="text-white hover:text-cyan transition">Services</Link>
            <Link to="/doctors" className="text-white hover:text-cyan transition">Doctors</Link>
            <Link to="/news" className="text-white hover:text-cyan transition">News</Link>
            <Link to="/contact" className="text-white hover:text-cyan transition">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
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
                  to={`/${user?.role}/dashboard`}
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
        </div>
      </nav>
    </header>
  )
}

export default Header