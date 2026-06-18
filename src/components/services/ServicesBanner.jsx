import { Link, useParams } from 'react-router-dom'
import serviceBanner from '../../assets/service.jpg'
import { useGetServiceQuery } from '../../store/api/serviceApi'

const ServicesBanner = () => {
  const { id } = useParams()
  const { data } = useGetServiceQuery(id, { skip: !id })
  const serviceName = data?.data?.name

  return (
    <section
      className="relative h-56 flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${serviceBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-navy/60" />
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
          <Link to="/" className="hover:text-cyan transition">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-cyan transition">Services</Link>
          {serviceName && (
            <>
              <span>/</span>
              <span className="text-white">{serviceName}</span>
            </>
          )}
        </div>
        <h1 className="text-5xl font-bold text-white">
          {serviceName || 'Our Services'}
        </h1>
      </div>
    </section>
  )
}

export default ServicesBanner