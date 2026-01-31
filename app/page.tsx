import Image from "next/image"
import Logo from "./assets/images/GS_IMGLOGO_2026.svg"
import contentHelper from "./db/content-helper"

export default function HomePage() {
  // Get content using the helper
  const heroContent = contentHelper.getHeroContent()
  const services = contentHelper.getServicesContent()
  const aboutContent = contentHelper.getAboutContent()

  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="hero flex flex-col items-center justify-center text-center">
        <div className="container mx-auto">
          <Image src={Logo} alt="Hero Logo" height={50} className="mx-auto mb-12" />
          <div className="w-24 h-1 bg-indigo-800 mx-auto mb-12"></div>

          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">{heroContent.headline}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">{heroContent.description}</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            {heroContent.cta.primary && (
            <a href="#contact" className="text-white bg-indigo-800 dark:text-black dark:bg-purple-500 font-semibold hover:opacity-70 px-4 py-2 rounded">{heroContent.cta.primary.label}</a>
            )}
            {heroContent.cta.secondary && (
              <a href="#services" className="text-indigo-800 dark:text-purple-500 font-semibold px-4 py-2 rounded hover:opacity-70">{heroContent.cta.secondary.label}</a>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services">
        <div className="flex items-end gap-2 mb-8 text-2xl">
          <h2 className="text-4xl font-semibold text-indigo-800">{services.title}</h2>
          <span>&middot;</span>
          <p>{services.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.items.map((service, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-800 text-white rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </div>
              <p className="text-xl text-gray-700 leading-relaxed">{service}</p>
            </div>
          ))}
        </div>
        <ul className="list-disc ml-4 mb-8">
          {services.closingStatements.map((statement, index) => (
          <li key={index}>{statement}</li>
        ))}
        </ul>
      </section>

      {/* About Section */}
      <section id="about">
        <h2>{aboutContent.title}</h2>
        {aboutContent.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <blockquote>
          <p><q>{aboutContent.quote.text}</q></p>
          <cite>— {aboutContent.quote.source}</cite>
          {aboutContent.quote.note && <small>{aboutContent.quote.note}</small>}
        </blockquote>
      </section>
    </div>
  );
}
