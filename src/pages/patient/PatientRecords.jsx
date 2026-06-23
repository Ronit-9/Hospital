import { useState } from 'react'
import { MdMedicalServices, MdCalendarMonth, MdExpandMore, MdExpandLess } from 'react-icons/md'
import { useGetMyMedicalRecordsQuery } from '../../store/api/medicalRecordApi'

const PatientRecords = () => {
  const { data, isLoading } = useGetMyMedicalRecordsQuery()
  const [expandedId, setExpandedId] = useState(null)

  const records = data?.data || []

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy mb-6">My medical records</h1>

      {isLoading && <div className="text-gray-400">Loading...</div>}

      {!isLoading && records.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-10 text-center text-gray-400">
          No medical records yet. Records appear here after a completed appointment.
        </div>
      )}

      <div className="space-y-3">
        {records.map((record) => {
          const isOpen = expandedId === record._id
          return (
            <div key={record._id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : record._id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <MdMedicalServices className="text-cyan" size={22} />
                  <div>
                    <p className="font-medium text-navy">{record.diagnosis}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                      <MdCalendarMonth size={14} /> {new Date(record.createdAt).toLocaleDateString()}
                      {' · '}Dr. {record.doctorId?.userId?.name}
                    </p>
                  </div>
                </div>
                {isOpen ? <MdExpandLess className="text-gray-400" /> : <MdExpandMore className="text-gray-400" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  {record.prescription?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Prescription</p>
                      <div className="space-y-2">
                        {record.prescription.map((m, i) => (
                          <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                            <span className="font-medium text-navy">{m.medicine}</span>
                            <span className="text-gray-500">{m.dosage} · {m.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-gray-600 text-sm">{record.notes}</p>
                    </div>
                  )}

                  {record.followUpDate && (
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Follow-up date</p>
                      <p className="text-gray-600 text-sm">{new Date(record.followUpDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PatientRecords