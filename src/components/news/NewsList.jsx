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
  const [selectedCategory, setSelectedCategory] = useState(null)
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { data: newsData, isLoading } = useGetAllNewsQuery()
  const [likeNews] = useLikeNewsMutation()

  const news = newsData?.data || []

  const filtered = news.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory ? item.title === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const handleLike = async (e, id) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/login'); return }
    await likeNews(id)
  }

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Active filter banner */}
        {selectedCategory && (
          <div className="mb-6 flex items-center gap-3 bg-cyan/10 border border-cyan/30 rounded px-4 py-2 text-sm">
            <span className="text-navy font-medium">
              Showing: <span className="text-cyan">{selectedCategory}</span>
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-auto text-gray-400 hover:text-navy transition text-xs underline"
            >
              Clear filter
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* left news list */}
          <div className="flex-1 min-w-0 order-2 lg:order-none">
            {isLoading && (
              <div className="text-center py-20 text-gray-400">Loading news...</div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">No news found</div>
            )}

            <div className="space-y-10 lg:space-y-12">
              {filtered.map((item) => (
                <div key={item._id} className="border-b border-gray-100 pb-10 lg:pb-12">
                  {/* image */}
                  <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 rounded overflow-hidden mb-4">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                      : <div className="w-full h-full bg-bg-light flex items-center justify-center text-gray-400">No Image</div>
                    }
                  </div>

                  {/* meta */}
                  <div className="flex items-center gap-3 sm:gap-5 flex-wrap text-gray-400 text-xs mb-3">
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
                  <h2 className="text-navy font-bold text-lg sm:text-xl mb-3 hover:text-cyan transition">
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
          <div className="order-1 lg:order-none">
            <NewsSidebar
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default NewsList