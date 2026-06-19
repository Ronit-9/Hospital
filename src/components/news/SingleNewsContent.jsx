import { useParams, Link, useNavigate } from 'react-router-dom'
import { MdCalendarMonth, MdArrowBack, MdArrowForward } from 'react-icons/md'
import { FaUser, FaEye, FaHeart } from 'react-icons/fa'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetNewsQuery, useGetAllNewsQuery, useLikeNewsMutation } from '../../store/api/newsApi'
import NewsSidebar from './NewsSidebar'
import newsBanner from '../../assets/news.jpg'

const SingleNewsContent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const [search, setSearch] = useState('')

  const { data: newsData, isLoading } = useGetNewsQuery(id)
  const { data: allNewsData } = useGetAllNewsQuery()
  const [likeNews] = useLikeNewsMutation()

  const news = newsData?.data
  const allNews = allNewsData?.data || []
  const currentIndex = allNews.findIndex((n) => n._id === id)
  const prevNews = currentIndex > 0 ? allNews[currentIndex - 1] : null
  const nextNews = currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null

  const handleLike = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    await likeNews(id)
  }

  if (isLoading) {
    return <div className="py-20 text-center text-gray-400">Loading...</div>
  }

  return (
    <>
      {/* banner */}
      <section
        className="relative h-56 sm:h-64 md:h-72 flex items-end overflow-hidden"
        style={{
          backgroundImage: news?.image ? `url(${news.image})` : `url(${newsBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pb-6 sm:pb-8">
          <div className="flex items-center gap-2 flex-wrap text-gray-300 text-xs sm:text-sm mb-2">
            <Link to="/" className="hover:text-cyan transition">Home</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-cyan transition">News</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{news?.title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl">
            {news?.title}
          </h1>
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap text-gray-300 text-xs">
            <span className="flex items-center gap-1">
              <MdCalendarMonth />
              {news && new Date(news.publishedAt).toLocaleDateString('en-US', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <FaUser /> By {news?.author?.name}
            </span>
            <span className="flex items-center gap-1"><FaEye /> {news?.views}</span>
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-red-400 transition"
            >
              <FaHeart /> {news?.likes}
            </button>
          </div>
        </div>
      </section>

      {/* content */}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* left article */}
          <div className="flex-1 order-2 lg:order-none">
            {/* featured image */}
            {news?.image && (
              <div className="h-48 sm:h-60 lg:h-72 bg-gray-200 rounded overflow-hidden mb-6 lg:mb-8">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* content */}
            <div className="prose prose-sm max-w-none text-gray-500 leading-relaxed text-sm">
              {news?.content?.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>

            {/* prev / next */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-10 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-100">
              {prevNews ? (
                <Link
                  to={`/news/${prevNews._id}`}
                  className="flex items-center justify-center gap-2 border border-navy text-navy px-5 py-2 rounded-full text-sm hover:bg-navy hover:text-white transition"
                >
                  <MdArrowBack /> Previous Article
                </Link>
              ) : <div />}

              {nextNews ? (
                <Link
                  to={`/news/${nextNews._id}`}
                  className="flex items-center justify-center gap-2 border border-navy text-navy px-5 py-2 rounded-full text-sm hover:bg-navy hover:text-white transition"
                >
                  Next Article <MdArrowForward />
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* right sidebar */}
          <div className="order-1 lg:order-none">
            <NewsSidebar search={search} setSearch={setSearch} />
          </div>
        </div>
      </section>
    </>
  )
}

export default SingleNewsContent