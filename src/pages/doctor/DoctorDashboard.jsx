import { Link } from 'react-router-dom'
import {
  MdCalendarMonth,
  MdPending,
  MdCheckCircle,
  MdStar,
  MdArrowForward,
  MdEventBusy,
} from 'react-icons/md'
import { useGetMyDoctorProfileQuery } from '../../store/api/doctorApi'
import { useGetDoctorAppointmentsQuery } from '../../store/api/appointmentApi'
import Avatar from '../../components/home/Avatar.jsx'

const STATUS_STYLES = {
  pending: 'bg-amber-50   text-amber-600  ring-1 ring-amber-200',
  confirmed: 'bg-cyan-50    text-cyan        ring-1 ring-cyan/20',
  completed: 'bg-green-50   text-green-600  ring-1 ring-green-200',
  cancelled: 'bg-red-50     text-red-500    ring-1 ring-red-200',
}

const StatCard = ({ label, value, sub, icon: Icon, iconClass }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`p-2 rounded-lg ${iconClass}`}>
        <Icon size={16} />
      </span>
    </div>
    <div>
      <span className="text-2xl font-bold text-navy">{value}</span>
      {sub && <span className="ml-1.5 text-sm text-gray-400">{sub}</span>}
    </div>
  </div>
)

const DoctorDashboard = () => {
  const { data: profileData, isLoading: profileLoading } = useGetMyDoctorProfileQuery()
  const doctor = profileData?.data

  const { data: apptData } = useGetDoctorAppointmentsQuery(doctor?._id, { skip: !doctor?._id })
  const appointments = apptData?.data || []

  const pending = appointments.filter((a) => a.status === 'pending').length
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length
  const completed = appointments.filter((a) => a.status === 'completed').length

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  const name = doctor?.userId?.name
  const firstName = name?.split(' ')[0] ?? 'Doctor'

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar name={name} imageUrl={doctor?.userId?.profileImage} size="lg" />
        <div>
          <p className="text-xs font-semibold text-cyan uppercase tracking-widest mb-0.5">
            Welcome back
          </p>
          <h1 className="text-2xl font-bold text-navy leading-tight">Dr. {firstName}</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {doctor?.specialization}
            {doctor?.department?.name && (
              <> · <span className="text-gray-400">{doctor.department.name}</span></>
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total"
          value={appointments.length}
          icon={MdCalendarMonth}
          iconClass="bg-cyan/10 text-cyan"
        />
        <StatCard
          label="Pending"
          value={pending}
          icon={MdPending}
          iconClass="bg-amber-50 text-amber-500"
        />
        <StatCard
          label="Completed"
          value={completed}
          icon={MdCheckCircle}
          iconClass="bg-green-50 text-green-500"
        />
        <StatCard
          label="Rating"
          value={doctor?.rating?.toFixed(1) ?? '—'}
          sub={doctor?.totalReviews ? `(${doctor.totalReviews})` : undefined}
          icon={MdStar}
          iconClass="bg-amber-50 text-amber-400"
        />
      </div>

      {/* Recent appointments */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-navy">Recent appointments</h2>
        <Link
          to="/doctor/appointments"
          className="flex items-center gap-1 text-cyan text-sm font-medium hover:underline underline-offset-2"
        >
          View all <MdArrowForward size={15} />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <MdEventBusy size={36} className="text-gray-200" />
            <p className="text-sm">No appointments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Time
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.slice(0, 5).map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-navy">
                      {a.patientId?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {new Date(a.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                      {a.timeSlot}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.status] ?? 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default DoctorDashboard