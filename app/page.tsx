import Image from "next/image"
import Logo from "./assets/images/GS_IMGLOGO_2026.svg"
import contentHelper from "./db/content-helper"

export default function HomePage() {
  // Get content using the helper
  const navigation = contentHelper.getNavigation()
  const heroContent = contentHelper.getHeroContent()
  const services = contentHelper.getServicesContent()
  const aboutContent = contentHelper.getAboutContent()

  return (
    <div>
      <nav className="flex items-center justify-between gap-4 p-4">
        <Image src={Logo} alt="GraceSoft Logo" height={20} />

        <ul className="flex justify-end gap-4 text-sm font-medium">
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-indigo-900 hover:text-indigo-700">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>{heroContent.headline}</h1>
        <p>{heroContent.description}</p>
        {heroContent.cta.primary && (
          <button>{heroContent.cta.primary.label}</button>
        )}
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
