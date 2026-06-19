import AboutImage from '../../assets/about2.jpg'


const features = [
  'A Passion for Healing', '5-Star Care',
  'All our best', 'Believe in Us',
  'Always Caring', 'A Legacy of Excellence',
]

const AboutContent = () => {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* left image */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <img
              src={AboutImage}
              alt="About us"
              className="w-full h-56 sm:h-72 lg:h-80 object-cover rounded-lg"
            />
          </div>

          {/* right content */}
          <div className="flex-1">
            <p className="text-cyan text-sm font-semibold tracking-widest uppercase mb-2">
              Welcome to Hospital Name
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-serif mb-6">
              Best Care for Your Good Health
            </h2>

            {/* bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              placerat scelerisque tortor ornare ornare. Quisque placerat
              scelerisque tortor ornare ornare Convallis felis vitae tortor
              augue. Velit nascetur proin massa in. Consequat faucibus
              porttitor enim et.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              placerat scelerisque. Convallis felis vitae tortor augue. Velit
              nascetur proin massa in.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutContent