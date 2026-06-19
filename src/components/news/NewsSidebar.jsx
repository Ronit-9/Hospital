import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useGetAllNewsQuery } from '../../store/api/newsApi'

const NewsSidebar = ({ search, setSearch, onCategorySelect, selectedCategory }) => {
  const { data: newsData } = useGetAllNewsQuery()
  const news = newsData?.data || []
  const recentPosts = news.slice(0, 5)

  const categories = Object.values(
    news.reduce((acc, item) => {
      const key = item.title
      if (!acc[key]) acc[key] = { title: key, count: 0 }
      acc[key].count++
      return acc
    }, {})
  )

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-8">

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-3 border border-gray-200 text-sm outline-none focus:border-cyan transition rounded-sm"
        />
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-navy font-bold text-lg mb-4 pb-2 border-b-2 border-cyan inline-block">
          Recent Posts
        </h3>
        <div className="space-y-4 mt-2">
          {recentPosts.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent posts.</p>
          ) : (
            recentPosts.map((item) => (
              <Link
                to={`/news/${item._id}`}
                key={item._id}
                className="flex gap-3 group"
              >
                <div className="w-16 h-14 flex-shrink-0 bg-gray-200 overflow-hidden rounded">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy/20 flex items-center justify-center">
                      <span className="text-navy/40 text-xs">No img</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-cyan text-xs mb-1">
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-navy text-xs font-medium group-hover:text-cyan transition line-clamp-2 leading-relaxed">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-navy font-bold text-lg mb-4 pb-2 border-b-2 border-cyan inline-block">
          Categories
        </h3>
        <div className="space-y-1 mt-2">
          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm">No categories found.</p>
          ) : (
            categories.map((cat) => {
              const isActive = selectedCategory === cat.title
              return (
                <div
                  key={cat.title}
                  onClick={() => onCategorySelect(isActive ? null : cat.title)}
                  className={`flex items-center justify-between py-2 px-2 border-b border-gray-100 cursor-pointer group rounded-sm transition-colors duration-200 ${isActive ? 'bg-cyan/10' : 'hover:bg-gray-50'
                    }`}
                >
                  <span
                    className={`text-sm transition truncate mr-3 ${isActive
                        ? 'text-cyan font-semibold'
                        : 'text-gray-600 group-hover:text-cyan'
                      }`}
                  >
                    {cat.title}
                  </span>
                  <span
                    className={`w-6 h-6 min-w-[1.5rem] rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${isActive ? 'bg-navy' : 'bg-cyan'
                      }`}
                  >
                    {cat.count}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

    </aside>
  )
}

export default NewsSidebar