import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useUpdateMeMutation } from '../../store/api/authApi'
import { setCredentials } from '../../store/slices/authSlice'
import Avatar from '../../components/home/Avatar.jsx'

const PatientProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [updateMe, { isLoading }] = useUpdateMeMutation()

  const [form, setForm] = useState({ name: '', phone: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    try {
      const result = await updateMe(form).unwrap()
      dispatch(setCredentials({ ...user, ...result.data }))
      setSuccess(true)
    } catch (err) {
      setError(err.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-navy mb-6">My profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <Avatar name={user?.name} imageUrl={user?.profileImage} size="lg" />
        <div>
          <p className="text-navy font-medium text-lg">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
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
          <label className="text-sm font-medium text-gray-700">Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 text-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default PatientProfile