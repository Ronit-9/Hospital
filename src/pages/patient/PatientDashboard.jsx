import { Link } from 'react-router-dom'
import { MdCalendarMonth, MdPending, MdCheckCircle, MdMedicalServices } from 'react-icons/md'
import { useGetMyAppointmentsQuery } from '../../store/api/appointmentApi'
import { useGetMyMedicalRecordsQuery } from '../../store/api/medicalRecordApi'
import { useSelector } from 'react-redux'

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { data: apptData, isLoading } = useGetMyAppointmentsQuery()
  const { data: recordsData } = useGetMyMedicalRecordsQuery()

  const appointments = apptData?.data || []
  const records = recordsData?.data || []

  const upcoming = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed')
  const completed = appointments.filter((a) => a.status === 'completed')

  if (isLoading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy mb-1">Welcome, {user?.name}</h1>
      <p className="text-gray-500 text-sm mb-8">Here's a quick overview of your care</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Upcoming</span>
            <MdPending className="text-amber-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-navy">{upcoming.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Completed visits</span>
            <MdCheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-navy">{completed.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Medical records</span>
            <MdMedicalServices className="text-cyan" size={20} />
          </div>
          <p className="text-2xl font-bold text-navy">{records.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-navy">Upcoming appointments</h2>
        <Link to="/patient/appointments" className="text-cyan text-sm hover:underline">View all</Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.slice(0, 5).map((a) => (
              <tr key={a._id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-navy">{a.doctorId?.userId?.name}</td>
                <td className="px-5 py-3 text-gray-500">{new Date(a.date).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-gray-500">{a.timeSlot}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${a.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-cyan/10 text-cyan'
                    }`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {upcoming.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">No upcoming appointments</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PatientDashboard