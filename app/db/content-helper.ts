import data from './data.json';

// Type definitions for the JSON structure
export interface Logo {
  text: string;
  variant: 'icon_wordmark' | 'full';
  size: 'small' | 'large';
  position?: string;
  style?: string;
  note?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface CTAButton {
  label: string;
  action: string;
  target?: string;
}

export interface CTA {
  primary?: CTAButton;
  secondary?: CTAButton;
}

export interface Feature {
  title: string;
  description: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ContactDetails {
  email: string;
  location: string;
}

export interface Quote {
  text: string;
  source: string;
  note?: string;
}

// Content Helper Class
export class ContentHelper {
  private data = data;

  // Meta information
  getPageTitle(): string {
    return this.data.meta.title;
  }

  getPageDescription(): string {
    return this.data.meta.description;
  }

  // Header/Navigation
  getNavigation(): NavigationItem[] {
    return this.data.sections.header.navigation;
  }

  getHeaderLogo(): Logo {
    return this.data.sections.header.logo;
  }

  // Hero Section
  getHeroContent() {
    const hero = this.data.sections.hero;
    return {
      logo: hero.logo,
      headline: hero.headline,
      description: hero.description,
      cta: hero.cta
    };
  }

  getHeroHeadline(): string {
    return this.data.sections.hero.headline;
  }

  getHeroDescription(): string {
    return this.data.sections.hero.description;
  }

  getHeroCTA(): CTA {
    return this.data.sections.hero.cta;
  }

  // Services Section
  getServicesContent() {
    const services = this.data.sections.services;
    return {
      title: services.title,
      description: services.description,
      items: services.items,
      closingStatements: services.closing_statements
    };
  }

  getServicesList(): string[] {
    return this.data.sections.services.items;
  }

  getServicesDescription(): string {
    return this.data.sections.services.description;
  }

  getWhyGraceSoftDescription(): string {
    return this.data.sections.why_gracesoft.description;
  }

  getHowItWorksDescription(): string {
    return this.data.sections.how_it_works.description;
  }

  getQualificationDescription(): string {
    return this.data.sections.who_its_for.description;
  }

  // Why GraceSoft
  getWhyGraceSoftFeatures(): Feature[] {
    return this.data.sections.why_gracesoft.items;
  }

  getWhyGraceSoftContent() {
    const section = this.data.sections.why_gracesoft;
    return {
      title: section.title,
      description: section.description,
      features: section.items
    };
  }

  // How It Works Process
  getProcessSteps(): ProcessStep[] {
    return this.data.sections.how_it_works.steps;
  }

  getHowItWorksContent() {
    const section = this.data.sections.how_it_works;
    return {
      title: section.title,
      description: section.description,
      steps: section.steps,
      closingStatement: section.closing_statement
    };
  }

  // Who It's For
  getQualificationContent() {
    const section = this.data.sections.who_its_for;
    return {
      title: section.title,
      description: section.description,
      goodFit: section.good_fit,
      notAFit: {
        title: section.not_a_fit.title,
        items: section.not_a_fit.items
      }
    };
  }

  // About Section
  getAboutContent() {
    const about = this.data.sections.about;
    return {
      title: about.title,
      body: about.body,
      statement: about.statement,
      quote: about.quote
    };
  }

  getAboutQuote(): Quote {
    return this.data.sections.about.quote;
  }

  // Contact Section
  getContactContent() {
    const contact = this.data.sections.contact;
    return {
      title: contact.title,
      description: contact.description,
      contactDetails: contact.contact_details,
      cta: contact.cta
    };
  }

  getContactDetails(): ContactDetails {
    return this.data.sections.contact.contact_details;
  }

  // Footer
  getFooterContent() {
    const footer = this.data.sections.footer;
    return {
      logo: footer.logo,
      copyright: footer.copyright,
      tagline: footer.tagline
    };
  }

  // Utility methods for getting sections by ID
  getSectionById(id: string) {
    const sections = this.data.sections;
    
    switch (id) {
      case 'services':
        return sections.services;
      case 'how-it-works':
        return sections.how_it_works;
      case 'about':
        return sections.about;
      case 'contact':
        return sections.contact;
      default:
        return null;
    }
  }

  // Get all sections for iteration
  getAllSections() {
    return this.data.sections;
  }

  // Check if section exists
  hasSection(sectionName: string): boolean {
    return sectionName in this.data.sections;
  }
}

// Create and export a singleton instance
export const contentHelper = new ContentHelper();

// Export default instance for easier importing
export default contentHelper;