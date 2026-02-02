import Image from "next/image"
import Link from "next/link"
import { Shield, Settings, User, TrendingUp, ArrowDown, Check, X } from "lucide-react"
import Logo from "./assets/images/GS_IMGLOGO_2026.svg"
import Section from "./components/Section"
import Divider from "./components/Divider"
import Wordmark from "./components/Wordmark"
import contentHelper from "./db/content-helper"

export default function HomePage() {
  // Get content using the helper
  const heroContent = contentHelper.getHeroContent();
  const servicesContent = contentHelper.getServicesContent();
  const whyGraceSoftContent = contentHelper.getWhyGraceSoftContent();
  const howItWorksContent = contentHelper.getHowItWorksContent();
  const qualificationContent = contentHelper.getQualificationContent();
  const aboutContent = contentHelper.getAboutContent();

  // Icon mapping for features
  const featureIcons = [Shield, Settings, User, TrendingUp]

  return (
    <div>
      <Section id="hero" variant="default" className="text-center">
        <Wordmark height={40} />
        <Divider />
        <p className="text-4xl font-light text-gray-800 mb-8">{heroContent.headline}</p>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">{heroContent.description}</p>
        <div className="flex items-center justify-center gap-4 mb-8">
            {heroContent.cta.primary && (
            <Link href="/contact" className="text-white bg-indigo-800 dark:text-black dark:bg-purple-500 font-semibold hover:opacity-70 px-4 py-2 rounded">{heroContent.cta.primary.label}</Link>
            )}
            {heroContent.cta.secondary && (
              <Link href="/services" className="text-indigo-800 dark:text-purple-500 font-semibold px-4 py-2 rounded hover:opacity-70">{heroContent.cta.secondary.label}</Link>
            )}
          </div>
      </Section>
      <Section id="services" variant="alt">
        <header className="flex items-end gap-2 mb-12 text-2xl">
          <h2 className="text-4xl font-semibold text-indigo-800">{servicesContent.title}</h2>
          <span>&middot;</span>
          <p>{servicesContent.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {servicesContent.items.map((service, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-800 text-white rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <p className="text-xl text-gray-700 leading-relaxed">{service}</p>
              </div>
            ))}
          </div>
          <ul className="list-disc ml-4 mb-8">
            {servicesContent.closingStatements.map((statement, index) => (
            <li key={index}>{statement}</li>
          ))}
          </ul>
      </Section>
      <Section id="why-gracesoft" variant="default">
        <header className="flex items-end gap-2 mb-12 text-2xl">
          <h2 className="text-4xl font-semibold text-indigo-800">{whyGraceSoftContent.title}</h2>
          <span>&middot;</span>
          <p>{whyGraceSoftContent.description}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyGraceSoftContent.features.map((feature, index) => {
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
      </Section>
      <Section id="how-it-works" variant="alt">
        <header className="flex items-end gap-2 mb-12 text-2xl">
          <h2 className="text-4xl font-semibold text-indigo-800">{howItWorksContent.title}</h2>
          <span>&middot;</span>
          <p>{howItWorksContent.description}</p>
        </header>
        <div className="max-w-2xl mx-auto">
            {howItWorksContent.steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-start gap-4 w-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < howItWorksContent.steps.length - 1 && (
                  <div className="flex justify-center w-full mb-6">
                    <ArrowDown size={24} className="text-indigo-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-gray-700 italic">{howItWorksContent.closingStatement}</p>
          </div>
      </Section>
      <Section id="who-its-for" variant="default">
        <header className="flex items-end gap-2 mb-12 text-2xl">
          <h2 className="text-4xl font-semibold text-indigo-800">{qualificationContent.title}</h2>
          <span>&middot;</span>
          <p>{qualificationContent.description}</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Good fit points */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Good fit points</h3>
            <ul className="space-y-4">
              {qualificationContent.goodFit.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bad fit points */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{qualificationContent.notAFit.title}</h3>
            <ul className="space-y-4">
              {qualificationContent.notAFit.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center mt-0.5">
                    <X size={12} />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section id="about" variant="highlighted">
        <header className="flex items-end gap-2 mb-12 text-2xl">
          <h2 className="text-4xl font-semibold text-indigo-800">{aboutContent.title}</h2>
          <span>&middot;</span>
          <p>{aboutContent.description}</p>
        </header>

        {aboutContent.body.map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
        ))}

        <p className="mb-8"><strong>{aboutContent.statement}</strong></p>

        <blockquote className="border-l-3 border-indigo-800 bg-indigo-100 dark:bg-indigo-900 rounded-sm p-4">
          <p className="italic text-gray-600">{aboutContent.quote.text}</p>
          <footer className="text-gray-500 mt-2">&ndash; {aboutContent.quote.source}</footer>
          <p className="text-gray-500"><small>{aboutContent.quote.note}</small></p>
        </blockquote>
      </Section>
    </div>
  );
}
