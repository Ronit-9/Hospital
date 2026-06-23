import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import { useGetMyDoctorProfileQuery } from '../../store/api/doctorApi'
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../../store/api/appointmentApi'

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

const DoctorAppointments = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [error, setError] = useState('')

  const { data: profileData } = useGetMyDoctorProfileQuery()
  const doctor = profileData?.data

  const { data: apptData, isLoading } = useGetDoctorAppointmentsQuery(doctor?._id, { skip: !doctor?._id })
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation()

  const appointments = apptData?.data || []

  const filtered = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    const matchesDate = !dateFilter || new Date(a.date).toISOString().slice(0, 10) === dateFilter
    return matchesStatus && matchesDate
  })

  const handleStatusChange = async (id, status) => {
    setError('')
    try {
      await updateStatus({ id, status }).unwrap()
    } catch (err) {
      setError(err.data?.message || 'Failed to update status')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy mb-6">My appointments</h1>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="flex items-center gap-4 mb-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition"
        />
        {(statusFilter !== 'all' || dateFilter) && (
          <button
            onClick={() => { setStatusFilter('all'); setDateFilter('') }}
            className="text-cyan text-sm hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No appointments found</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <p className="font-medium text-navy">{a.patientId?.name}</p>
                  <p className="text-gray-400 text-xs">{a.patientId?.email}</p>
                </td>
                <td className="px-5 py-3 text-gray-600">{new Date(a.date).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-gray-600">{a.timeSlot}</td>
                <td className="px-5 py-3 text-gray-600 capitalize">{a.type}</td>
                <td className="px-5 py-3">
                  <select
                    value={a.status}
                    onChange={(e) => handleStatusChange(a._id, e.target.value)}
                    disabled={isUpdating || a.status === 'completed'}
                    className={`px-2 py-1 rounded text-xs font-medium border-0 outline-none cursor-pointer ${a.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        a.status === 'confirmed' ? 'bg-cyan/10 text-cyan' :
                          a.status === 'completed' ? 'bg-green-50 text-green-600' :
                            'bg-red-50 text-red-500'
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed" disabled>Completed</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    to={`/doctor/appointments/${a._id}`}
                    className="text-cyan text-sm font-medium hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DoctorAppointments