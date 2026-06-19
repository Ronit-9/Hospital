import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdPhone } from 'react-icons/md'
import { useGetDoctorsQuery } from '../../store/api/doctorApi'
import { useGetDepartmentsQuery } from '../../store/api/departmentApi'
import { useBookAppointmentMutation } from '../../store/api/appointmentApi'
import { useGetSettingsQuery } from '../../store/api/settingsApi'

const DAYS_SCHEDULE = [
  { day: 'Monday', open: true, hours: '09:00 AM - 07:00 PM' },
  { day: 'Tuesday', open: true, hours: '09:00 AM - 07:00 PM' },
  { day: 'Wednesday', open: true, hours: '09:00 AM - 07:00 PM' },
  { day: 'Thursday', open: true, hours: '09:00 AM - 07:00 PM' },
  { day: 'Friday', open: true, hours: '08:00 AM - 05:00 PM' },
  { day: 'Saturday', open: false, hours: 'Closed' },
  { day: 'Sunday', open: false, hours: 'Closed' },
]

const inputClass = "w-full h-full px-4 py-4 bg-navy text-white text-sm placeholder-blue-200 outline-none border-r border-b border-blue-800 focus:bg-navy-light transition"
const selectClass = "w-full h-full px-4 py-4 bg-navy text-white text-sm outline-none border-r border-b border-blue-800 focus:bg-navy-light transition appearance-none cursor-pointer"

const AppointmentContent = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    doctorId: '',
    departmentId: '',
    date: '',
    timeSlot: '',
    type: 'in-person',
    gender: 'male',
    symptoms: '',
    notes: '',
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
  const canBook = isLoggedIn && (user?.role === 'patient' || user?.role === 'doctor')

  const selectedDoctor = doctors.find((d) => d._id === form.doctorId) || null
  const availability = selectedDoctor?.availability || []

  const getTimeSlotsForDate = () => {
    if (!form.date) return []
    const [year, month, day] = form.date.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    const dayName = localDate.toLocaleDateString('en-US', { weekday: 'long' })
    if (!form.doctorId) {
      const isWeekend = dayName === 'Saturday' || dayName === 'Sunday'
      if (isWeekend) return []
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
    }
    const daySchedule = availability.find((a) => a.day === dayName)
    return daySchedule?.slots || []
  }

  const timeSlots = getTimeSlotsForDate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isLoggedIn) { navigate('/login'); return }
    if (!form.doctorId) { setError('Please select a doctor'); return }
    if (!form.departmentId) { setError('Please select a department'); return }
    if (!form.date) { setError('Please select a date'); return }
    if (!form.timeSlot) { setError('Please select a time slot'); return }
    if (!form.type) { setError('Please select appointment type'); return }
    try {
      await bookAppointment(form).unwrap()
      setSuccess(true)
      setForm({ doctorId: '', departmentId: '', date: '', timeSlot: '', type: 'in-person', gender: 'male', symptoms: '', notes: '' })
    } catch (err) {
      setError(err.data?.message || 'Booking failed')
    }
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-6">

        {/* left form */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy font-serif mb-4">
            Book an Appointment
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat
            scelerisque tortor ornare ornare. Convallis felis vitae tortor augue.
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
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded mb-4">{error}</div>
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
            <div className="border border-blue-800 overflow-hidden">

              {/* row 1 — name + gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <input
                  placeholder="Name"
                  value={user?.name || ''}
                  readOnly
                  className={inputClass}
                />
                <div className="relative">
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    disabled={!canBook}
                    className={selectClass + ' border-r-0'}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 text-xs">▼</span>
                </div>
              </div>

              {/* row 2 — email + phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <input
                  placeholder="Email"
                  value={user?.email || ''}
                  readOnly
                  className={inputClass}
                />
                <input
                  placeholder="Phone"
                  value={user?.phone || ''}
                  readOnly
                  className={inputClass + ' border-r-0'}
                />
              </div>

              {/* row 3 — date + time */}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: '' })}
                  disabled={!canBook}
                  className={inputClass + ' [color-scheme:dark]'}
                />
                <div className="relative">
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    className={selectClass + ' border-r-0'}
                  >
                    <option value="">
                      {!form.date
                        ? 'Select a date first'
                        : timeSlots.length === 0
                          ? 'Not available this day'
                          : 'Time'}
                    </option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 text-xs">▼</span>
                </div>
              </div>

              {/* row 4 — doctor + department */}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="relative">
                  <select
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: e.target.value, date: '', timeSlot: '' })}
                    disabled={!canBook}
                    className={selectClass}
                  >
                    <option value="">Doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>{d.userId?.name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 text-xs">▼</span>
                </div>
                <div className="relative">
                  <select
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    disabled={!canBook}
                    className={selectClass + ' border-r-0'}
                  >
                    <option value="">Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 text-xs">▼</span>
                </div>
              </div>

              {/* row 5 — type full width */}
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  disabled={!canBook}
                  className={selectClass + ' border-r-0'}
                >
                  <option value="in-person">In Person</option>
                  <option value="online">Online</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 text-xs">▼</span>
              </div>

              {/* row 6 — symptoms */}
              <textarea
                placeholder="Message / Symptoms"
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                rows={5}
                disabled={!canBook}
                className="w-full px-4 py-4 bg-navy text-white text-sm placeholder-blue-200 outline-none border-b border-blue-800 resize-none"
              />

              {/* submit */}
              <button
                onClick={handleSubmit}
                disabled={!canBook || isLoading}
                className="w-full bg-blue-100 text-navy py-4 font-semibold tracking-widest uppercase text-sm hover:bg-cyan hover:text-white transition disabled:opacity-50"
              >
                {isLoading ? 'Booking...' : 'Submit'}
              </button>
            </div>
          )}
        </div>

        {/* right schedule */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-navy rounded-lg overflow-hidden h-full">
            <div className="p-8 sm:p-10">
              <h3 className="text-white font-bold text-3xl sm:text-4xl font-serif mb-8">
                Schedule hours
              </h3>
              <div className="space-y-4">
                {DAYS_SCHEDULE.map((s) => (
                  <div key={s.day} className="flex items-center justify-between gap-4">
                    <span className="text-white text-sm sm:text-base w-28 flex-shrink-0">{s.day}</span>
                    <span className="text-blue-400 text-sm flex-1">———</span>
                    <span className={`text-sm sm:text-base text-right ${s.open ? 'text-white' : 'text-red-400'}`}>
                      {s.hours}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-blue-700 my-8" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
                  <MdPhone className="text-cyan text-2xl" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm">Emergency</p>
                  <p className="text-white font-bold text-lg sm:text-xl">
                    {settings?.emergencyPhone || '(237) 681-812-255'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AppointmentContent