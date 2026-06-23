import { useState } from 'react'
import { MdClose, MdStar, MdStarBorder, MdEventBusy } from 'react-icons/md'
import { useGetMyAppointmentsQuery, useCancelAppointmentMutation } from '../../store/api/appointmentApi'
import { useCreateReviewMutation } from '../../store/api/reviewApi'

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

const STATUS_STYLES = {
  pending: 'bg-amber-50  text-amber-600  ring-1 ring-amber-200',
  confirmed: 'bg-cyan-50   text-cyan        ring-1 ring-cyan/20',
  completed: 'bg-green-50  text-green-600  ring-1 ring-green-200',
  cancelled: 'bg-red-50    text-red-500    ring-1 ring-red-200',
}

const PatientAppointments = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const [reviewTarget, setReviewTarget] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const { data, isLoading } = useGetMyAppointmentsQuery()
  const [cancelAppointment] = useCancelAppointmentMutation()
  const [createReview, { isLoading: isReviewing }] = useCreateReviewMutation()

  const appointments = data?.data || []
  const filtered = statusFilter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter)

  const handleCancel = async (id) => {
    setError('')
    setCancellingId(id)
    try {
      await cancelAppointment(id).unwrap()
    } catch (err) {
      setError(err?.data?.message || 'Failed to cancel appointment')
    } finally {
      setCancellingId(null)
    }
  }

  const openReview = (appointment) => {
    setReviewTarget(appointment)
    setRating(5)
    setComment('')
    setError('')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createReview({
        doctorId: reviewTarget.doctorId._id,
        appointmentId: reviewTarget._id,
        rating,
        comment,
      }).unwrap()
      setSuccess('Review submitted — thank you!')
      setReviewTarget(null)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <h1 className="text-2xl font-bold text-navy mb-6">My appointments</h1>

      {/* Toasts */}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 ring-1 ring-green-200">
          {success}
        </div>
      )}
      {error && !reviewTarget && (
        <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4 ring-1 ring-red-200">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-5">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-cyan transition bg-white"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading appointments…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <MdEventBusy size={36} className="text-gray-200" />
            <p className="text-sm">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Doctor', 'Date', 'Time', 'Type', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${h === '' ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a) => {
                  const doctorName = a.doctorId?.userId?.name ?? a.doctorId?.name ?? '—'
                  const isCancellingThis = cancellingId === a._id

                  return (
                    <tr key={a._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Doctor */}
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-navy">{doctorName}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{a.doctorId?.specialization}</p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-gray-500">
                        {new Date(a.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>

                      {/* Time */}
                      <td className="px-5 py-3.5 text-gray-500">{a.timeSlot}</td>

                      {/* Type */}
                      <td className="px-5 py-3.5 text-gray-500 capitalize">{a.type}</td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {a.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {(a.status === 'pending' || a.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(a._id)}
                            disabled={isCancellingThis}
                            className="text-red-500 text-xs font-semibold hover:text-red-600 disabled:opacity-40 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
                          >
                            {isCancellingThis ? 'Cancelling…' : 'Cancel'}
                          </button>
                        )}
                        {a.status === 'completed' && (
                          a.hasReview ? (
                            <span className="text-gray-300 text-xs font-medium">Reviewed</span>
                          ) : (
                            <button
                              onClick={() => openReview(a)}
                              className="text-cyan text-xs font-semibold hover:text-cyan/80 transition px-3 py-1.5 rounded-lg hover:bg-cyan/5"
                            >
                              Leave review
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review modal */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-navy">Leave a review</h3>
              <button
                onClick={() => setReviewTarget(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition"
              >
                <MdClose size={18} />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-5">
              Dr. {reviewTarget.doctorId?.userId?.name ?? reviewTarget.doctorId?.name}
            </p>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star rating */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Rating
                </label>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      {n <= rating ? <MdStar size={28} /> : <MdStarBorder size={28} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience…"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition resize-none placeholder:text-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={isReviewing}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isReviewing ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default PatientAppointments