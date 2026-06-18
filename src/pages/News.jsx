import NewsBanner from '../components/news/NewsBanner'
import NewsList from '../components/news/NewsList'
import ContactSection from '../components/home/ContactSection'
import Footer from '../components/home/Footer'

const News = () => {
  return (
    <div className="font-sans">
      <NewsBanner />
      <NewsList />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default News