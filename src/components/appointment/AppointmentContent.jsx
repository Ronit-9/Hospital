import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdPhone } from 'react-icons/md'
import { useGetDoctorsQuery } from '../../store/api/doctorApi'
import { useGetDepartmentsQuery } from '../../store/api/departmentApi'
import { useBookAppointmentMutation } from '../../store/api/appointmentApi'
import { useGetSettingsQuery } from '../../store/api/settingsApi'

const AppointmentContent = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    doctorId: '', date: '', timeSlot: '',
    type: '', symptoms: '',
    departmentId: '', // ✅ added
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { data: doctorsData } = useGetDoctorsQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: settingsData } = useGetSettingsQuery()
  const [bookAppointment, { isLoading }] = useBookAppointmentMutation()

  const doctors = doctorsData?.data || []
  const departments = departmentsData?.data || []
  const settings = settingsData?.data
  const schedule = settings?.scheduleHours || []
  const canBook = isLoggedIn && (user?.role === 'patient' || user?.role === 'doctor')

  // ✅ derive time slots from schedule based on selected date
  const getTimeSlotsForDate = () => {
    if (!form.date || schedule.length === 0) {
      return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    }
    const dayName = new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' })
    const daySchedule = schedule.find((s) => s.day === dayName)
    if (!daySchedule || daySchedule.isClosed) return []

    const slots = []
    const [openH] = daySchedule.open.split(':').map(Number)
    const [closeH] = daySchedule.close.split(':').map(Number)
    for (let h = openH; h < closeH; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`)
    }
    return slots
  }

  const timeSlots = getTimeSlotsForDate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isLoggedIn) { navigate('/login'); return }
    try {
      await bookAppointment(form).unwrap()
      setSuccess(true)
      setForm({ doctorId: '', date: '', timeSlot: '', type: '', symptoms: '', departmentId: '' }) // ✅ reset all
    } catch (err) {
      setError(err.data?.message || 'Booking failed')
    }
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex gap-8">

        {/* left form */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-navy mb-2">Book an Appointment</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat
            scelerisque felis vitae tortor augue. Convallis felis vitae tortor augue.
            Velit nascetur proin massa in. Consequat faucibus porttitor enim et.
          </p>

          {!isLoggedIn && (
            <div className="bg-cyan/10 text-navy text-sm p-4 rounded mb-4">
              Please <Link to="/login" className="text-cyan underline font-medium">login</Link> to book an appointment
            </div>
          )}

          {isLoggedIn && user?.role === 'admin' && (
            <div className="bg-red-50 text-red-500 text-sm p-4 rounded mb-4">
              Admin cannot book appointments
            </div>
          )}

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-semibold text-lg mb-1">Appointment Booked!</h3>
              <p className="text-sm">We will confirm your appointment soon.</p>
              <button onClick={() => setSuccess(false)} className="mt-4 text-cyan text-sm underline">
                Book Another
              </button>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4">{error}</div>}
              <div className="grid grid-cols-2 border border-gray-200">
                <input
                  placeholder="Name"
                  value={user?.name || ''}
                  readOnly
                  className="p-4 border-b border-r border-gray-200 text-sm outline-none bg-gray-50"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  disabled={!canBook}
                  className="p-4 border-b border-gray-200 text-sm outline-none text-gray-500"
                >
                  <option value="">Type</option> {/* ✅ fixed from "Gender" */}
                  <option value="in-person">In Person</option>
                  <option value="online">Online</option>
                </select>
                <input
                  placeholder="Email"
                  value={user?.email || ''}
                  readOnly
                  className="p-4 border-b border-r border-gray-200 text-sm outline-none bg-gray-50"
                />
                <input
                  placeholder="Phone"
                  value={user?.phone || ''}
                  readOnly
                  className="p-4 border-b border-gray-200 text-sm outline-none bg-gray-50"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: '' })} // ✅ reset timeSlot
                  disabled={!canBook}
                  className="p-4 border-b border-r border-gray-200 text-sm outline-none text-gray-500"
                />
                <select
                  value={form.timeSlot}
                  onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                  disabled={!canBook || timeSlots.length === 0}
                  className="p-4 border-b border-gray-200 text-sm outline-none text-gray-500"
                >
                  <option value="">{timeSlots.length === 0 ? 'Closed' : 'Time'}</option> {/* ✅ shows Closed */}
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  disabled={!canBook}
                  className="p-4 border-b border-r border-gray-200 text-sm outline-none text-gray-500"
                >
                  <option value="">Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.userId?.name}</option>
                  ))}
                </select>
                <select
                  value={form.departmentId} // ✅ wired to form state
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  disabled={!canBook}
                  className="p-4 border-b border-gray-200 text-sm outline-none text-gray-500"
                >
                  <option value="">Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Message / Symptoms"
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  rows={4}
                  disabled={!canBook}
                  className="col-span-2 p-4 border-b border-gray-200 text-sm outline-none resize-none text-gray-500"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canBook || isLoading}
                className="w-full bg-bg-light text-navy py-4 font-semibold tracking-widest uppercase text-sm hover:bg-cyan hover:text-white transition border border-t-0 border-gray-200 disabled:opacity-50"
              >
                {isLoading ? 'Booking...' : 'Submit'}
              </button>
            </>
          )}
        </div>

        {/* right schedule */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-navy rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-white font-bold text-xl mb-6">Schedule hours</h3>
              <div className="space-y-3">
                {schedule.length > 0 ? schedule.map((s) => (
                  <div key={s.day} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{s.day}</span>
                    <span className="text-gray-400 text-xs">——</span>
                    <span className="text-gray-300 text-sm">
                      {s.isClosed ? 'Closed' : `${s.open} - ${s.close}`}
                    </span>
                  </div>
                )) : (
                  [
                    { day: 'Monday', hours: '09:00 AM - 07:00 PM' },
                    { day: 'Tuesday', hours: '09:00 AM - 07:00 PM' },
                    { day: 'Wednesday', hours: '09:00 AM - 07:00 PM' },
                    { day: 'Thursday', hours: '09:00 AM - 07:00 PM' },
                    { day: 'Friday', hours: '08:00 AM - 07:00 PM' },
                    { day: 'Saturday', hours: '09:00 AM - 07:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map((s) => (
                    <div key={s.day} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{s.day}</span>
                      <span className="text-gray-400 text-xs">——</span>
                      <span className="text-gray-300 text-sm">{s.hours}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-navy-light p-5 flex items-center gap-4 mt-2">
              <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
                <MdPhone className="text-cyan text-xl" />
              </div>
              <div>
                <p className="text-gray-300 text-xs">Emergency</p>
                <p className="text-white font-bold">{settings?.emergencyPhone || '(237) 681-812-255'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AppointmentContent