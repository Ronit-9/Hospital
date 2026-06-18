import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useGetAllNewsQuery } from '../../store/api/newsApi'

const NewsSidebar = ({ search, setSearch }) => {
  const { data: newsData } = useGetAllNewsQuery()
  const news = newsData?.data || []
  const recentPosts = news.slice(0, 5)

  return (
    <div className="w-72 flex-shrink-0 space-y-8">

      {/* search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-3 border border-gray-200 text-sm outline-none focus:border-cyan transition"
        />
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      </div>

      {/* recent posts */}
      <div>
        <h3 className="text-navy font-bold text-lg mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((item) => (
            <Link
              to={`/news/${item._id}`}
              key={item._id}
              className="flex gap-3 group"
            >
              <div className="w-16 h-14 flex-shrink-0 bg-gray-200 overflow-hidden rounded">
                {item.image
                  ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-navy/20" />
                }
              </div>
              <div>
                <p className="text-cyan text-xs mb-1">
                  {new Date(item.publishedAt).toLocaleDateString('en-US', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-navy text-xs font-medium group-hover:text-cyan transition line-clamp-2">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* categories */}
      <div>
        <h3 className="text-navy font-bold text-lg mb-4">Categories</h3>
        <div className="space-y-2">
          {['Surgery', 'Health Care', 'Medical', 'Professional'].map((cat, i) => (
            <div
              key={cat}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <span className="text-gray-600 text-sm hover:text-cyan cursor-pointer transition">{cat}</span>
              <span className="w-6 h-6 rounded-full bg-cyan text-white text-xs flex items-center justify-center">
                {[3, 4, 2, 10][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewsSidebar