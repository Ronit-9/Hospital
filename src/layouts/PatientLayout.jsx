import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  MdDashboard,
  MdCalendarMonth,
  MdMedicalServices,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
} from 'react-icons/md'
import { useLogoutMutation } from '../store/api/authApi'
import { clearCredentials } from '../store/slices/authSlice'
import Avatar from '../components/home/Avatar.jsx'

const navItems = [
  { label: 'Dashboard', icon: MdDashboard, to: '/patient/dashboard' },
  { label: 'Appointments', icon: MdCalendarMonth, to: '/patient/appointments' },
  { label: 'Records', icon: MdMedicalServices, to: '/patient/records' },
  { label: 'My Profile', icon: MdPerson, to: '/patient/profile' },
]

const PatientLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [logout] = useLogoutMutation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    dispatch(clearCredentials())
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="text-white">MED</span>
          <span className="text-cyan">DICAL</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close menu"
        >
          <MdClose size={20} />
        </button>
      </div>

      {/* Section label */}
      <div className="px-6 pb-3">
        <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
          Patient Panel
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/[0.07] mb-3" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                  ? 'bg-cyan text-white shadow-sm shadow-cyan/30'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="mx-3 mb-4 mt-3 p-3 rounded-xl bg-white/[0.05] flex items-center gap-3">
        <Avatar name={user?.name} imageUrl={user?.profileImage} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate leading-tight">{user?.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">Patient</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition"
          title="Logout"
        >
          <MdLogout size={17} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy border-b border-white/[0.07] flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-extrabold tracking-tight">
          <span className="text-white">MED</span>
          <span className="text-cyan">DICAL</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition"
          aria-label="Open menu"
        >
          <MdMenu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar — off-canvas drawer on mobile, sticky in-flow column on desktop */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:self-start top-0 left-0 h-screen w-[220px] flex-shrink-0 bg-navy flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Main — always fills remaining width on desktop */}
      <main className="flex-1 overflow-x-hidden pt-14 lg:pt-0 min-w-0 min-h-screen">
        <Outlet />
      </main>

    </div>
  )
}

export default PatientLayout