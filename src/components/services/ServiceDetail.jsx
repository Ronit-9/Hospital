import { useParams, Link } from 'react-router-dom'
import { GiHeartOrgan } from 'react-icons/gi'
import { useGetServiceQuery, useGetServicesQuery } from '../../store/api/serviceApi'

const features = [
  'A Passion for Healing', '5-Star Care', 'A Legacy of Excellence',
  'All our best', 'Believe in Us', 'Always Caring',
]

const ServiceDetail = () => {
  const { id } = useParams()
  const { data: serviceData, isLoading } = useGetServiceQuery(id)
  const { data: servicesData } = useGetServicesQuery()

  const service = serviceData?.data
  const allServices = servicesData?.data || []

  if (isLoading) {
    return <div className="py-20 text-center text-gray-400">Loading...</div>
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex gap-8">

        {/* left sidebar */}
        <div className="w-52 flex-shrink-0">
          {allServices.map((s) => (
            <Link
              key={s._id}
              to={`/services/${s._id}`}
              className={`flex items-center gap-3 p-4 border-b transition ${s._id === id
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy hover:bg-bg-light'
                }`}
            >
              <GiHeartOrgan className={`text-lg flex-shrink-0 ${s._id === id ? 'text-white' : 'text-cyan'}`} />
              <span className="text-sm font-medium">{s.name}</span>
            </Link>
          ))}
        </div>

        {/* right content */}
        <div className="flex-1">
          {/* main image */}
          <div className="h-80 bg-gray-100 rounded-lg overflow-hidden mb-8">
            {service?.image ? (
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-bg-light flex items-center justify-center">
                <GiHeartOrgan className="text-cyan text-6xl" />
              </div>
            )}
          </div>

          {/* title */}
          <h2 className="text-2xl font-bold text-navy mb-6">
            A passion for putting patients first
          </h2>

          {/* feature bullets */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {features.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          {/* description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            {service?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et.'}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            placerat scelerisque. Convallis felis vitae tortor augue. Velit
            nascetur proin massa in.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ServiceDetail