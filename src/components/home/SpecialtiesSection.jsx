import { Link } from 'react-router-dom'
import { GiHeartOrgan } from 'react-icons/gi'
import { useGetDepartmentsQuery } from '../../store/api/departmentApi.js'

const fallback = [
  { _id: '1', name: 'Neurology' }, { _id: '2', name: 'Bones' },
  { _id: '3', name: 'Oncology' }, { _id: '4', name: 'Otorhinolaryngology' },
  { _id: '5', name: 'Ophthalmology' }, { _id: '6', name: 'Cardiovascular' },
  { _id: '7', name: 'Pulmonology' }, { _id: '8', name: 'Renal Medicine' },
  { _id: '9', name: 'Gastroenterology' }, { _id: '10', name: 'Urology' },
  { _id: '11', name: 'Dermatology' }, { _id: '12', name: 'Gynaecology' },
]

const SpecialtiesSection = () => {
  const { data: departmentsData } = useGetDepartmentsQuery()
  const specialties = departmentsData?.data?.length > 0 ? departmentsData.data : fallback

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
            Always Caring
          </p>
          <h2 className="text-4xl font-bold text-navy font-serif">Our Specialties</h2>
        </div>
        <div className="grid grid-cols-4 border-l border-t border-gray-200">
          {specialties.map((dept, i) => (
            <Link
              to={`/doctors?department=${dept._id}`}
              key={dept._id}
              className={`p-8 text-center border-r border-b border-gray-200 hover:bg-navy hover:text-white transition group ${i === 1 ? 'bg-navy text-white' : 'bg-white text-navy'
                }`}
            >
              <GiHeartOrgan className={`mx-auto mb-3 text-3xl ${i === 1 ? 'text-white' : 'text-cyan group-hover:text-white'}`} />
              <p className="text-sm font-medium">{dept.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpecialtiesSection