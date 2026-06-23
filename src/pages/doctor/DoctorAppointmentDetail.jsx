import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MdArrowBack, MdAdd, MdClose } from 'react-icons/md'
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../../store/api/appointmentApi'
import { useGetMyDoctorProfileQuery } from '../../store/api/doctorApi'
import { useCreateMedicalRecordMutation } from '../../store/api/medicalRecordApi'

const emptyMedicine = { medicine: '', dosage: '', duration: '' }

const DoctorAppointmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: profileData } = useGetMyDoctorProfileQuery()
  const doctor = profileData?.data
  const { data: apptData, isLoading } = useGetDoctorAppointmentsQuery(doctor?._id, { skip: !doctor?._id })

  const appointment = apptData?.data?.find((a) => a._id === id)

  const [updateStatus] = useUpdateAppointmentStatusMutation()
  const [createRecord, { isLoading: isSaving }] = useCreateMedicalRecordMutation()

  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [prescription, setPrescription] = useState([{ ...emptyMedicine }])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (isLoading) {
    return <div className="p-8 text-gray-400">Loading...</div>
  }

  if (!appointment) {
    return <div className="p-8 text-gray-400">Appointment not found</div>
  }

  const addMedicine = () => setPrescription([...prescription, { ...emptyMedicine }])
  const removeMedicine = (i) => setPrescription(prescription.filter((_, idx) => idx !== i))
  const updateMedicine = (i, field, value) => {
    setPrescription(prescription.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createRecord({
        patientId: appointment.patientId._id,
        appointmentId: appointment._id,
        diagnosis,
        prescription: prescription.filter((m) => m.medicine.trim()),
        notes,
        followUpDate: followUpDate || null,
      }).unwrap()

      await updateStatus({ id: appointment._id, status: 'completed' }).unwrap()
      setSuccess(true)
    } catch (err) {
      setError(err.data?.message || 'Failed to save record')
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/doctor/appointments" className="flex items-center gap-2 text-gray-500 text-sm mb-6 hover:text-navy transition">
        <MdArrowBack /> Back to appointments
      </Link>

      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
        <h1 className="text-xl font-bold text-navy mb-4">Appointment details</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Patient</p>
            <p className="text-navy font-medium">{appointment.patientId?.name}</p>
            <p className="text-gray-500">{appointment.patientId?.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Date & time</p>
            <p className="text-navy font-medium">{new Date(appointment.date).toLocaleDateString()} · {appointment.timeSlot}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Type</p>
            <p className="text-navy capitalize">{appointment.type}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Status</p>
            <span className={`px-2 py-1 rounded text-xs font-medium ${appointment.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-cyan/10 text-cyan'
              }`}>
              {appointment.status}
            </span>
          </div>
        </div>
        {appointment.symptoms && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Symptoms</p>
            <p className="text-gray-600 text-sm">{appointment.symptoms}</p>
          </div>
        )}
      </div>

      {appointment.status === 'completed' ? (
        <div className="bg-green-50 text-green-700 p-5 rounded-lg text-sm">
          This appointment is already marked completed. A medical record has been created.
        </div>
      ) : success ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center">
          <p className="font-medium mb-1">Record saved and appointment marked completed</p>
          <Link to="/doctor/appointments" className="text-cyan text-sm underline">Back to appointments</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-navy">Write medical record</h2>

          {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">{error}</div>}

          <div>
            <label className="text-sm font-medium text-gray-700">Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Prescription</label>
            <div className="space-y-2">
              {prescription.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Medicine"
                    value={m.medicine}
                    onChange={(e) => updateMedicine(i, 'medicine', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                  <input
                    placeholder="Dosage"
                    value={m.dosage}
                    onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                  <input
                    placeholder="Duration"
                    value={m.duration}
                    onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                  />
                  {prescription.length > 1 && (
                    <button type="button" onClick={() => removeMedicine(i)} className="text-gray-400 hover:text-red-500 transition">
                      <MdClose size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMedicine}
              className="flex items-center gap-1 text-cyan text-sm mt-2 hover:underline"
            >
              <MdAdd size={16} /> Add medicine
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Follow-up date (optional)</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save record & mark completed'}
          </button>
        </form>
      )}
    </div>
  )
}

export default DoctorAppointmentDetail