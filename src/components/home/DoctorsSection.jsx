import { Link } from 'react-router-dom'
import { FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa'
import { useGetDoctorsQuery } from '../../store/api/doctorApi.js'
import Avtar from '../home/Avatar.jsx'

const DoctorsSection = () => {
  const { data: doctorsData } = useGetDoctorsQuery()
  const doctors = doctorsData?.data || []

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
            Trusted Care
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy font-serif">Our Doctors</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 3).map((doctor) => (
            <div key={doctor._id} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
                {doctor.userId?.profileImage ? (
                  <img
                    src={doctor.userId.profileImage}
                    alt={doctor.userId?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avtar name={doctor.userId?.name} size="xl" />
                )}
              </div>
              <div className="bg-bg-light p-4 text-center">
                <p className="text-navy font-medium">{doctor.userId?.name}</p>
                <p className="text-navy font-bold text-xs tracking-widest uppercase mt-1">
                  {doctor.specialization}
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
              <Link
                to={`/doctors/${doctor._id}`}
                className="block bg-navy text-white text-center py-3 text-sm hover:bg-navy-light transition"
              >
                View Profile
              </Link>
            </div>
          ))
          }

          {
            doctors.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-72 bg-gray-200 flex items-center justify-center">
                  <Avtar name="Doctor" size="xl" />
                </div>
                <div className="bg-bg-light p-4 text-center">
                  <p className="text-navy font-medium">Doctor's Name</p>
                  <p className="text-navy font-bold text-xs tracking-widest uppercase mt-1">Neurology</p>
                  <div className="flex justify-center gap-3 mt-3">
                    <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white"><FaLinkedinIn size={11} /></span>
                    <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white"><FaFacebookF size={11} /></span>
                    <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white"><FaInstagram size={11} /></span>
                  </div>
                </div>
                <button className="block w-full bg-navy text-white text-center py-3 text-sm">View Profile</button>
              </div>
            ))
          }
        </div >

        <div className="text-center mt-8">
          <Link
            to="/doctors"
            className="inline-block border-2 border-navy text-navy px-8 py-3 rounded-full hover:bg-navy hover:text-white transition font-medium text-sm"
          >
            View All Doctors
          </Link>
        </div>
      </div >
    </section >
  )
}

export default DoctorsSection