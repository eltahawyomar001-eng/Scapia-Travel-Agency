/**
 * SCAPIA Content Loader
 * Loads content from CMS JSON files and populates HTML elements
 */

class ContentLoader {
  constructor() {
    this.contentCache = {};
    this.basePath = '/content/settings/';
  }

  /**
   * Fetch JSON content from a file
   * @param {string} filename - The JSON file to load (without path)
   * @returns {Promise<Object>} - The parsed JSON content
   */
  async loadContent(filename) {
    if (this.contentCache[filename]) {
      return this.contentCache[filename];
    }

    try {
      const response = await fetch(`${this.basePath}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      const content = await response.json();
      this.contentCache[filename] = content;
      return content;
    } catch (error) {
      console.error(`Error loading content from ${filename}:`, error);
      return null;
    }
  }

  /**
   * Load all settings files
   * @returns {Promise<Object>} - Object containing all content
   */
  async loadAllSettings() {
    const files = ['global.json', 'homepage.json', 'about.json', 'trips-page.json', 'contact.json', 'trip-details.json', 'seo.json'];
    const content = {};

    await Promise.all(files.map(async (file) => {
      const key = file.replace('.json', '');
      content[key] = await this.loadContent(file);
    }));

    return content;
  }

  /**
   * Populate element with text content
   * @param {string} selector - CSS selector
   * @param {string} content - Text content to set
   */
  setText(selector, content) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el && content) el.textContent = content;
    });
  }

  /**
   * Populate element with HTML content
   * @param {string} selector - CSS selector
   * @param {string} content - HTML content to set
   */
  setHTML(selector, content) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el && content) el.innerHTML = content;
    });
  }

  /**
   * Set attribute on elements
   * @param {string} selector - CSS selector
   * @param {string} attr - Attribute name
   * @param {string} value - Attribute value
   */
  setAttribute(selector, attr, value) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el && value) el.setAttribute(attr, value);
    });
  }

  /**
   * Set background image style
   * @param {string} selector - CSS selector
   * @param {string} imageUrl - Image URL
   */
  setBackgroundImage(selector, imageUrl) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el && imageUrl) el.style.backgroundImage = `url(${imageUrl})`;
    });
  }

  /**
   * Populate navigation from global settings
   * @param {Object} global - Global settings object
   */
  populateNavigation(global) {
    if (!global || !global.navigation) return;

    const nav = global.navigation;
    
    // Set logo text
    this.setText('[data-content="nav-logo"]', nav.logo);
    
    // Set language button
    this.setText('[data-content="nav-lang"]', nav.langButton);

    // Populate nav links
    const navMenu = document.querySelector('[data-content="nav-menu"]');
    if (navMenu && nav.links) {
      navMenu.innerHTML = nav.links.map(link => `
        <a href="${link.url}" class="nav__link">${link.label}</a>
      `).join('');
    }
  }

  /**
   * Populate footer from global settings
   * @param {Object} global - Global settings object
   */
  populateFooter(global) {
    if (!global || !global.footer) return;

    const footer = global.footer;
    
    this.setText('[data-content="footer-description"]', footer.description);
    this.setText('[data-content="footer-address"]', footer.address);
    this.setText('[data-content="footer-phone"]', footer.phone);
    this.setText('[data-content="footer-email"]', footer.email);
    this.setText('[data-content="footer-newsletter-text"]', footer.newsletterText);
    this.setText('[data-content="footer-newsletter-btn"]', footer.newsletterButton);
    this.setText('[data-content="footer-copyright"]', footer.copyright);

    // Set href attributes for contact links
    this.setAttribute('[data-content="footer-phone-link"]', 'href', `tel:${footer.phone}`);
    this.setAttribute('[data-content="footer-email-link"]', 'href', `mailto:${footer.email}`);

    // Populate quick links
    const quickLinksContainer = document.querySelector('[data-content="footer-quick-links"]');
    if (quickLinksContainer && footer.quickLinks) {
      quickLinksContainer.innerHTML = footer.quickLinks.map(link => `
        <li><a href="${link.url}" class="footer__link">${link.label}</a></li>
      `).join('');
    }

    // Populate social links
    const socialContainer = document.querySelector('[data-content="footer-social-links"]');
    if (socialContainer && footer.socialLinks) {
      socialContainer.innerHTML = footer.socialLinks.map(link => `
        <a href="${link.url}" class="footer__social-link" target="_blank" rel="noopener noreferrer" title="${link.platform}">${link.abbr}</a>
      `).join('');
    }
  }

  /**
   * Populate CTA section from global settings
   * @param {Object} global - Global settings object
   */
  populateCTA(global) {
    if (!global || !global.cta) return;

    const cta = global.cta;
    
    this.setText('[data-content="cta-title"]', cta.title);
    this.setText('[data-content="cta-description"]', cta.description);
    this.setText('[data-content="cta-button"]', cta.buttonText);
    this.setAttribute('[data-content="cta-button"]', 'href', cta.buttonUrl);
    this.setBackgroundImage('[data-content="cta-section"]', cta.backgroundImage);
  }

  /**
   * Populate homepage content
   * @param {Object} homepage - Homepage settings object
   */
  populateHomepage(homepage) {
    if (!homepage) return;

    // Hero section
    if (homepage.hero) {
      const hero = homepage.hero;
      this.setText('[data-content="hero-title"]', hero.title);
      this.setText('[data-content="hero-description"]', hero.description);
      this.setText('[data-content="hero-button"]', hero.buttonText);
      this.setAttribute('[data-content="hero-button"]', 'href', hero.buttonUrl);
      this.setBackgroundImage('[data-content="hero-section"]', hero.backgroundImage);

      // Hero stats
      const statsContainer = document.querySelector('[data-content="hero-stats"]');
      if (statsContainer && hero.stats) {
        statsContainer.innerHTML = hero.stats.map(stat => `
          <div class="stat">
            <span class="stat__number">${stat.number}</span>
            <span class="stat__label">${stat.label}</span>
          </div>
        `).join('');
      }
    }

    // Services section
    if (homepage.services) {
      const services = homepage.services;
      this.setText('[data-content="services-title"]', services.title);
      this.setText('[data-content="services-subtitle"]', services.subtitle);

      const cardsContainer = document.querySelector('[data-content="services-cards"]');
      if (cardsContainer && services.cards) {
        cardsContainer.innerHTML = services.cards.map(card => `
          <div class="service-card">
            <div class="service-card__icon">${card.icon}</div>
            <h3 class="service-card__title">${card.title}</h3>
            <p class="service-card__description">${card.description}</p>
          </div>
        `).join('');
      }
    }

    // Featured trips section
    if (homepage.featuredTrips) {
      const featured = homepage.featuredTrips;
      this.setText('[data-content="featured-title"]', featured.title);
      this.setText('[data-content="featured-subtitle"]', featured.subtitle);
      this.setText('[data-content="featured-view-all"]', featured.viewAllText);
      this.setAttribute('[data-content="featured-view-all"]', 'href', featured.viewAllUrl);
    }

    // Gallery section
    if (homepage.gallery) {
      const gallery = homepage.gallery;
      this.setText('[data-content="gallery-title"]', gallery.title);
      this.setText('[data-content="gallery-subtitle"]', gallery.subtitle);

      const galleryContainer = document.querySelector('[data-content="gallery-images"]');
      if (galleryContainer && gallery.images) {
        galleryContainer.innerHTML = gallery.images.map(img => `
          <div class="gallery__item">
            <img src="${img.image}" alt="${img.alt}" class="gallery__image" loading="lazy">
            <span class="gallery__location">${img.location}</span>
          </div>
        `).join('');
      }
    }

    // Why Choose section
    if (homepage.whyChoose) {
      const why = homepage.whyChoose;
      this.setText('[data-content="why-title"]', why.title);
      this.setText('[data-content="why-subtitle"]', why.subtitle);

      const cardsContainer = document.querySelector('[data-content="why-cards"]');
      if (cardsContainer && why.cards) {
        cardsContainer.innerHTML = why.cards.map(card => `
          <div class="value-card">
            <div class="value-card__icon">${card.icon}</div>
            <h3 class="value-card__title">${card.title}</h3>
            <p class="value-card__description">${card.description}</p>
          </div>
        `).join('');
      }
    }

    // Testimonials section
    if (homepage.testimonials) {
      const testimonials = homepage.testimonials;
      this.setText('[data-content="testimonials-title"]', testimonials.title);
      this.setText('[data-content="testimonials-subtitle"]', testimonials.subtitle);

      const testimonialsContainer = document.querySelector('[data-content="testimonials-items"]');
      if (testimonialsContainer && testimonials.items) {
        testimonialsContainer.innerHTML = testimonials.items.map(item => `
          <div class="testimonial-card">
            <div class="testimonial-card__rating">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>
            <blockquote class="testimonial-card__quote">"${item.quote}"</blockquote>
            <div class="testimonial-card__author">
              ${item.image ? `<img src="${item.image}" alt="${item.author}" class="testimonial-card__image" loading="lazy">` : ''}
              <div class="testimonial-card__info">
                <span class="testimonial-card__name">${item.author}</span>
                <span class="testimonial-card__role">${item.role}</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  /**
   * Populate about page content
   * @param {Object} about - About page settings object
   */
  populateAboutPage(about) {
    if (!about) return;

    // Hero section
    if (about.hero) {
      const hero = about.hero;
      this.setText('[data-content="about-hero-title"]', hero.title);
      this.setText('[data-content="about-hero-description"]', hero.description);

      const imagesContainer = document.querySelector('[data-content="about-hero-images"]');
      if (imagesContainer && hero.images) {
        imagesContainer.innerHTML = hero.images.map((img, i) => `
          <img src="${img}" alt="About SCAPIA ${i + 1}" class="about-hero__image" loading="lazy">
        `).join('');
      }
    }

    // Collective section
    if (about.collective) {
      const collective = about.collective;
      this.setText('[data-content="collective-title"]', collective.title);
      this.setText('[data-content="collective-description"]', collective.description);

      const statsContainer = document.querySelector('[data-content="collective-stats"]');
      if (statsContainer && collective.stats) {
        statsContainer.innerHTML = collective.stats.map(stat => `
          <div class="stat">
            <span class="stat__number">${stat.number}</span>
            <span class="stat__label">${stat.label}</span>
          </div>
        `).join('');
      }
    }

    // Partners section
    const partnersContainer = document.querySelector('[data-content="partners"]');
    if (partnersContainer && about.partners) {
      partnersContainer.innerHTML = about.partners.map(partner => `
        <div class="partner">
          ${partner.logo ? `<img src="${partner.logo}" alt="${partner.name}" class="partner__logo" loading="lazy">` : `<span class="partner__name">${partner.name}</span>`}
        </div>
      `).join('');
    }

    // Story timeline section
    if (about.storyTimeline) {
      const story = about.storyTimeline;
      this.setText('[data-content="story-title"]', story.title);

      const imagesContainer = document.querySelector('[data-content="story-images"]');
      if (imagesContainer && story.images) {
        imagesContainer.innerHTML = story.images.map((img, i) => `
          <img src="${img}" alt="Our story ${i + 1}" class="story__image" loading="lazy">
        `).join('');
      }

      const timelineContainer = document.querySelector('[data-content="story-timeline"]');
      if (timelineContainer && story.items) {
        timelineContainer.innerHTML = story.items.map(item => `
          <div class="timeline__item">
            <span class="timeline__year">${item.year}</span>
            <p class="timeline__description">${item.description}</p>
          </div>
        `).join('');
      }
    }

    // Why Choose section
    if (about.whyChoose) {
      const why = about.whyChoose;
      this.setText('[data-content="about-why-title"]', why.title);
      this.setText('[data-content="about-why-subtitle"]', why.subtitle);

      const cardsContainer = document.querySelector('[data-content="about-why-cards"]');
      if (cardsContainer && why.cards) {
        cardsContainer.innerHTML = why.cards.map(card => `
          <div class="value-card">
            <div class="value-card__icon">${card.icon}</div>
            <h3 class="value-card__title">${card.title}</h3>
          </div>
        `).join('');
      }
    }

    // Team section
    if (about.team) {
      const team = about.team;
      this.setText('[data-content="team-title"]', team.title);
      this.setText('[data-content="team-subtitle"]', team.subtitle);

      const teamContainer = document.querySelector('[data-content="team-members"]');
      if (teamContainer && team.members) {
        teamContainer.innerHTML = team.members.map(member => `
          <div class="team-card">
            <img src="${member.image}" alt="${member.name}" class="team-card__image" loading="lazy">
            <h3 class="team-card__name">${member.name}</h3>
            <p class="team-card__role">${member.role}</p>
            ${member.social ? `
              <div class="team-card__social">
                ${member.social.facebook ? `<a href="${member.social.facebook}" target="_blank" rel="noopener">Fb</a>` : ''}
                ${member.social.linkedin ? `<a href="${member.social.linkedin}" target="_blank" rel="noopener">Li</a>` : ''}
                ${member.social.instagram ? `<a href="${member.social.instagram}" target="_blank" rel="noopener">Ig</a>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('');
      }
    }
  }

  /**
   * Populate contact page content
   * @param {Object} contact - Contact page settings object
   */
  populateContactPage(contact) {
    if (!contact) return;

    // Hero section
    if (contact.hero) {
      const hero = contact.hero;
      this.setText('[data-content="contact-hero-title"]', hero.title);
      this.setText('[data-content="contact-hero-description"]', hero.description);

      // Contact info
      const infoContainer = document.querySelector('[data-content="contact-info"]');
      if (infoContainer && hero.contactInfo) {
        infoContainer.innerHTML = hero.contactInfo.map(info => {
          let href = info.value;
          if (info.type === 'email') href = `mailto:${info.value}`;
          if (info.type === 'phone') href = `tel:${info.value}`;
          
          return `
            <div class="contact-info__item">
              <span class="contact-info__label">${info.label}</span>
              ${info.type !== 'address' ? `<a href="${href}" class="contact-info__value">${info.value}</a>` : `<span class="contact-info__value">${info.value}</span>`}
            </div>
          `;
        }).join('');
      }

      // Social links
      const socialContainer = document.querySelector('[data-content="contact-social"]');
      if (socialContainer && hero.socialLinks) {
        socialContainer.innerHTML = hero.socialLinks.map(link => `
          <a href="${link.url}" class="social-link" target="_blank" rel="noopener noreferrer" title="${link.platform}">${link.abbr}</a>
        `).join('');
      }
    }

    // Form section
    if (contact.form) {
      const form = contact.form;
      this.setText('[data-content="form-title"]', form.title);
      this.setText('[data-content="form-submit"]', form.submitText);
    }

    // FAQ section
    if (contact.faq) {
      const faq = contact.faq;
      this.setText('[data-content="faq-title"]', faq.title);

      const faqContainer = document.querySelector('[data-content="faq-items"]');
      if (faqContainer && faq.questions) {
        faqContainer.innerHTML = faq.questions.map((item, i) => `
          <div class="faq-item">
            <button class="faq-item__question" aria-expanded="false" aria-controls="faq-answer-${i}">
              ${item.question}
              <span class="faq-item__icon">+</span>
            </button>
            <div id="faq-answer-${i}" class="faq-item__answer">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('');

        // Add FAQ toggle functionality
        faqContainer.querySelectorAll('.faq-item__question').forEach(button => {
          button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !expanded);
            button.closest('.faq-item').classList.toggle('active');
          });
        });
      }
    }
  }

  /**
   * Populate trips page content
   * @param {Object} tripsPage - Trips page settings object
   */
  populateTripsPage(tripsPage) {
    if (!tripsPage) return;

    // Hero section
    if (tripsPage.hero) {
      const hero = tripsPage.hero;
      this.setText('[data-content="trips-hero-title"]', hero.title);
      this.setText('[data-content="trips-hero-description"]', hero.description);
      this.setBackgroundImage('[data-content="trips-hero-section"]', hero.image);
    }

    // Categories section
    if (tripsPage.categories) {
      const categories = tripsPage.categories;
      this.setText('[data-content="categories-title"]', categories.title);
      this.setText('[data-content="categories-subtitle"]', categories.subtitle);

      const cardsContainer = document.querySelector('[data-content="categories-cards"]');
      if (cardsContainer && categories.cards) {
        cardsContainer.innerHTML = categories.cards.map(card => `
          <a href="${card.url}" class="category-card category-card--${card.size}" style="background-image: url(${card.image})">
            <div class="category-card__content">
              <h3 class="category-card__title">${card.title}</h3>
              <p class="category-card__description">${card.description}</p>
            </div>
          </a>
        `).join('');
      }
    }

    // Activities section
    if (tripsPage.activities) {
      const activities = tripsPage.activities;
      this.setText('[data-content="activities-title"]', activities.title);
      this.setText('[data-content="activities-subtitle"]', activities.subtitle);

      const cardsContainer = document.querySelector('[data-content="activities-cards"]');
      if (cardsContainer && activities.cards) {
        cardsContainer.innerHTML = activities.cards.map(card => `
          <div class="activity-card activity-card--${card.layout}">
            <img src="${card.image}" alt="${card.title}" class="activity-card__image" loading="lazy">
            <div class="activity-card__content">
              <h3 class="activity-card__title">${card.title}</h3>
              <p class="activity-card__description">${card.description}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // Popular destinations section
    if (tripsPage.popularDestinations) {
      const destinations = tripsPage.popularDestinations;
      this.setText('[data-content="destinations-title"]', destinations.title);
      this.setText('[data-content="destinations-subtitle"]', destinations.subtitle);
      this.setAttribute('[data-content="destinations-map"]', 'src', destinations.mapImage);

      const destinationsContainer = document.querySelector('[data-content="destinations-list"]');
      if (destinationsContainer && destinations.destinations) {
        destinationsContainer.innerHTML = destinations.destinations.map(dest => `
          <div class="destination-card">
            <img src="${dest.image}" alt="${dest.title}" class="destination-card__image" loading="lazy">
            <div class="destination-card__content">
              <span class="destination-card__flag">${dest.flag}</span>
              <h3 class="destination-card__title">${dest.title}</h3>
              <p class="destination-card__description">${dest.description}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // Promotions section
    if (tripsPage.promotions) {
      const promos = tripsPage.promotions;
      this.setText('[data-content="promos-title"]', promos.title);
      this.setText('[data-content="promos-subtitle"]', promos.subtitle);

      if (promos.voucher) {
        const voucher = promos.voucher;
        this.setText('[data-content="voucher-badge"]', voucher.badge);
        this.setText('[data-content="voucher-promo-title"]', voucher.promoTitle);
        this.setText('[data-content="voucher-discount-value"]', voucher.discountValue);
        this.setText('[data-content="voucher-discount-label"]', voucher.discountLabel);
        this.setText('[data-content="voucher-discount-note"]', voucher.discountNote);
        this.setText('[data-content="voucher-button"]', voucher.buttonText);
        this.setAttribute('[data-content="voucher-button"]', 'href', voucher.buttonUrl);
        this.setBackgroundImage('[data-content="voucher-section"]', voucher.backgroundImage);
      }
    }

    // Explore trips section
    if (tripsPage.exploreTrips) {
      const explore = tripsPage.exploreTrips;
      this.setText('[data-content="explore-title"]', explore.title);
      this.setText('[data-content="explore-subtitle"]', explore.subtitle);
    }

    // How to book section
    if (tripsPage.howToBook) {
      const howTo = tripsPage.howToBook;
      this.setText('[data-content="howto-title"]', howTo.title);
      this.setText('[data-content="howto-subtitle"]', howTo.subtitle);

      const stepsContainer = document.querySelector('[data-content="howto-steps"]');
      if (stepsContainer && howTo.steps) {
        stepsContainer.innerHTML = howTo.steps.map(step => `
          <div class="step-card">
            <span class="step-card__number">${step.number}</span>
            <h3 class="step-card__title">${step.title}</h3>
            <p class="step-card__description">${step.description}</p>
          </div>
        `).join('');
      }
    }
  }

  /**
   * Update SEO meta tags
   * @param {Object} seo - SEO settings object
   * @param {string} pageName - Current page name (home, about, trips, contact)
   */
  updateSEO(seo, pageName = 'home') {
    if (!seo) return;

    const pageTitle = seo.pages && seo.pages[pageName] ? 
      `${seo.pages[pageName].title}${seo.titleSeparator}${seo.siteName}` : 
      seo.defaultTitle;

    const pageDescription = seo.pages && seo.pages[pageName] ? 
      seo.pages[pageName].description : 
      seo.defaultDescription;

    // Update document title
    document.title = pageTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDescription);

    // Update OG tags
    this.updateMetaTag('og:title', pageTitle);
    this.updateMetaTag('og:description', pageDescription);
    this.updateMetaTag('og:image', seo.ogImage);
    this.updateMetaTag('og:site_name', seo.siteName);

    // Update Twitter tags
    if (seo.twitterHandle) {
      this.updateMetaTag('twitter:site', seo.twitterHandle);
    }
    this.updateMetaTag('twitter:title', pageTitle);
    this.updateMetaTag('twitter:description', pageDescription);
    this.updateMetaTag('twitter:image', seo.ogImage);
  }

  /**
   * Update or create meta tag
   * @param {string} property - Meta property name
   * @param {string} content - Meta content value
   */
  updateMetaTag(property, content) {
    if (!content) return;

    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  /**
   * Initialize content loading for a specific page
   * @param {string} pageName - The page to initialize (home, about, trips, contact)
   */
  async init(pageName = 'home') {
    try {
      // Load global content
      const global = await this.loadContent('global.json');
      if (global) {
        this.populateNavigation(global);
        this.populateFooter(global);
        this.populateCTA(global);
      }

      // Load SEO settings
      const seo = await this.loadContent('seo.json');
      if (seo) {
        this.updateSEO(seo, pageName);
      }

      // Load page-specific content
      switch (pageName) {
        case 'home':
          const homepage = await this.loadContent('homepage.json');
          if (homepage) this.populateHomepage(homepage);
          break;
        case 'about':
          const about = await this.loadContent('about.json');
          if (about) this.populateAboutPage(about);
          break;
        case 'trips':
          const tripsPage = await this.loadContent('trips-page.json');
          if (tripsPage) this.populateTripsPage(tripsPage);
          break;
        case 'contact':
          const contact = await this.loadContent('contact.json');
          if (contact) this.populateContactPage(contact);
          break;
      }

      console.log(`Content loaded successfully for ${pageName} page`);
    } catch (error) {
      console.error('Error initializing content:', error);
    }
  }
}

// Create global instance
const contentLoader = new ContentLoader();

// Auto-detect page and initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Detect current page from URL
  const path = window.location.pathname;
  let pageName = 'home';

  if (path.includes('about')) {
    pageName = 'about';
  } else if (path.includes('trip') && !path.includes('trip-details')) {
    pageName = 'trips';
  } else if (path.includes('contact')) {
    pageName = 'contact';
  } else if (path === '/' || path.includes('index')) {
    pageName = 'home';
  }

  // Initialize content loader
  contentLoader.init(pageName);
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentLoader;
}
