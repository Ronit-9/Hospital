import { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md'
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from '../../store/api/departmentApi'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const iconOptions = [
  'GiHeartOrgan', 'MdFavorite', 'MdHealthAndSafety', 'GiBrain',
  'GiBoneKnife', 'MdVisibility', 'GiLungs', 'MdWaterDrop',
]

const AdminDepartments = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: 'GiHeartOrgan' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')

  const { data, isLoading } = useGetDepartmentsQuery()
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation()
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation()
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation()

  const departments = data?.data || []
  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingDept(null)
    setForm({ name: '', description: '', icon: 'GiHeartOrgan' })
    setImageFile(null)
    setImagePreview('')
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (dept) => {
    setEditingDept(dept)
    setForm({ name: dept.name, description: dept.description || '', icon: dept.icon || 'GiHeartOrgan' })
    setImageFile(null)
    setImagePreview(dept.image || '')
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
      if (editingDept) {
        await updateDepartment({ id: editingDept._id, body: fd }).unwrap()
      } else {
        await createDepartment(fd).unwrap()
      }
      setIsModalOpen(false)
    } catch (err) {
      setError(err.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDepartment(deleteTarget._id).unwrap()
      setDeleteTarget(null)
    } catch (err) {
      setError(err.data?.message || 'Cannot delete department')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Departments</h1>
          <p className="text-gray-500 text-sm mt-1">{departments.length} total departments</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg text-sm hover:bg-navy-light transition"
        >
          <MdAdd size={18} /> Add Department
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="relative w-72 mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search departments..."
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
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Doctors</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">Loading...</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No departments found</td></tr>
            )}
            {filtered.map((dept) => (
              <tr key={dept._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="w-10 h-10 rounded bg-bg-light overflow-hidden flex items-center justify-center">
                    {dept.image ? (
                      <img src={dept.image} alt={dept.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-cyan text-xs">No img</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 font-medium text-navy">{dept.name}</td>
                <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{dept.description || '—'}</td>
                <td className="px-5 py-3">
                  <span className="bg-cyan/10 text-cyan px-2 py-1 rounded text-xs font-medium">
                    {dept.doctorCount ?? 0}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEditModal(dept)} className="text-gray-400 hover:text-cyan transition mr-3">
                    <MdEdit size={18} />
                  </button>
                  <button onClick={() => setDeleteTarget(dept)} className="text-gray-400 hover:text-red-500 transition">
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Add Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan transition"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
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
              <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded mt-2" />
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition disabled:opacity-50"
          >
            {isCreating || isUpdating ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminDepartments