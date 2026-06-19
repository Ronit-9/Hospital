import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaSearch } from 'react-icons/fa'
import { useGetDoctorsQuery } from '../../store/api/doctorApi'
import Avatar from '../home/Avatar'

const DoctorsGrid = () => {
  const [search, setSearch] = useState('')
  const { data: doctorsData, isLoading } = useGetDoctorsQuery()
  const doctors = doctorsData?.data || []

  const filtered = doctors.filter((d) =>
    d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* search bar */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, specialization or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition"
            />
          </div>
        </div>

        {/* loading */}
        {isLoading && (
          <div className="text-center py-20 text-gray-400">Loading doctors...</div>
        )}

        {/* no results */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No doctors found</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-cyan text-sm underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* doctors grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <div
              key={doctor._id}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {/* image */}
              <div className="h-56 sm:h-64 lg:h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
                {doctor.userId?.profileImage ? (
                  <img
                    src={doctor.userId.profileImage}
                    alt={doctor.userId?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar name={doctor.userId?.name} size="xl" />
                )}
              </div>

              {/* info */}
              <div className="bg-bg-light p-4 text-center">
                <p className="text-navy font-medium">{doctor.userId?.name}</p>
                <p className="text-navy font-bold text-xs tracking-widest uppercase mt-1">
                  {doctor.specialization}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {doctor.department?.name}
                </p>
                <div className="flex justify-center gap-3 mt-3">
                  <a
                    href={doctor.socialLinks?.linkedin || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white hover:bg-cyan transition"
                  >
                    <FaLinkedinIn size={11} />
                  </a>
                  <a
                    href={doctor.socialLinks?.facebook || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white hover:bg-cyan transition"
                  >
                    <FaFacebookF size={11} />
                  </a>
                  <a
                    href={doctor.socialLinks?.instagram || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white hover:bg-cyan transition"
                  >
                    <FaInstagram size={11} />
                  </a>
                </div>
              </div>

              {/* view profile button */}
              <Link

                className="block bg-navy text-white text-center py-3 text-sm hover:bg-navy-light transition"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>

        {/* results count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            Showing {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
          </p>
        )}
      </div>
    </section>
  )
}

export default DoctorsGrid