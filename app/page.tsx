import Image from "next/image"
import Link from "next/link"
import { Shield, Settings, User, TrendingUp } from "lucide-react"
import Logo from "./assets/images/GS_IMGLOGO_2026.svg"
import contentHelper from "./db/content-helper"

export default function HomePage() {
  // Get content using the helper
  const heroContent = contentHelper.getHeroContent()
  const services = contentHelper.getServicesContent()
  const whyContent = contentHelper.getWhyGraceSoftContent()
  const howContent = contentHelper.getHowItWorksContent()
  const whoContent = contentHelper.getQualificationContent()

  // Icon mapping for features
  const featureIcons = [Shield, Settings, User, TrendingUp]

  return (
    <div>
      {/* Hero Section */}
      <section id="hero">
        <div className="container mx-auto flex flex-col items-center justify-center text-center py-12 px-4">
          <Image src={Logo} alt="Hero Logo" height={40} className="mx-auto mb-12" />
          <div className="w-24 h-1 bg-indigo-800 mx-auto mb-12"></div>

          <h1 className="text-4xl font-light text-gray-800 mb-8">{heroContent.headline}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">{heroContent.description}</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            {heroContent.cta.primary && (
            <Link href="/contact" className="text-white bg-indigo-800 dark:text-black dark:bg-purple-500 font-semibold hover:opacity-70 px-4 py-2 rounded">{heroContent.cta.primary.label}</Link>
            )}
            {heroContent.cta.secondary && (
              <Link href="/services" className="text-indigo-800 dark:text-purple-500 font-semibold px-4 py-2 rounded hover:opacity-70">{heroContent.cta.secondary.label}</Link>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-end gap-2 mb-12 text-2xl">
            <h2 className="text-4xl font-semibold text-indigo-800">{services.title}</h2>
            <span>&middot;</span>
            <p>{services.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
        </div>
      </section>

      {/* Why GraceSoft Section */}
      <section id="why_gracesoft">
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-end gap-2 mb-12 text-2xl">
            <h2 className="text-4xl font-semibold text-indigo-800">{whyContent.title}</h2>
            <span>&middot;</span>
            <p>{whyContent.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyContent.features.map((feature, index) => {
              const IconComponent = featureIcons[index]
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-800 text-white rounded-full flex items-center justify-center">
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
