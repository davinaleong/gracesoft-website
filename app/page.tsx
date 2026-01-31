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
        <Image src={Logo} alt="Hero Logo" height={50} className="mb-12" />
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
      </section>

      {/* Services Section */}
      <section id="services">
        <h2>{services.title}</h2>
        <ul>
          {services.items.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
        {services.closingStatements.map((statement, index) => (
          <p key={index}>{statement}</p>
        ))}
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
