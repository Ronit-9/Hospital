import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetDoctorsQuery } from '../../store/api/doctorApi.js'
import { useGetDepartmentsQuery } from '../../store/api/departmentApi.js'
import { useBookAppointmentMutation } from '../../store/api/appointmentApi.js'
import heroImage from '../../assets/appointment.jpg'

const AppointmentSection = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    doctorId: '', date: '', timeSlot: '', type: 'in-person', symptoms: '',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { data: doctorsData } = useGetDoctorsQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const [bookAppointment, { isLoading }] = useBookAppointmentMutation()

  const doctors = doctorsData?.data || []
  const departments = departmentsData?.data || []
  const canBook = isLoggedIn && (user?.role === 'patient' || user?.role === 'doctor')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isLoggedIn) { navigate('/login'); return }
    try {
      await bookAppointment(form).unwrap()
      setSuccess(true)
      setForm({ doctorId: '', date: '', timeSlot: '', type: 'in-person', symptoms: '' })
    } catch (err) {
      setError(err.data?.message || 'Booking failed')
    }
  }

  return (
    <section className="relative py-12 md:py-20 px-4 sm:px-6 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }}
      />
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 text-white text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan mb-4">Book an Appointment</h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat
            scelerisque tortor ornare ornare. Convallis felis vitae tortor augue.
          </p>
        </div>

        <div className="w-full max-w-[500px] lg:w-[500px] flex-shrink-0 bg-navy">
          {success ? (
            <div className="p-8 text-center text-white">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Appointment Booked!</h3>
              <p className="text-gray-300 text-sm mb-4">We will confirm your appointment soon.</p>
              <button onClick={() => setSuccess(false)} className="text-cyan text-sm underline">
                Book Another
              </button>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-500/20 text-red-300 text-sm p-3 text-center">{error}</div>}
              {!isLoggedIn && (
                <div className="bg-cyan/20 text-white text-sm p-4 text-center">
                  Please <Link to="/login" className="text-cyan underline font-medium">login</Link> to book an appointment
                </div>
              )}
              {isLoggedIn && user?.role === 'admin' && (
                <div className="bg-cyan/20 text-white text-sm p-4 text-center">
                  Admin cannot book appointments
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <input
                  placeholder="Name"
                  value={user?.name || ''}
                  readOnly
                  className="bg-navy text-white border-b sm:border-r border-navy-light p-4 placeholder-gray-400 text-sm outline-none"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  disabled={!canBook}
                  className="bg-navy text-gray-300 border-b border-navy-light p-4 text-sm outline-none"
                >
                  <option value="in-person">In Person</option>
                  <option value="online">Online</option>
                </select>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  disabled={!canBook}
                  className="bg-navy text-gray-300 border-b sm:border-r border-navy-light p-4 text-sm outline-none"
                />
                <select
                  value={form.timeSlot}
                  onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                  disabled={!canBook}
                  className="bg-navy text-gray-300 border-b border-navy-light p-4 text-sm outline-none"
                >
                  <option value="">Time</option>
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  disabled={!canBook}
                  className="bg-navy text-gray-300 border-b sm:border-r border-navy-light p-4 text-sm outline-none"
                >
                  <option value="">Doctor</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>{d.userId?.name}</option>
                  ))}
                </select>
                <select
                  disabled={!canBook}
                  className="bg-navy text-gray-300 border-b border-navy-light p-4 text-sm outline-none"
                >
                  <option value="">Department</option>
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Message / Symptoms"
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  rows={4}
                  disabled={!canBook}
                  className="col-span-1 sm:col-span-2 bg-navy text-white border-b border-navy-light p-4 placeholder-gray-400 text-sm outline-none resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canBook || isLoading}
                className="w-full bg-bg-light text-navy py-4 font-semibold tracking-widest uppercase text-sm hover:bg-cyan hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Booking...' : 'Submit'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default AppointmentSection