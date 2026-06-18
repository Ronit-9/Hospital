import AboutBanner from '../components/about/AboutBanner'
import AboutContent from '../components/about/AboutContent'
import AboutTestimonial from '../components/about/AboutTestimonial'
import DoctorsSection from '../components/home/DoctorsSection.jsx'
import NewsSection from '../components/home/NewsSection.jsx'
import ContactSection from '../components/home/ContactSection.jsx'
import Footer from '../components/home/Footer.jsx'

const About = () => {
  return (
    <div className="font-sans">
      <AboutBanner />
      <AboutContent />
      <AboutTestimonial />
      <DoctorsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default About