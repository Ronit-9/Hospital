import { Link } from 'react-router-dom'
import { MdArrowForward } from 'react-icons/md'

const WelcomeSection = () => {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
          Welcome to Meddical
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-navy font-serif mb-4">
          A Great Place to Receive Care
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat
          scelerisque tortor ornare ornare. Convallis felis vitae tortor augue. Velit
          nascetur proin massa in. Consequat faucibus porttitor enim et.
        </p>
        <Link
          to="/about"
          className="text-cyan text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all"
        >
          Learn More <MdArrowForward />
        </Link>
      </div>
    </section>
  )
}

export default WelcomeSection