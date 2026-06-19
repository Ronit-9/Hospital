import { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose } from 'react-icons/md'
import {
  useGetDoctorsQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} from '../../store/api/doctorApi'
import { useGetDepartmentsQuery } from '../../store/api/departmentApi'
import { useGetAllUsersQuery } from '../../store/api/userApi'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import Avatar from '../../components/home/Avatar.jsx'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const defaultSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
]

const emptyForm = {
  userId: '',
  department: '',
  specialization: '',
  qualifications: '',
  experience: 0,
  consultFee: 0,
  bio: '',
  image: '',
  isAvailable: true,
  socialLinks: { facebook: '', twitter: '', linkedin: '' },
  availability: [],
}

const AdminDoctors = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [customSlotInputs, setCustomSlotInputs] = useState({})

  const { data: doctorsData, isLoading } = useGetDoctorsQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: usersData } = useGetAllUsersQuery()

  const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation()
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation()
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation()

  const doctors = doctorsData?.data || []
  const departments = departmentsData?.data || []
  const allUsers = usersData?.data || []

  const doctorUserIds = doctors.map((d) => d.userId?._id)
  const availableDoctorUsers = allUsers.filter(
    (u) => u.role === 'doctor' && (!doctorUserIds.includes(u._id) || editingDoctor?.userId?._id === u._id)
  )

  const filtered = doctors.filter((d) =>
    d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingDoctor(null)
    setForm(emptyForm)
    setCustomSlotInputs({})
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor)
    setForm({
      userId: doctor.userId?._id || '',
      department: doctor.department?._id || '',
      specialization: doctor.specialization || '',
      qualifications: (doctor.qualifications || []).join(', '),
      experience: doctor.experience || 0,
      consultFee: doctor.consultFee || 0,
      bio: doctor.bio || '',
      image: doctor.userId?.profileImage || '',
      isAvailable: doctor.isAvailable ?? true,
      socialLinks: {
        facebook: doctor.socialLinks?.facebook || '',
        twitter: doctor.socialLinks?.twitter || '',
        linkedin: doctor.socialLinks?.linkedin || '',
      },
      availability: doctor.availability || [],
    })
    setCustomSlotInputs({})
    setError('')
    setIsModalOpen(true)
  }

  // availability helpers
  const toggleDay = (day) => {
    const exists = form.availability.find((a) => a.day === day)
    if (exists) {
      setForm({ ...form, availability: form.availability.filter((a) => a.day !== day) })
    } else {
      setForm({ ...form, availability: [...form.availability, { day, slots: [] }] })
    }
  }

  const toggleSlot = (day, slot) => {
    setForm({
      ...form,
      availability: form.availability.map((a) => {
        if (a.day !== day) return a
        const hasSlot = a.slots.includes(slot)
        return {
          ...a,
          slots: hasSlot ? a.slots.filter((s) => s !== slot) : [...a.slots, slot].sort(),
        }
      }),
    })
  }

  const addCustomSlot = (day) => {
    const val = customSlotInputs[day]?.trim()
    if (!val) return
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (!timeRegex.test(val)) return

    setForm({
      ...form,
      availability: form.availability.map((a) => {
        if (a.day !== day) return a
        if (a.slots.includes(val)) return a
        return { ...a, slots: [...a.slots, val].sort() }
      }),
    })
    setCustomSlotInputs({ ...customSlotInputs, [day]: '' })
  }

  const removeSlot = (day, slot) => {
    setForm({
      ...form,
      availability: form.availability.map((a) => {
        if (a.day !== day) return a
        return { ...a, slots: a.slots.filter((s) => s !== slot) }
      }),
    })
  }

  const buildPayload = () => ({
    ...form,
    qualifications: form.qualifications.split(',').map((q) => q.trim()).filter(Boolean),
    experience: Number(form.experience),
    consultFee: Number(form.consultFee),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingDoctor) {
        await updateDoctor({ id: editingDoctor._id, doctorData: buildPayload() }).unwrap()
      } else {
        await createDoctor(buildPayload()).unwrap()
      }
      setIsModalOpen(false)
    } catch (err) {
      setError(err.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDoctor(deleteTarget._id).unwrap()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.data?.message || 'Cannot delete doctor')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Doctors</h1>
          <p className="text-gray-500 text-sm mt-1">{doctors.length} total doctors</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm hover:bg-navy-light transition"
        >
          <MdAdd size={18} /> Add Doctor
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="relative w-full sm:w-72 mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition"
        />
      </div>

      {/* table — scrollable on mobile */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Specialization</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Fee</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No doctors found</td></tr>
            )}
            {filtered.map((doctor) => (
              <tr key={doctor._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={doctor.userId?.name} imageUrl={doctor.userId?.profileImage} size="sm" />
                    <div>
                      <p className="font-medium text-navy">{doctor.userId?.name}</p>
                      <p className="text-gray-400 text-xs">{doctor.userId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{doctor.specialization}</td>
                <td className="px-5 py-3 text-gray-600">{doctor.department?.name}</td>
                <td className="px-5 py-3 text-gray-600">Rs. {doctor.consultFee}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${doctor.isAvailable
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-400'
                    }`}>
                    {doctor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="bg-cyan/10 text-cyan px-2 py-1 rounded text-xs font-medium">
                    ⭐ {doctor.rating || 0} ({doctor.totalReviews || 0})
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEditModal(doctor)} className="text-gray-400 hover:text-cyan transition mr-3">
                    <MdEdit size={18} />
                  </button>
                  <button onClick={() => setDeleteTarget(doctor)} className="text-gray-400 hover:text-red-500 transition">
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add/edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-navy">
                {editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy transition">
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">{error}</div>}

              {/* user select */}
              <div>
                <label className="text-sm font-medium text-gray-700">Doctor User</label>
                <select
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                  disabled={!!editingDoctor}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition disabled:bg-gray-50"
                >
                  <option value="">Select a registered doctor user</option>
                  {availableDoctorUsers.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                {availableDoctorUsers.length === 0 && !editingDoctor && (
                  <p className="text-xs text-amber-600 mt-1">
                    No available doctor users — register a user with role "doctor" first.
                  </p>
                )}
              </div>

              {/* department */}
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Consultation Fee (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.consultFee}
                    onChange={(e) => setForm({ ...form, consultFee: e.target.value })}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Qualifications (comma separated)</label>
                  <input
                    type="text"
                    placeholder="MBBS, MD"
                    value={form.qualifications}
                    onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                </div>
              </div>

              {/* isAvailable toggle */}
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Availability Status</p>
                  <p className="text-xs text-gray-400">Controls whether patients can book this doctor</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isAvailable ? 'bg-cyan' : 'bg-gray-300'
                    }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                </button>
              </div>

              {/* image URL */}
              <div>
                <label className="text-sm font-medium text-gray-700">Profile Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                />
                {form.image && (
                  <img src={form.image} alt="preview" className="w-16 h-16 object-cover rounded-full mt-2" />
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition resize-none"
                />
              </div>

              {/* social links */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Social Links</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    placeholder="Facebook URL"
                    value={form.socialLinks.facebook}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan transition"
                  />
                  <input
                    placeholder="Twitter URL"
                    value={form.socialLinks.twitter}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan transition"
                  />
                  <input
                    placeholder="LinkedIn URL"
                    value={form.socialLinks.linkedin}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan transition"
                  />
                </div>
              </div>

              {/* availability */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Availability & Time Slots</label>
                <div className="space-y-3 border border-gray-200 rounded-lg p-3">
                  {daysOfWeek.map((day) => {
                    const dayData = form.availability.find((a) => a.day === day)
                    return (
                      <div key={day} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        {/* day toggle */}
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!dayData}
                            onChange={() => toggleDay(day)}
                            className="accent-cyan"
                          />
                          <span className="font-medium text-gray-700 w-24">{day}</span>
                          {dayData && (
                            <span className="text-xs text-gray-400">
                              {dayData.slots.length} slot{dayData.slots.length !== 1 ? 's' : ''} selected
                            </span>
                          )}
                        </label>

                        {dayData && (
                          <div className="mt-2 ml-6 space-y-2">
                            {/* preset slots */}
                            <div className="flex flex-wrap gap-1.5">
                              {defaultSlots.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => toggleSlot(day, slot)}
                                  className={`px-2.5 py-1 rounded text-xs transition ${dayData.slots.includes(slot)
                                      ? 'bg-cyan text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>

                            {/* custom slot input */}
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={customSlotInputs[day] || ''}
                                onChange={(e) => setCustomSlotInputs({ ...customSlotInputs, [day]: e.target.value })}
                                className="px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-cyan transition"
                              />
                              <button
                                type="button"
                                onClick={() => addCustomSlot(day)}
                                className="px-3 py-1 bg-navy text-white text-xs rounded hover:bg-navy-light transition"
                              >
                                Add
                              </button>
                            </div>

                            {/* selected slots (including custom) not in defaultSlots */}
                            {dayData.slots.filter((s) => !defaultSlots.includes(s)).length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-xs text-gray-400 w-full">Custom slots:</span>
                                {dayData.slots
                                  .filter((s) => !defaultSlots.includes(s))
                                  .map((slot) => (
                                    <span
                                      key={slot}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-cyan text-white rounded text-xs"
                                    >
                                      {slot}
                                      <button
                                        type="button"
                                        onClick={() => removeSlot(day, slot)}
                                        className="hover:opacity-70"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Create Doctor'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message={`Are you sure you want to delete "${deleteTarget?.userId?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminDoctors