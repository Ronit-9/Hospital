import { useState } from 'react'
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdClose,
  MdCalendarToday,
  MdPerson,
} from 'react-icons/md'
import {
  useGetAllAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
} from '../../store/api/appointmentApi'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed']

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
  completed: 'bg-blue-50 text-blue-600',
}

const AdminAppointments = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [error, setError] = useState('')

  const { data, isLoading } = useGetAllAppointmentsQuery()
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation()
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation()

  const appointments = data?.data || []

  const filtered = appointments.filter((a) => {
    const patientName = a.patientId?.name?.toLowerCase() || ''
    const doctorName = a.doctorId?.name?.toLowerCase() || ''
    const query = search.toLowerCase()
    return patientName.includes(query) || doctorName.includes(query)
  })

  const openEditModal = (item) => {
    setEditingAppointment(item)
    setSelectedStatus(item.status)
    setError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updateStatus({ id: editingAppointment._id, body: { status: selectedStatus } }).unwrap()
      setIsModalOpen(false)
    } catch (err) {
      setError(err.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAppointment(deleteTarget._id).unwrap()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.data?.message || 'Cannot delete appointment')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">{appointments.length} total appointments</p>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="relative w-72 mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Date & Time</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">No appointments found</td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <MdPerson size={16} className="text-gray-400 shrink-0" />
                    <span className="font-medium text-navy">{item.patientId?.name || '—'}</span>
                  </div>
                  <p className="text-xs text-gray-400 pl-6">{item.patientId?.email}</p>
                </td>
                <td className="px-5 py-3 text-gray-600">{item.doctorId?.name || '—'}</td>
                <td className="px-5 py-3 text-gray-500">{item.departmentId?.name || '—'}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MdCalendarToday size={13} className="text-gray-400" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 pl-4">{item.timeSlot}</p>
                </td>
                <td className="px-5 py-3 text-gray-500 capitalize">{item.type || '—'}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-gray-400 hover:text-cyan transition mr-3"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-navy">Update Appointment Status</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-navy transition"
              >
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">{error}</div>
              )}

              {/* Read-only summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-navy">Patient:</span> {editingAppointment?.patientId?.name}</p>
                <p><span className="font-medium text-navy">Doctor:</span> {editingAppointment?.doctorId?.name}</p>
                <p><span className="font-medium text-navy">Date:</span> {new Date(editingAppointment?.date).toLocaleDateString()} — {editingAppointment?.timeSlot}</p>
                {editingAppointment?.symptoms && (
                  <p><span className="font-medium text-navy">Symptoms:</span> {editingAppointment.symptoms}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Update Status'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Appointment"
        message={`Are you sure you want to delete the appointment for "${deleteTarget?.patientId?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminAppointments