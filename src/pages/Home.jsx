import HeroSection from '../components/home/HeroSection'
import WelcomeSection from '../components/home/WelcomeSection'
import ServicesSection from '../components/home/ServicesSection'
import SpecialtiesSection from '../components/home/SpecialtiesSection'
import AppointmentSection from '../components/home/AppointmentSection'
import DoctorsSection from '../components/home/DoctorsSection'
import NewsSection from '../components/home/NewsSection'
import ContactSection from '../components/home/ContactSection'
import Footer from '../components/home/Footer'
import AboutBanner from '../components/about/AboutBanner'

const Home = () => {
  return (
    <div className="font-sans">
      <HeroSection />
      <WelcomeSection />
      <AboutBanner />
      <ServicesSection />
      <SpecialtiesSection />
      <AppointmentSection />
      <DoctorsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Home