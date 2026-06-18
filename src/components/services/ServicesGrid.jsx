import { Link } from 'react-router-dom'
import { MdArrowForward } from 'react-icons/md'
import { GiHeartOrgan } from 'react-icons/gi'
import { useGetServicesQuery } from '../../store/api/serviceApi'

const ServicesGrid = () => {
  const { data: servicesData, isLoading } = useGetServicesQuery()
  const services = servicesData?.data || []

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">Loading services...</div>
    )
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={service._id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
              {/* image */}
              <div className="h-52 bg-gray-100 overflow-hidden relative">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-light flex items-center justify-center">
                    <GiHeartOrgan className="text-cyan text-5xl" />
                  </div>
                )}
                {/* icon overlay */}
                <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center ${i === 0 ? 'bg-navy' : 'bg-navy'}`}>
                  <GiHeartOrgan className="text-white text-lg" />
                </div>
              </div>

              {/* content */}
              <div className="p-5">
                <h3 className="text-navy font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Convallis felis vitae tortor augue. Velit nascetur massa in.'}
                </p>
                <Link
                  to={`/services/${service._id}`}
                  className="text-cyan text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Learn More <MdArrowForward />
                </Link>
              </div>
            </div>
          ))}

          {/* fallback */}
          {services.length === 0 && [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div className="h-52 bg-gray-200 flex items-center justify-center">
                <GiHeartOrgan className="text-gray-400 text-5xl" />
              </div>
              <div className="p-5">
                <h3 className="text-navy font-semibold text-lg mb-2">Free Checkup</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat Convallis felis vitae tortor augue. Velit nascetur massa in.
                </p>
                <span className="text-cyan text-sm font-medium flex items-center gap-1">
                  Learn More <MdArrowForward />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid