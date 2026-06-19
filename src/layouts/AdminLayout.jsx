import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  MdDashboard, MdLocalHospital, MdCategory, MdCalendarMonth,
  MdArticle, MdMedicalServices, MdMail, MdLogout, MdMenu, MdClose,
} from 'react-icons/md'
import { useLogoutMutation } from '../store/api/authApi'
import { clearCredentials } from '../store/slices/authSlice'
import Avatar from '../components/home/Avatar.jsx'

const navItems = [
  { label: 'Dashboard', icon: MdDashboard, to: '/admin/dashboard' },
  { label: 'Doctors', icon: MdLocalHospital, to: '/admin/doctors' },
  { label: 'Departments', icon: MdCategory, to: '/admin/departments' },
  { label: 'Appointments', icon: MdCalendarMonth, to: '/admin/appointments' },
  { label: 'News', icon: MdArticle, to: '/admin/news' },
  { label: 'Services', icon: MdMedicalServices, to: '/admin/services' },
  { label: 'Messages', icon: MdMail, to: '/admin/contacts' },
]

const AdminLayout = () => {
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

  const closeSidebar = () => setSidebarOpen(false)

  const SidebarContent = () => (
    <>
      {/* logo */}
      <div className="p-6 border-b border-navy-light flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-bold" onClick={closeSidebar}>
            <span className="text-white">MED</span>
            <span className="text-cyan">DICAL</span>
          </Link>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        {/* close button — mobile only */}
        <button
          onClick={closeSidebar}
          className="text-gray-400 hover:text-white transition md:hidden"
        >
          <MdClose size={22} />
        </button>
      </div>

      {/* nav links */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition ${isActive
                  ? 'bg-cyan text-white border-r-4 border-white'
                  : 'text-gray-300 hover:bg-navy-light hover:text-white'
                }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* user + logout */}
      <div className="p-4 border-t border-navy-light flex items-center gap-3">
        <Avatar name={user?.name} imageUrl={user?.profileImage} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-gray-400 text-xs">Administrator</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-400 transition"
          title="Logout"
        >
          <MdLogout size={18} />
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR — desktop */}
      <aside className="hidden md:flex w-64 bg-navy flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* SIDEBAR — mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          {/* drawer */}
          <aside className="relative z-50 w-64 bg-navy flex flex-col flex-shrink-0 h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-x-hidden">

        {/* mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-navy shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white"
          >
            <MdMenu size={24} />
          </button>
          <Link to="/" className="text-lg font-bold">
            <span className="text-white">MED</span>
            <span className="text-cyan">DICAL</span>
          </Link>
          <Avatar name={user?.name} imageUrl={user?.profileImage} size="sm" />
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default AdminLayout