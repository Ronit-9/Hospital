import aboutBanner from '../../assets/about-banner.jpg.png'

const AboutBanner = () => {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* background image with colored bar at bottom */}
        <div
          className="relative w-full h-52 sm:h-72 md:h-96 rounded-sm bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutBanner})` }}
        >
          {/* colored bar at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
            <div className="flex-1 bg-navy" />
            <div className="w-32 bg-cyan" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutBanner