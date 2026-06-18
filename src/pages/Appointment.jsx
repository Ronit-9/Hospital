import AppointmentBanner from '../components/appointment/AppointmentBanner'
import AppointmentContent from '../components/appointment/AppointmentContent'
import ContactMap from '../components/contact/ContactMap'
import ContactSection from '../components/home/ContactSection'
import Footer from '../components/home/Footer'

const Appointment = () => {
  return (
    <div className="font-sans">
      <AppointmentBanner />
      <AppointmentContent />
      <ContactMap />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default Appointment