import ServicesBanner from '../components/services/ServicesBanner'
import ServiceDetail from '../components/services/ServiceDetail'
import ContactSection from '../components/home/ContactSection.jsx'
import Footer from '../components/home/Footer.jsx'

const SingleService = () => {
  return (
    <div className="font-sans">
      <ServicesBanner />
      <ServiceDetail />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default SingleService