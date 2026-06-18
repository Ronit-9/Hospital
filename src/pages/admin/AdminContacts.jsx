import { useState } from 'react'
import { MdDelete, MdSearch, MdMarkEmailRead, MdEmail, MdMarkEmailUnread } from 'react-icons/md'
import {
  useGetAllMessagesQuery,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} from '../../store/api/contactApi'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const AdminContacts = () => {
  const [search, setSearch] = useState('')
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [error, setError] = useState('')

  const { data, isLoading } = useGetAllMessagesQuery()
  const [markAsRead, { isLoading: isMarking }] = useMarkAsReadMutation()
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation()

  const messages = data?.data || []
  const unreadCount = messages.filter((m) => !m.isRead).length

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  )

  const handleMarkAsRead = async (msg) => {
    if (msg.isRead) return
    try {
      await markAsRead(msg._id).unwrap()
    } catch (err) {
      setError(err.data?.message || 'Could not mark as read')
    }
  }

  const handleView = async (msg) => {
    setViewTarget(msg)
    if (!msg.isRead) {
      try {
        await markAsRead(msg._id).unwrap()
      } catch {
        // silently fail — message still shows
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMessage(deleteTarget._id).unwrap()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.data?.message || 'Cannot delete message')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length} total messages
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan/10 text-cyan">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="relative w-72 mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Received</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No messages found
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr
                key={item._id}
                className={`border-t border-gray-100 hover:bg-gray-50 transition ${!item.isRead ? 'bg-cyan/5' : ''
                  }`}
              >
                <td className="px-5 py-3">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${item.isRead ? 'bg-gray-300' : 'bg-cyan'
                      }`}
                    title={item.isRead ? 'Read' : 'Unread'}
                  />
                </td>
                <td className="px-5 py-3 font-medium text-navy">{item.name}</td>
                <td className="px-5 py-3 text-gray-500">{item.email}</td>
                <td className="px-5 py-3 text-gray-700 max-w-xs truncate">{item.subject}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right">
                  {/* View */}
                  <button
                    onClick={() => handleView(item)}
                    className="text-gray-400 hover:text-cyan transition mr-3"
                    title="View message"
                  >
                    <MdEmail size={18} />
                  </button>
                  {/* Mark as read */}
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item)}
                      disabled={isMarking}
                      className="text-gray-400 hover:text-green-500 transition mr-3"
                      title="Mark as read"
                    >
                      <MdMarkEmailRead size={18} />
                    </button>
                  )}
                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Message Modal */}
      {viewTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-navy">Message</h3>
              <button
                onClick={() => setViewTarget(null)}
                className="text-gray-400 hover:text-navy transition text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wide">From</span>
                  <p className="font-medium text-navy mt-0.5">{viewTarget.name}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wide">Email</span>
                  <p className="font-medium text-navy mt-0.5">{viewTarget.email}</p>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 text-xs uppercase tracking-wide">Subject</span>
                <p className="font-medium text-navy mt-0.5">{viewTarget.subject}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 text-xs uppercase tracking-wide">Message</span>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                  {viewTarget.message}
                </p>
              </div>
              <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                Received {new Date(viewTarget.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteTarget(viewTarget)
                  setViewTarget(null)
                }}
                className="text-sm text-red-500 hover:text-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setViewTarget(null)}
                className="bg-navy text-white px-5 py-2 rounded-lg text-sm hover:bg-navy-light transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminContacts