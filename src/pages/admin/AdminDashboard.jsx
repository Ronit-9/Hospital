import { MdPeople, MdLocalHospital, MdCalendarToday, MdArticle, MdMedicalServices, MdEmail, MdTrendingUp } from 'react-icons/md'
import { useGetAllAppointmentsQuery } from '../../store/api/appointmentApi'
import { useGetDoctorsQuery } from '../../store/api/doctorApi'
import { useGetAllUsersQuery } from '../../store/api/userApi'
import { useGetAllNewsQuery } from '../../store/api/newsApi'
import { useGetAllMessagesQuery } from '../../store/api/contactApi'
import { useGetDepartmentsQuery } from '../../store/api/departmentApi'
import { useGetAllServicesQuery } from '../../store/api/serviceApi'
import { Link } from 'react-router-dom'

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} className={`bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition flex items-center gap-4 group`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-navy mt-0.5">{value ?? '—'}</p>
    </div>
  </Link>
)

const AdminDashboard = () => {
  const { data: appointmentsData } = useGetAllAppointmentsQuery()
  const { data: doctorsData } = useGetDoctorsQuery()
  const { data: usersData } = useGetAllUsersQuery()
  const { data: newsData } = useGetAllNewsQuery()
  const { data: messagesData } = useGetAllMessagesQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: servicesData } = useGetAllServicesQuery()

  const appointments = appointmentsData?.data || []
  const doctors = doctorsData?.data || []
  const users = usersData?.data || []
  const news = newsData?.data || []
  const messages = messagesData?.data || []
  const departments = departmentsData?.data || []
  const services = servicesData?.data || []

  const unreadMessages = messages.filter((m) => !m.isRead).length
  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed').length
  const patients = users.filter((u) => u.role === 'patient')

  const STATUS_STYLES = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-500',
    completed: 'bg-blue-50 text-blue-600',
  }

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">

      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening today</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          to="/admin/appointments"
          icon={<MdCalendarToday size={22} className="text-cyan" />}
          label="Total Appointments"
          value={appointments.length}
          color="bg-cyan/10"
        />
        <StatCard
          to="/admin/doctors"
          icon={<MdLocalHospital size={22} className="text-indigo-500" />}
          label="Doctors"
          value={doctors.length}
          color="bg-indigo-50"
        />
        <StatCard
          to="/admin/appointments"
          icon={<MdPeople size={22} className="text-emerald-500" />}
          label="Appointments with patients"
          value={appointments.length}
          color="bg-emerald-50"
        />
        <StatCard
          to="/admin/contacts"
          icon={<MdEmail size={22} className="text-rose-500" />}
          label="Messages"
          value={messages.length}
          color="bg-rose-50"
        />
      </div>

      {/* secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Departments', value: departments.length, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Services', value: services.length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'News Posts', value: news.length, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Unread Messages', value: unreadMessages, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* appointment status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* appointment status pills */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
            <MdTrendingUp className="text-cyan" /> Appointment Status
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {['pending', 'confirmed', 'cancelled', 'completed'].map((status) => {
              const count = appointments.filter((a) => a.status === status).length
              const pct = appointments.length ? Math.round((count / appointments.length) * 100) : 0
              return (
                <div key={status} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[status]}`}>{status}</span>
                    <span className="text-lg font-bold text-navy">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${status === 'pending' ? 'bg-yellow-400'
                        : status === 'confirmed' ? 'bg-green-400'
                          : status === 'cancelled' ? 'bg-red-400'
                            : 'bg-blue-400'
                        }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct}% of total</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* recent messages */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-navy flex items-center gap-2">
              <MdEmail className="text-cyan" /> Recent Messages
            </h2>
            <Link to="/admin/contacts" className="text-xs text-cyan hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No messages yet</p>
            )}
            {recentMessages.map((msg) => (
              <div key={msg._id} className={`flex items-start gap-3 p-3 rounded-lg ${!msg.isRead ? 'bg-cyan/5 border border-cyan/10' : 'bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!msg.isRead ? 'bg-cyan' : 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-navy truncate">{msg.name}</p>
                    {!msg.isRead && <span className="text-xs bg-cyan/10 text-cyan px-1.5 py-0.5 rounded-full flex-shrink-0">New</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent appointments table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-navy flex items-center gap-2">
            <MdCalendarToday className="text-cyan" /> Recent Appointments
          </h2>
          <Link to="/admin/appointments" className="text-xs text-cyan hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Patient</th>
                <th className="pb-3 pr-4">Doctor</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No appointments yet</td></tr>
              )}
              {recentAppointments.map((a) => (
                <tr key={a._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-navy">{a.patientId?.name || '—'}</td>
                  <td className="py-3 pr-4 text-gray-500">{a.doctorId?.userId?.name || a.doctorId?.name || '—'}</td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">{new Date(a.date).toLocaleDateString()} · {a.timeSlot}</td>
                  <td className="py-3 pr-4 text-gray-500 capitalize text-xs">{a.type}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.status] || 'bg-gray-100 text-gray-500'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard