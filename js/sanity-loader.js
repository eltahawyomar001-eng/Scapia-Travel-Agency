/**
 * Sanity CMS Content Loader
 * Fetches content from Sanity CMS and populates HTML elements
 */

const SANITY_PROJECT_ID = 'klhue3lk';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

/**
 * Build Sanity CDN URL for GROQ queries
 */
function sanityUrl(query, params = {}) {
  const searchParams = new URLSearchParams({
    query,
    ...params
  });
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?${searchParams}`;
}

/**
 * Fetch data from Sanity
 */
async function fetchSanity(query) {
  try {
    const response = await fetch(sanityUrl(query));
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    return null;
  }
}

/**
 * Convert Sanity image reference to URL
 */
function imageUrl(imageRef, options = {}) {
  if (!imageRef || !imageRef.asset) return null;
  
  // Extract the image ID from the reference
  const ref = imageRef.asset._ref;
  if (!ref) return null;
  
  // Parse the reference: image-{id}-{dimensions}-{format}
  const [, id, dimensions, format] = ref.split('-');
  
  // Build the URL
  let url = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
  
  // Add transformation options
  const params = [];
  if (options.width) params.push(`w=${options.width}`);
  if (options.height) params.push(`h=${options.height}`);
  if (options.quality) params.push(`q=${options.quality}`);
  if (options.fit) params.push(`fit=${options.fit}`);
  
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  
  return url;
}

/**
 * GROQ Queries for each content type
 */
const QUERIES = {
  globalSettings: `*[_type == "globalSettings"][0]`,
  homepage: `*[_type == "homepage"][0]`,
  aboutPage: `*[_type == "aboutPage"][0]`,
  tripsPage: `*[_type == "tripsPage"][0]`,
  contactPage: `*[_type == "contactPage"][0]`,
  tripDetailsPage: `*[_type == "tripDetailsPage"][0]`,
  seoSettings: `*[_type == "seoSettings"][0]`,
  allTrips: `*[_type == "trip"] | order(title asc)`,
  featuredTrips: `*[_type == "trip" && featured == true] | order(title asc)`,
  tripBySlug: (slug) => `*[_type == "trip" && slug.current == "${slug}"][0]`,
};

/**
 * Set text content on an element
 */
function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element && text) {
    element.textContent = text;
  }
}

/**
 * Set HTML content on an element
 */
function setHtml(selector, html) {
  const element = document.querySelector(selector);
  if (element && html) {
    element.innerHTML = html;
  }
}

/**
 * Set background image on an element
 */
function setBackgroundImage(selector, imageRef) {
  const element = document.querySelector(selector);
  const url = imageUrl(imageRef);
  if (element && url) {
    element.style.backgroundImage = `url('${url}')`;
  }
}

/**
 * Set image src on an element
 */
function setImage(selector, imageRef, alt = '') {
  const element = document.querySelector(selector);
  const url = imageUrl(imageRef);
  if (element && url) {
    element.src = url;
    if (alt) element.alt = alt;
  }
}

/**
 * Load Global Settings (navigation, footer, CTA)
 */
async function loadGlobalSettings() {
  const settings = await fetchSanity(QUERIES.globalSettings);
  if (!settings) return;

  // Navigation
  if (settings.navigation) {
    setText('.nav__logo', settings.navigation.logo);
    setText('.nav__lang-btn', settings.navigation.langButton);
  }

  // Footer
  if (settings.footer) {
    setText('.footer__description', settings.footer.description);
    setText('.footer__contact-address', settings.footer.address);
    setText('.footer__contact-phone', settings.footer.phone);
    setText('.footer__contact-email', settings.footer.email);
    setText('.footer__copyright', settings.footer.copyright);
    setText('.footer__newsletter-text', settings.footer.newsletterText);
    setText('.footer__newsletter-btn', settings.footer.newsletterButton);
  }

  // CTA
  if (settings.cta) {
    setText('.cta__title', settings.cta.title);
    setText('.cta__description', settings.cta.description);
    setText('.cta__btn', settings.cta.buttonText);
    
    const ctaBtn = document.querySelector('.cta__btn');
    if (ctaBtn && settings.cta.buttonUrl) {
      ctaBtn.href = settings.cta.buttonUrl;
    }
    
    setBackgroundImage('.cta', settings.cta.backgroundImage);
  }

  return settings;
}

/**
 * Load Homepage Content
 */
async function loadHomepageContent() {
  const content = await fetchSanity(QUERIES.homepage);
  if (!content) return;

  // Hero Section
  if (content.hero) {
    setText('[data-content="hero-title"], .hero__title', content.hero.title);
    setText('[data-content="hero-description"], .hero__description', content.hero.description);
    setText('[data-content="hero-button"], .hero__btn', content.hero.buttonText);
    
    const heroBtn = document.querySelector('.hero__btn');
    if (heroBtn && content.hero.buttonUrl) {
      heroBtn.href = content.hero.buttonUrl;
    }
    
    setBackgroundImage('.hero__container, .hero', content.hero.backgroundImage);

    // Stats
    if (content.hero.stats && content.hero.stats.length > 0) {
      const statsContainer = document.querySelector('.hero__stats');
      if (statsContainer) {
        statsContainer.innerHTML = content.hero.stats.map(stat => `
          <div class="hero__stat">
            <span class="hero__stat-number">${stat.number}</span>
            <span class="hero__stat-label">${stat.label}</span>
          </div>
        `).join('');
      }
    }
  }

  // Services Section
  if (content.services) {
    setText('.services__title', content.services.title);
    setText('.services__subtitle', content.services.subtitle);

    if (content.services.cards && content.services.cards.length > 0) {
      const cardsContainer = document.querySelector('.services__grid');
      if (cardsContainer) {
        cardsContainer.innerHTML = content.services.cards.map(card => `
          <div class="service-card">
            <div class="service-card__icon">${card.icon}</div>
            <h3 class="service-card__title">${card.title}</h3>
            <p class="service-card__description">${card.description}</p>
          </div>
        `).join('');
      }
    }
  }

  // Featured Trips Section
  if (content.featuredTrips) {
    setText('.featured__title', content.featuredTrips.title);
    setText('.featured__subtitle', content.featuredTrips.subtitle);
    setText('.featured__view-all', content.featuredTrips.viewAllText);
    
    const viewAllBtn = document.querySelector('.featured__view-all');
    if (viewAllBtn && content.featuredTrips.viewAllUrl) {
      viewAllBtn.href = content.featuredTrips.viewAllUrl;
    }
  }

  // Load featured trips
  await loadFeaturedTrips();

  // Gallery Section
  if (content.gallery) {
    setText('.gallery__title', content.gallery.title);
    setText('.gallery__subtitle', content.gallery.subtitle);

    if (content.gallery.images && content.gallery.images.length > 0) {
      const galleryGrid = document.querySelector('.gallery__grid');
      if (galleryGrid) {
        galleryGrid.innerHTML = content.gallery.images.map(item => `
          <div class="gallery__item">
            <img src="${imageUrl(item.image)}" alt="${item.alt || ''}" class="gallery__image">
            ${item.location ? `<span class="gallery__location">${item.location}</span>` : ''}
          </div>
        `).join('');
      }
    }
  }

  // Why Choose Section
  if (content.whyChoose) {
    setText('.why-choose__title', content.whyChoose.title);
    setText('.why-choose__subtitle', content.whyChoose.subtitle);

    if (content.whyChoose.cards && content.whyChoose.cards.length > 0) {
      const cardsContainer = document.querySelector('.why-choose__grid');
      if (cardsContainer) {
        cardsContainer.innerHTML = content.whyChoose.cards.map(card => `
          <div class="why-card">
            <div class="why-card__icon">${card.icon}</div>
            <h3 class="why-card__title">${card.title}</h3>
            <p class="why-card__description">${card.description}</p>
          </div>
        `).join('');
      }
    }
  }

  // Testimonials Section
  if (content.testimonials) {
    setText('.testimonials__title', content.testimonials.title);
    setText('.testimonials__subtitle', content.testimonials.subtitle);

    if (content.testimonials.items && content.testimonials.items.length > 0) {
      const container = document.querySelector('.testimonials__grid');
      if (container) {
        container.innerHTML = content.testimonials.items.map(item => `
          <div class="testimonial-card">
            <div class="testimonial-card__rating">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>
            <p class="testimonial-card__quote">${item.quote}</p>
            <div class="testimonial-card__author">
              ${item.image ? `<img src="${imageUrl(item.image)}" alt="${item.author}" class="testimonial-card__avatar">` : ''}
              <div>
                <span class="testimonial-card__name">${item.author}</span>
                <span class="testimonial-card__role">${item.role}</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  return content;
}

/**
 * Load Featured Trips
 */
async function loadFeaturedTrips() {
  const trips = await fetchSanity(QUERIES.featuredTrips);
  if (!trips || trips.length === 0) return;

  const container = document.querySelector('.featured__grid, .trips__grid');
  if (!container) return;

  container.innerHTML = trips.map(trip => `
    <div class="trip-card">
      <div class="trip-card__image-container">
        <img src="${imageUrl(trip.image)}" alt="${trip.title}" class="trip-card__image">
        ${trip.bestSeller ? '<span class="trip-card__badge">Best Seller</span>' : ''}
      </div>
      <div class="trip-card__content">
        <h3 class="trip-card__title">${trip.title}</h3>
        <p class="trip-card__destination">${trip.destination || ''}</p>
        <p class="trip-card__excerpt">${trip.excerpt || ''}</p>
        <div class="trip-card__footer">
          <span class="trip-card__price">From $${trip.price}</span>
          <span class="trip-card__duration">${trip.duration}</span>
        </div>
        <a href="trip-details.html?trip=${trip.slug?.current}" class="trip-card__link">View Details</a>
      </div>
    </div>
  `).join('');
}

/**
 * Load All Trips (for trips page)
 */
async function loadAllTrips() {
  const trips = await fetchSanity(QUERIES.allTrips);
  if (!trips || trips.length === 0) return;

  const container = document.querySelector('.trips__grid');
  if (!container) return;

  container.innerHTML = trips.map(trip => `
    <div class="trip-card" data-category="${trip.category || ''}">
      <div class="trip-card__image-container">
        <img src="${imageUrl(trip.image)}" alt="${trip.title}" class="trip-card__image">
        ${trip.bestSeller ? '<span class="trip-card__badge">Best Seller</span>' : ''}
        ${trip.featured ? '<span class="trip-card__badge trip-card__badge--featured">Featured</span>' : ''}
      </div>
      <div class="trip-card__content">
        <h3 class="trip-card__title">${trip.title}</h3>
        <p class="trip-card__destination">${trip.destination || ''}</p>
        <p class="trip-card__excerpt">${trip.excerpt || ''}</p>
        <div class="trip-card__footer">
          <span class="trip-card__price">From $${trip.price}</span>
          <span class="trip-card__duration">${trip.duration}</span>
        </div>
        <a href="trip-details.html?trip=${trip.slug?.current}" class="trip-card__link">View Details</a>
      </div>
    </div>
  `).join('');
}

/**
 * Load Trips Page Content
 */
async function loadTripsPageContent() {
  const content = await fetchSanity(QUERIES.tripsPage);
  if (!content) return;

  // Hero
  if (content.hero) {
    setText('.hero__title', content.hero.title);
    setText('.hero__description', content.hero.description);
    setBackgroundImage('.hero__container, .hero', content.hero.image);
  }

  // Categories
  if (content.categories) {
    setText('.categories__title', content.categories.title);
    setText('.categories__subtitle', content.categories.subtitle);
  }

  // Activities
  if (content.activities) {
    setText('.activities__title', content.activities.title);
    setText('.activities__subtitle', content.activities.subtitle);
  }

  // Popular Destinations
  if (content.popularDestinations) {
    setText('.destinations__title', content.popularDestinations.title);
    setText('.destinations__subtitle', content.popularDestinations.subtitle);
  }

  // How to Book
  if (content.howToBook) {
    setText('.how-to-book__title', content.howToBook.title);
    setText('.how-to-book__subtitle', content.howToBook.subtitle);

    if (content.howToBook.steps && content.howToBook.steps.length > 0) {
      const container = document.querySelector('.how-to-book__steps');
      if (container) {
        container.innerHTML = content.howToBook.steps.map(step => `
          <div class="step">
            <span class="step__number">${step.number}</span>
            <h3 class="step__title">${step.title}</h3>
            <p class="step__description">${step.description}</p>
          </div>
        `).join('');
      }
    }
  }

  // Load all trips
  await loadAllTrips();

  return content;
}

/**
 * Load Single Trip Details
 */
async function loadTripDetails(slug) {
  const trip = await fetchSanity(QUERIES.tripBySlug(slug));
  if (!trip) {
    console.error('Trip not found:', slug);
    return null;
  }

  // Also load page settings
  const pageSettings = await fetchSanity(QUERIES.tripDetailsPage);

  // Populate trip details
  setText('.trip-details__title', trip.title);
  setText('.trip-details__destination', trip.destination);
  setText('.trip-details__description', trip.description);
  setText('.trip-details__price', `$${trip.price}`);
  setText('.trip-details__duration', trip.duration);
  setText('.trip-details__group-size', trip.groupSize);
  setText('.trip-details__tour-type', trip.tourType);
  setText('.trip-details__accommodation', trip.accommodation);
  setText('.trip-details__dates', trip.dates);

  // Set featured image
  setImage('.trip-details__image', trip.image, trip.title);
  setBackgroundImage('.trip-details__hero', trip.image);

  // What's Included
  if (trip.included && trip.included.length > 0) {
    const container = document.querySelector('.trip-details__included-list');
    if (container) {
      container.innerHTML = trip.included.map(item => `
        <li class="trip-details__included-item">✓ ${item}</li>
      `).join('');
    }
  }

  // Itinerary
  if (trip.itinerary && trip.itinerary.length > 0) {
    const container = document.querySelector('.trip-details__itinerary');
    if (container) {
      container.innerHTML = trip.itinerary.map(day => `
        <div class="itinerary-day">
          <div class="itinerary-day__header">
            <span class="itinerary-day__number">Day ${day.day}</span>
            <h4 class="itinerary-day__title">${day.title}</h4>
          </div>
          <p class="itinerary-day__description">${day.description}</p>
        </div>
      `).join('');
    }
  }

  // Gallery
  if (trip.gallery && trip.gallery.length > 0) {
    const container = document.querySelector('.trip-details__gallery');
    if (container) {
      container.innerHTML = trip.gallery.map(img => `
        <img src="${imageUrl(img)}" alt="${trip.title}" class="trip-details__gallery-image">
      `).join('');
    }
  }

  return trip;
}

/**
 * Load About Page Content
 */
async function loadAboutPageContent() {
  const content = await fetchSanity(QUERIES.aboutPage);
  if (!content) return;

  // Hero
  if (content.hero) {
    setText('.hero__title', content.hero.title);
    setText('.hero__description', content.hero.description);
  }

  // Collective/Stats
  if (content.collective) {
    setText('.collective__title', content.collective.title);
    setText('.collective__description', content.collective.description);

    if (content.collective.stats && content.collective.stats.length > 0) {
      const container = document.querySelector('.collective__stats');
      if (container) {
        container.innerHTML = content.collective.stats.map(stat => `
          <div class="stat">
            <span class="stat__number">${stat.number}</span>
            <span class="stat__label">${stat.label}</span>
          </div>
        `).join('');
      }
    }
  }

  // Team
  if (content.team) {
    setText('.team__title', content.team.title);
    setText('.team__subtitle', content.team.subtitle);

    if (content.team.members && content.team.members.length > 0) {
      const container = document.querySelector('.team__grid');
      if (container) {
        container.innerHTML = content.team.members.map(member => `
          <div class="team-card">
            <img src="${imageUrl(member.image)}" alt="${member.name}" class="team-card__image">
            <h3 class="team-card__name">${member.name}</h3>
            <p class="team-card__role">${member.role}</p>
            ${member.social ? `
              <div class="team-card__social">
                ${member.social.facebook ? `<a href="${member.social.facebook}" class="team-card__social-link">FB</a>` : ''}
                ${member.social.linkedin ? `<a href="${member.social.linkedin}" class="team-card__social-link">LI</a>` : ''}
                ${member.social.instagram ? `<a href="${member.social.instagram}" class="team-card__social-link">IG</a>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('');
      }
    }
  }

  // Why Choose (About version)
  if (content.whyChoose) {
    setText('.why-choose__title', content.whyChoose.title);
    setText('.why-choose__subtitle', content.whyChoose.subtitle);
  }

  // Story Timeline
  if (content.storyTimeline) {
    setText('.timeline__title', content.storyTimeline.title);

    if (content.storyTimeline.items && content.storyTimeline.items.length > 0) {
      const container = document.querySelector('.timeline__items');
      if (container) {
        container.innerHTML = content.storyTimeline.items.map(item => `
          <div class="timeline-item">
            <span class="timeline-item__year">${item.year}</span>
            <p class="timeline-item__description">${item.description}</p>
          </div>
        `).join('');
      }
    }
  }

  return content;
}

/**
 * Load Contact Page Content
 */
async function loadContactPageContent() {
  const content = await fetchSanity(QUERIES.contactPage);
  if (!content) return;

  // Hero
  if (content.hero) {
    setText('.hero__title, .contact__title', content.hero.title);
    setText('.hero__description, .contact__description', content.hero.description);

    // Contact Info
    if (content.hero.contactInfo && content.hero.contactInfo.length > 0) {
      const container = document.querySelector('.contact__info');
      if (container) {
        container.innerHTML = content.hero.contactInfo.map(info => `
          <div class="contact-info">
            <span class="contact-info__label">${info.label}</span>
            <span class="contact-info__value">${info.value}</span>
          </div>
        `).join('');
      }
    }
  }

  // Form
  if (content.form) {
    setText('.form__title', content.form.title);
    
    const submitBtn = document.querySelector('.form__submit');
    if (submitBtn && content.form.submitText) {
      submitBtn.textContent = content.form.submitText;
    }
  }

  // FAQ
  if (content.faq) {
    setText('.faq__title', content.faq.title);

    if (content.faq.questions && content.faq.questions.length > 0) {
      const container = document.querySelector('.faq__list');
      if (container) {
        container.innerHTML = content.faq.questions.map(q => `
          <div class="faq-item">
            <button class="faq-item__question">${q.question}</button>
            <div class="faq-item__answer">${q.answer}</div>
          </div>
        `).join('');
      }
    }
  }

  return content;
}

/**
 * Auto-detect page and load appropriate content
 */
async function initSanityContent() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';

  // Always load global settings
  await loadGlobalSettings();

  // Load page-specific content
  switch (page) {
    case 'index':
    case '':
      await loadHomepageContent();
      break;
    case 'trips':
      await loadTripsPageContent();
      break;
    case 'about':
      await loadAboutPageContent();
      break;
    case 'contact':
      await loadContactPageContent();
      break;
    case 'trip-details':
      const urlParams = new URLSearchParams(window.location.search);
      const tripSlug = urlParams.get('trip');
      if (tripSlug) {
        await loadTripDetails(tripSlug);
      }
      break;
  }
}

// Export for use in other scripts
window.SanityLoader = {
  fetchSanity,
  imageUrl,
  loadGlobalSettings,
  loadHomepageContent,
  loadTripsPageContent,
  loadAboutPageContent,
  loadContactPageContent,
  loadTripDetails,
  loadAllTrips,
  loadFeaturedTrips,
  initSanityContent,
  QUERIES,
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSanityContent);
