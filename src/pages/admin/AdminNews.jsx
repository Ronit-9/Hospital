import { useState } from 'react'
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdClose,
  MdVisibility,
  MdFavorite
} from 'react-icons/md'
import {
  useGetAllNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} from '../../store/api/newsApi'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const emptyForm = {
  title: '',
  content: '',
  excerpt: '',
  tags: '',
  image: ''
}

const AdminNews = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')

  const { data, isLoading } = useGetAllNewsQuery()
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation()
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation()

  const news = data?.data || []

  const filtered = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingNews(null)
    setForm(emptyForm)
    setImagePreview('')
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingNews(item)
    setForm({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      tags: (item.tags || []).join(', '),
      image: item.image || ''
    })
    setImagePreview(item.image || '')
    setError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const newsData = {
        ...form,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }

      if (editingNews) {
        await updateNews({
          id: editingNews._id,
          newsData
        }).unwrap()
      } else {
        await createNews(newsData).unwrap()
      }

      setIsModalOpen(false)
    } catch (err) {
      setError(err.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNews(deleteTarget._id).unwrap()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.data?.message || 'Cannot delete news')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage News</h1>
          <p className="text-gray-500 text-sm mt-1">{news.length} total posts</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm hover:bg-navy-light transition"
        >
          <MdAdd size={18} /> Add News
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="relative w-72 mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan transition"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Stats</th>
              <th className="px-5 py-3">Published</th>
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
                  No news found
                </td>
              </tr>
            )}

            {filtered.map((item) => (
              <tr
                key={item._id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-5 py-3">
                  <div className="w-12 h-10 rounded bg-bg-light overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-cyan text-xs">No img</span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-3 font-medium text-navy max-w-xs truncate">
                  {item.title}
                </td>

                <td className="px-5 py-3 text-gray-500">
                  {item.author?.name}
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MdVisibility size={14} /> {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdFavorite size={14} /> {item.likes}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-gray-400 hover:text-cyan transition mr-3"
                  >
                    <MdEdit size={18} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-navy">
                {editingNews ? 'Edit News' : 'Add News'}
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-navy transition"
              >
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
                className="w-full border rounded px-4 py-2"
              />

              <textarea
                placeholder="Excerpt"
                value={form.excerpt}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
                rows={2}
                className="w-full border rounded px-4 py-2"
              />

              <textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                rows={6}
                required
                className="w-full border rounded px-4 py-2"
              />

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value })
                }
                className="w-full border rounded px-4 py-2"
              />

              <input
                type="text"
                placeholder="Paste image URL"
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value })
                  setImagePreview(e.target.value)
                }}
                className="w-full border rounded px-4 py-2"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-24 h-20 object-cover rounded"
                />
              )}

              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? 'Saving...'
                  : editingNews
                    ? 'Update News'
                    : 'Create News'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete News"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminNews