import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useGetAllNewsQuery, useLikeNewsMutation } from '../../store/api/newsApi'

const NewsSection = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { data: newsData } = useGetAllNewsQuery()
  const [likeNews] = useLikeNewsMutation()
  const news = newsData?.data || []

  const handleLike = async (id) => {
    if (!isLoggedIn) { navigate('/login'); return }
    await likeNews(id)
  }

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
            Better Information, Better Health
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy font-serif">News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.slice(0, 4).map((item) => (
            <Link to={`/news/${item._id}`} key={item._id} className="flex gap-4 items-start group">
              <div className="w-24 h-20 sm:w-32 sm:h-24 bg-gray-300 rounded overflow-hidden flex-shrink-0">
                {item.image
                  ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-navy/20" />
                }
              </div>
              <div className="flex-1">
                <p className="text-cyan text-xs mb-1">
                  {new Date(item.publishedAt).toLocaleDateString('en-US', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                  })} | By {item.author?.name}
                </p>
                <h4 className="text-navy font-medium text-sm mb-2 group-hover:text-cyan transition">
                  {item.title}
                </h4>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FaEye /> {item.views}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); handleLike(item._id) }}
                    className="flex items-center gap-1 hover:text-red-400 transition"
                  >
                    <FaHeart /> {item.likes}
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {news.length === 0 && [1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-24 h-20 sm:w-32 sm:h-24 bg-gray-300 rounded flex-shrink-0" />
              <div>
                <p className="text-cyan text-xs mb-1">Monday 05, September 2021 | By Author</p>
                <h4 className="text-navy font-medium text-sm mb-2">This Article's Title goes Here, but not too long.</h4>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FaEye /> 68</span>
                  <span className="flex items-center gap-1"><FaHeart /> 86</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsSection