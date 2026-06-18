import DoctorsBanner from '../components/doctors/DoctorsBanner'
import DoctorsGrid from '../components/doctors/DoctorsGrid'
import ContactSection from '../components/home/ContactSection.jsx'
import Footer from '../components/home/Footer.jsx'
import AboutTestimonial from '../components/about/AboutTestimonial'
import NewsSection from '../components/home/NewsSection.jsx'

const Doctors = () => {
  return (
    <div className="font-sans">
      <DoctorsBanner />
      <DoctorsGrid />
      <AboutTestimonial />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Doctors