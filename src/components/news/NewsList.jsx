import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdCalendarMonth, MdArrowForward } from 'react-icons/md'
import { FaUser, FaEye, FaHeart } from 'react-icons/fa'
import { useGetAllNewsQuery, useLikeNewsMutation } from '../../store/api/newsApi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NewsSidebar from './NewsSidebar'

const NewsList = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { data: newsData, isLoading } = useGetAllNewsQuery()
  const [likeNews] = useLikeNewsMutation()

  const news = newsData?.data || []

  const filtered = news.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(search.toLowerCase())
  )

  const handleLike = async (e, id) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/login'); return }
    await likeNews(id)
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex gap-10">

        {/* left news list */}
        <div className="flex-1">
          {isLoading && (
            <div className="text-center py-20 text-gray-400">Loading news...</div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">No news found</div>
          )}

          <div className="space-y-12">
            {filtered.map((item) => (
              <div key={item._id} className="border-b border-gray-100 pb-12">
                {/* image */}
                <div className="h-64 bg-gray-200 rounded overflow-hidden mb-4">
                  {item.image
                    ? <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    : <div className="w-full h-full bg-bg-light flex items-center justify-center text-gray-400">No Image</div>
                  }
                </div>

                {/* meta */}
                <div className="flex items-center gap-5 text-gray-400 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <MdCalendarMonth />
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser />
                    By {item.author?.name || 'Author'}
                  </span>
                  <span className="flex items-center gap-1"><FaEye /> {item.views}</span>
                  <button
                    onClick={(e) => handleLike(e, item._id)}
                    className="flex items-center gap-1 hover:text-red-400 transition"
                  >
                    <FaHeart /> {item.likes}
                  </button>
                </div>

                {/* title */}
                <h2 className="text-navy font-bold text-xl mb-3 hover:text-cyan transition">
                  <Link to={`/news/${item._id}`}>{item.title}</Link>
                </h2>

                {/* excerpt */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                  {item.excerpt || item.content}
                </p>

                {/* read more */}
                <Link
                  to={`/news/${item._id}`}
                  className="inline-flex items-center gap-2 border border-cyan text-cyan px-5 py-2 rounded-full text-sm hover:bg-cyan hover:text-white transition"
                >
                  Read More <MdArrowForward />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* right sidebar */}
        <NewsSidebar search={search} setSearch={setSearch} />
      </div>
    </section>
  )
}

export default NewsList