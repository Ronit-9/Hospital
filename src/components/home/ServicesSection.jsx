import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GiHeartOrgan } from 'react-icons/gi'
import { useGetServicesQuery } from '../../store/api/serviceApi.js'
import Section2 from '../../assets/service2.jpg'
import Section1 from '../../assets/service.jpg'

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0)
  const { data: servicesData } = useGetServicesQuery()
  const services = servicesData?.data || []

  const fallbackServices = ['Free Checkup', 'Cardiogram', 'DNA Testing', 'Blood Bank']

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
            Care You Can Believe In
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy font-serif">Our Services</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* sidebar */}
          <div className="w-full lg:w-48 flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1">
            {services.length > 0 ? services.map((service, i) => (
              <button
                key={service._id}
                onClick={() => setActiveService(i)}
                className={`w-full p-4 lg:p-5 text-center border-b border-r lg:border-r-0 transition ${activeService === i ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-bg-light'
                  }`}
              >
                {service.image
                  ? <img src={service.image} alt={service.name} className="w-8 h-8 mx-auto mb-2 object-contain" />
                  : <GiHeartOrgan className={`mx-auto mb-2 text-2xl ${activeService === i ? 'text-white' : 'text-cyan'}`} />
                }
                <p className="text-xs font-medium">{service.name}</p>
              </button>
            )) : fallbackServices.map((name, i) => (
              <button
                key={name}
                onClick={() => setActiveService(i)}
                className={`w-full p-4 lg:p-5 text-center border-b border-r lg:border-r-0 transition ${activeService === i ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-bg-light'
                  }`}
              >
                <GiHeartOrgan className={`mx-auto mb-2 text-2xl ${activeService === i ? 'text-white' : 'text-cyan'}`} />
                <p className="text-xs font-medium">{name}</p>
              </button>
            ))}
            <Link
              to="/services"
              className="col-span-2 sm:col-span-4 lg:col-span-1 block w-full bg-navy text-white py-3 text-center text-sm hover:bg-navy-light transition"
            >
              View All
            </Link>
          </div>

          {/* content */}
          <div className="flex-1 order-3 lg:order-none">
            <h3 className="text-xl md:text-2xl font-bold text-navy mb-4">
              {services[activeService]?.name || 'A passion for putting patients first.'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {['A Passion for Healing', '5-Star Care', 'All our best', 'Believe in Us', 'A Legacy of Excellence', 'Always Caring'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {services[activeService]?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
            </p>
          </div>

          {/* right images */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-4 order-2 lg:order-none">
            <div className="flex-1 lg:flex-none h-32 sm:h-40 lg:h-44 bg-gray-200 rounded overflow-hidden">
              <img
                src={Section1}
                alt="medical"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 lg:flex-none h-32 sm:h-40 lg:h-44 bg-gray-200 rounded overflow-hidden">
              <img
                src={Section2}
                alt="team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection