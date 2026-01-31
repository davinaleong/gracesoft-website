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
  href?: string;
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

export interface Section {
  id?: string;
  type: string;
  title?: string;
  description?: string;
  content?: any;
}

export interface PageData {
  page: string;
  meta: {
    title: string;
    description: string;
  };
  sections: Record<string, Section>;
}

// Content Helper Class
export class ContentHelper {
  private data = data;

  // Page Management
  getPage(pageName: 'home' | 'about' | 'contact'): PageData {
    return this.data.pages[pageName];
  }

  getPageMeta(pageName: 'home' | 'about' | 'contact') {
    return this.data.pages[pageName].meta;
  }

  getPageSections(pageName: 'home' | 'about' | 'contact') {
    return this.data.pages[pageName].sections;
  }

  // Section Management - Works for any page
  getSection(pageName: 'home' | 'about' | 'contact', sectionName: string) {
    return this.data.pages[pageName].sections[sectionName];
  }

  getSectionContent(pageName: 'home' | 'about' | 'contact', sectionName: string) {
    const section = this.getSection(pageName, sectionName);
    return section?.content;
  }

  // Navigation (works for any page)
  getNavigation(pageName: 'home' | 'about' | 'contact' = 'home'): NavigationItem[] {
    return this.data.pages[pageName].sections.header.navigation;
  }

  getHeaderLogo(pageName: 'home' | 'about' | 'contact' = 'home'): Logo {
    return this.data.pages[pageName].sections.header.logo;
  }

  // Home Page Specific Methods
  getHeroContent() {
    const hero = this.data.pages.home.sections.hero;
    return {
      title: hero.title,
      description: hero.description,
      ...hero.content
    };
  }

  getServicesContent() {
    const services = this.data.pages.home.sections.services;
    return {
      id: services.id,
      title: services.title,
      description: services.description,
      items: services.content.items,
      closingStatements: services.content.closing_statements
    };
  }

  getWhyGraceSoftContent() {
    const section = this.data.pages.home.sections.why_gracesoft;
    return {
      id: section.id,
      title: section.title,
      description: section.description,
      features: section.content.features
    };
  }

  getHowItWorksContent() {
    const section = this.data.pages.home.sections.how_it_works;
    return {
      id: section.id,
      title: section.title,
      description: section.description,
      steps: section.content.steps,
      closingStatement: section.content.closing_statement
    };
  }

  getQualificationContent() {
    const section = this.data.pages.home.sections.who_its_for;
    return {
      id: section.id,
      title: section.title,
      description: section.description,
      goodFit: section.content.good_fit,
      notAFit: {
        title: section.content.not_a_fit.title,
        items: section.content.not_a_fit.items
      }
    };
  }

  // About Page Specific Methods
  getAboutContent() {
    const about = this.data.pages.about.sections.about;
    return {
      title: about.title,
      description: about.description,
      body: about.content.body,
      statement: about.content.statement,
      quote: about.content.quote
    };
  }

  // Contact Page Specific Methods
  getContactContent() {
    const contact = this.data.pages.contact.sections.contact;
    return {
      title: contact.title,
      description: contact.description,
      contactDetails: contact.content.contact_details,
      cta: contact.content.cta
    };
  }

  // Footer (works for any page)
  getFooterContent(pageName: 'home' | 'about' | 'contact' = 'home') {
    return this.data.pages[pageName].sections.footer.content;
  }

  // Utility Methods
  getAllPages() {
    return Object.keys(this.data.pages);
  }

  hasPage(pageName: string): boolean {
    return pageName in this.data.pages;
  }

  hasSection(pageName: 'home' | 'about' | 'contact', sectionName: string): boolean {
    return sectionName in this.data.pages[pageName].sections;
  }

  // Legacy Methods for Backward Compatibility
  getPageTitle(): string {
    return this.getPageMeta('home').title;
  }

  getPageDescription(): string {
    return this.getPageMeta('home').description;
  }

  getServicesList(): string[] {
    return this.getServicesContent().items;
  }

  getWhyGraceSoftFeatures(): Feature[] {
    return this.getWhyGraceSoftContent().features;
  }

  getProcessSteps(): ProcessStep[] {
    return this.getHowItWorksContent().steps;
  }

  getContactDetails(): ContactDetails {
    return this.getContactContent().contactDetails;
  }

  getAboutQuote(): Quote {
    return this.getAboutContent().quote;
  }
}

// Create and export a singleton instance
export const contentHelper = new ContentHelper();

// Export default instance for easier importing
export default contentHelper;