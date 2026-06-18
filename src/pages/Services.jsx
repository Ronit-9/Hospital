import ServicesBanner from '../components/services/ServicesBanner'
import ServicesGrid from '../components/services/ServicesGrid'
import ContactSection from '../components/home/ContactSection.jsx'
import Footer from '../components/home/Footer.jsx'
import DoctorsSection from '../components/home/DoctorsSection.jsx'

const Services = () => {
  return (
    <div className="font-sans">
      <ServicesBanner />
      <ServicesGrid />
      <DoctorsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Services