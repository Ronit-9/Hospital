import { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose } from 'react-icons/md'
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../store/api/serviceApi'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const emptyForm = { name: '', description: '', icon: '' }

const AdminServices = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')

  const { data, isLoading } = useGetAllServicesQuery()
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  const services = data?.data || []
  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingService(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingService(item)
    setForm({
      name: item.name,
      description: item.description || '',
      icon: item.icon || '',
    })
    setImageFile(null)
    setImagePreview(item.image || '')
    setError('')
    setIsModalOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const buildFormData = () => {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('description', form.description)
    fd.append('icon', form.icon)
    if (imageFile) fd.append('image', imageFile)
    return fd
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const fd = buildFormData()
      if (editingService) {
        await updateService({ id: editingService._id, body: fd }).unwrap()
      } else {
        await createService(fd).unwrap()
      }
      setIsModalOpen(false)
    } catch (err) {
      setError(err.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteService(deleteTarget._id).unwrap()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.data?.message || 'Cannot delete service')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} total services</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm hover:bg-navy-light transition"
        >
          <MdAdd size={18} /> Add Service
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="relative w-72 mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search services..."
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
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Icon</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No services found</td></tr>
            )}
            {filtered.map((item) => (
              <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="w-12 h-10 rounded bg-bg-light overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-cyan text-xs">No img</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 font-medium text-navy">{item.name}</td>
                <td className="px-5 py-3 text-gray-500">{item.icon || '—'}</td>
                <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{item.description || '—'}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEditModal(item)} className="text-gray-400 hover:text-cyan transition mr-3">
                    <MdEdit size={18} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="text-gray-400 hover:text-red-500 transition">
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
                {editingService ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy transition">
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">{error}</div>}

              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Icon (class or emoji)</label>
                <input
                  type="text"
                  placeholder="e.g. fa-heart or 🫀"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mt-1 text-sm"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="preview" className="w-24 h-20 object-cover rounded mt-2" />
                )}
              </div>

              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminServices