import { Link } from 'react-router-dom'
import newsBanner from '../../assets/news.jpg'

const NewsBanner = () => {
  return (
    <section
      className="relative h-44 sm:h-56 md:h-64 flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${newsBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-navy/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm mb-2">
          <Link to="/" className="hover:text-cyan transition">Home</Link>
          <span>/</span>
          <span className="text-white">News</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Blog Posts</h1>
      </div>
    </section>
  )
}

export default NewsBanner