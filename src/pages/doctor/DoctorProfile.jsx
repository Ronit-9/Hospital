import { useState, useEffect } from 'react'
import { useGetMyDoctorProfileQuery, useUpdateDoctorMutation } from '../../store/api/doctorApi'
import Avatar from '../../components/home/Avatar.jsx'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const defaultSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

const DoctorProfile = () => {
  const { data, isLoading } = useGetMyDoctorProfileQuery()
  const [updateDoctor, { isLoading: isSaving }] = useUpdateDoctorMutation()

  const doctor = data?.data

  const [form, setForm] = useState({ bio: '', consultFee: 0, availability: [] })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (doctor) {
      setForm({
        bio: doctor.bio || '',
        consultFee: doctor.consultFee || 0,
        availability: doctor.availability || [],
      })
    }
  }, [doctor])

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
        return { ...a, slots: hasSlot ? a.slots.filter((s) => s !== slot) : [...a.slots, slot] }
      }),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    try {
      await updateDoctor({
        id: doctor._id,
        doctorData: {
          bio: form.bio,
          consultFee: form.consultFee,
          availability: form.availability,
        },
      }).unwrap()
      setSuccess(true)
    } catch (err) {
      setError(err.data?.message || 'Failed to update profile')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-navy mb-6">My profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <Avatar name={doctor?.userId?.name} imageUrl={doctor?.userId?.profileImage} size="lg" />
        <div>
          <p className="text-navy font-medium text-lg">{doctor?.userId?.name}</p>
          <p className="text-gray-500 text-sm">{doctor?.specialization} · {doctor?.department?.name}</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">Profile updated successfully</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Consultation fee (Rs.)</label>
          <input
            type="number"
            min="0"
            value={form.consultFee}
            onChange={(e) => setForm({ ...form, consultFee: e.target.value })}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
          <div className="space-y-2 border border-gray-200 rounded-lg p-3">
            {daysOfWeek.map((day) => {
              const dayData = form.availability.find((a) => a.day === day)
              return (
                <div key={day}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!dayData}
                      onChange={() => toggleDay(day)}
                      className="accent-cyan"
                    />
                    <span className="font-medium text-gray-700 w-24">{day}</span>
                  </label>
                  {dayData && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-6">
                      {defaultSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleSlot(day, slot)}
                          className={`px-2 py-1 rounded text-xs transition ${dayData.slots.includes(slot) ? 'bg-cyan text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default DoctorProfile