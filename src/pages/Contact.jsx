import ContactBanner from '../components/contact/ContactBanner'
import ContactMap from '../components/contact/ContactMap'
import ContactForm from '../components/contact/ContactForm'
import NewsSection from '../components/home/NewsSection'
import Footer from '../components/home/Footer'

const Contact = () => {
  return (
    <div className="font-sans">
      <ContactBanner />
      <ContactMap />
      <ContactForm />
      <NewsSection />
      <Footer />
    </div>
  )
}

export default Contact