/**
 * Sanity CMS Content Loader
 * Fetches content from Sanity CMS and populates HTML elements
 */

const SANITY_PROJECT_ID = 'klhue3lk';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

// Add cache-busting to prevent stale data
const CACHE_BUST = Date.now();

/**
 * Build Sanity CDN URL for GROQ queries
 */
function sanityUrl(query) {
  const encodedQuery = encodeURIComponent(query);
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}&_=${CACHE_BUST}`;
}

/**
 * Fetch data from Sanity with no caching
 */
async function fetchSanity(query) {
  try {
    const response = await fetch(sanityUrl(query), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const data = await response.json();
    console.log('Sanity response for query:', query.substring(0, 50), data.result);
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
  if (!imageRef) return null;
  
  // Handle direct URL strings (from migration)
  if (typeof imageRef === 'string') {
    return imageRef;
  }
  
  // Handle Sanity image references
  if (!imageRef.asset) return null;
  
  const ref = imageRef.asset._ref;
  if (!ref) return null;
  
  // Parse: image-{id}-{dimensions}-{format}
  const parts = ref.split('-');
  if (parts.length < 4) return null;
  
  const id = parts[1];
  const dimensions = parts[2];
  const format = parts[3];
  
  let url = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
  
  const params = [];
  if (options.width) params.push(`w=${options.width}`);
  if (options.height) params.push(`h=${options.height}`);
  if (options.quality) params.push(`q=${options.quality}`);
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  
  return url;
}

/**
 * Safely set text content
 */
function setText(selector, text) {
  if (!text) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.textContent = text;
    console.log(`Set text for ${selector}:`, text.substring(0, 30));
  });
}

/**
 * Safely set background image
 */
function setBackground(selector, imgRef) {
  const url = imageUrl(imgRef);
  if (!url) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.style.backgroundImage = `url('${url}')`;
    console.log(`Set background for ${selector}:`, url.substring(0, 50));
  });
}

/**
 * Load Homepage Content
 */
async function loadHomepage() {
  const data = await fetchSanity('*[_type == "homepage"][0]');
  if (!data) {
    console.log('No homepage data found');
    return;
  }

  console.log('Loading homepage data:', data);

  // Hero Section
  if (data.hero) {
    setText('.hero__title', data.hero.title);
    setText('.hero__desc', data.hero.description);
    
    // Hero background
    if (data.hero.backgroundImage) {
      setBackground('.hero__container', data.hero.backgroundImage);
    }
    
    // Hero button
    const heroBtn = document.querySelector('.hero .btn--primary');
    if (heroBtn && data.hero.buttonText) {
      heroBtn.textContent = data.hero.buttonText;
    }
    if (heroBtn && data.hero.buttonUrl) {
      heroBtn.href = data.hero.buttonUrl;
    }

    // Stats
    if (data.hero.stats && data.hero.stats.length > 0) {
      const statsContainer = document.querySelector('.hero__stats');
      if (statsContainer) {
        statsContainer.innerHTML = data.hero.stats.map(stat => `
          <div class="hero__stat">
            <span class="hero__stat-number">${stat.number}</span>
            <span class="hero__stat-label">${stat.label}</span>
          </div>
        `).join('');
      }
    }
  }

  // Services Section
  if (data.services) {
    setText('.services__title', data.services.title);
    setText('.services__subtitle', data.services.subtitle);
    
    // Note: Service cards are hardcoded with SVG icons in HTML
    // We only update titles/descriptions if there's a container for dynamic cards
  }

  // Featured Trips Section
  if (data.featuredTrips) {
    setText('.featured__title', data.featuredTrips.title);
    setText('.featured__desc', data.featuredTrips.subtitle);
  }

  // Gallery Section
  if (data.gallery) {
    setText('.gallery__title', data.gallery.title);
    setText('.gallery__subtitle', data.gallery.subtitle);
  }

  // Why Choose Section
  if (data.whyChoose) {
    setText('.why-us__title', data.whyChoose.title);
    setText('.why-us__subtitle', data.whyChoose.subtitle);
    
    // Update cards if they exist
    if (data.whyChoose.cards) {
      const cards = document.querySelectorAll('.why-card');
      data.whyChoose.cards.forEach((card, i) => {
        if (cards[i]) {
          const title = cards[i].querySelector('.why-card__title');
          const desc = cards[i].querySelector('.why-card__desc');
          const icon = cards[i].querySelector('.why-card__icon');
          if (title) title.textContent = card.title;
          if (desc) desc.textContent = card.description;
          if (icon && card.icon) icon.textContent = card.icon;
        }
      });
    }
  }

  // Testimonials Section
  if (data.testimonials) {
    setText('.testimonials__title', data.testimonials.title);
    setText('.testimonials__subtitle', data.testimonials.subtitle);
    
    // Update testimonial cards
    if (data.testimonials.items) {
      const cards = document.querySelectorAll('.testimonial-card');
      data.testimonials.items.forEach((item, i) => {
        if (cards[i]) {
          const quote = cards[i].querySelector('.testimonial-card__text');
          const author = cards[i].querySelector('.testimonial-card__author');
          const role = cards[i].querySelector('.testimonial-card__role');
          if (quote) quote.textContent = `"${item.quote}"`;
          if (author) author.textContent = item.author;
          if (role) role.textContent = item.role;
        }
      });
    }
  }
}

/**
 * Load Global Settings (Navigation, Footer, CTA)
 */
async function loadGlobalSettings() {
  const data = await fetchSanity('*[_type == "globalSettings"][0]');
  if (!data) {
    console.log('No global settings found');
    return;
  }

  console.log('Loading global settings:', data);

  // Navigation
  if (data.navigation) {
    setText('.nav__logo', data.navigation.logo);
  }

  // Footer
  if (data.footer) {
    setText('.footer__description', data.footer.description);
    setText('.footer__copyright', data.footer.copyright);
    setText('.footer__newsletter-text', data.footer.newsletterText);
    
    // Contact info in footer
    const addressEl = document.querySelector('.footer__contact-address, .footer__address');
    if (addressEl && data.footer.address) addressEl.textContent = data.footer.address;
    
    const phoneEl = document.querySelector('.footer__contact-phone, .footer__phone');
    if (phoneEl && data.footer.phone) phoneEl.textContent = data.footer.phone;
    
    const emailEl = document.querySelector('.footer__contact-email, .footer__email');
    if (emailEl && data.footer.email) emailEl.textContent = data.footer.email;
  }

  // CTA Section
  if (data.cta) {
    setText('.cta__title', data.cta.title);
    setText('.cta__description, .cta__desc', data.cta.description);
    
    const ctaBtn = document.querySelector('.cta__btn, .cta .btn--primary');
    if (ctaBtn) {
      if (data.cta.buttonText) ctaBtn.textContent = data.cta.buttonText;
      if (data.cta.buttonUrl) ctaBtn.href = data.cta.buttonUrl;
    }
    
    if (data.cta.backgroundImage) {
      setBackground('.cta', data.cta.backgroundImage);
    }
  }
}

/**
 * Load Trips (Featured or All)
 */
async function loadTrips(featured = false) {
  const query = featured 
    ? '*[_type == "trip" && featured == true] | order(title asc)'
    : '*[_type == "trip"] | order(title asc)';
  
  const trips = await fetchSanity(query);
  if (!trips || trips.length === 0) {
    console.log('No trips found');
    return [];
  }

  console.log('Loaded trips:', trips.length);
  return trips;
}

/**
 * Load Single Trip by Slug
 */
async function loadTripBySlug(slug) {
  const query = `*[_type == "trip" && slug.current == "${slug}"][0]`;
  const trip = await fetchSanity(query);
  
  if (!trip) {
    console.log('Trip not found:', slug);
    return null;
  }

  console.log('Loaded trip:', trip.title);

  // Update trip details page
  setText('.trip-hero__title, .trip-details__title', trip.title);
  setText('.trip-hero__location, .trip-details__destination', trip.destination);
  setText('.trip-hero__description, .trip-details__excerpt', trip.excerpt);
  
  // Price
  const priceEl = document.querySelector('.booking-card__price, .trip-details__price');
  if (priceEl && trip.price) {
    priceEl.textContent = `$${trip.price.toLocaleString()}`;
  }

  // Duration, Group Size, etc.
  setText('.trip-info__duration .trip-info__value, .booking-card__value[data-field="duration"]', trip.duration);
  setText('.trip-info__group .trip-info__value, .booking-card__value[data-field="groupSize"]', trip.groupSize);
  
  // Update booking card details
  const bookingRows = document.querySelectorAll('.booking-card__row');
  bookingRows.forEach(row => {
    const label = row.querySelector('.booking-card__label');
    const value = row.querySelector('.booking-card__value');
    if (label && value) {
      const labelText = label.textContent.toLowerCase();
      if (labelText.includes('duration') && trip.duration) value.textContent = trip.duration;
      if (labelText.includes('group') && trip.groupSize) value.textContent = trip.groupSize;
      if (labelText.includes('next') && trip.nextDate) value.textContent = new Date(trip.nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (labelText.includes('tour') && trip.tourType) value.textContent = trip.tourType;
      if (labelText.includes('accommodation') && trip.accommodation) value.textContent = trip.accommodation;
    }
  });

  // Hero/Main image
  if (trip.image) {
    setBackground('.trip-hero, .trip-details__hero', trip.image);
    const mainImg = document.querySelector('.trip-hero__image img, .trip-details__image');
    if (mainImg) {
      mainImg.src = imageUrl(trip.image);
      mainImg.alt = trip.title;
    }
  }

  // What's Included
  if (trip.included && trip.included.length > 0) {
    const includesList = document.querySelector('.includes__list, .trip-details__included-list');
    if (includesList) {
      includesList.innerHTML = trip.included.map(item => 
        `<li class="includes__item"><span class="includes__check">✓</span>${item}</li>`
      ).join('');
    }
  }

  // Itinerary
  if (trip.itinerary && trip.itinerary.length > 0) {
    const itineraryContainer = document.querySelector('.itinerary__timeline, .trip-details__itinerary');
    if (itineraryContainer) {
      itineraryContainer.innerHTML = trip.itinerary.map(day => `
        <div class="itinerary__day">
          <div class="itinerary__day-header">
            <span class="itinerary__day-number">Day ${day.day}</span>
            <h4 class="itinerary__day-title">${day.title}</h4>
          </div>
          <p class="itinerary__day-desc">${day.description}</p>
        </div>
      `).join('');
    }
  }

  // Gallery
  if (trip.gallery && trip.gallery.length > 0) {
    const galleryContainer = document.querySelector('.trip-gallery__grid, .trip-details__gallery');
    if (galleryContainer) {
      galleryContainer.innerHTML = trip.gallery.map(img => 
        `<img src="${imageUrl(img)}" alt="${trip.title}" class="trip-gallery__image">`
      ).join('');
    }
  }

  return trip;
}

/**
 * Load About Page
 */
async function loadAboutPage() {
  const data = await fetchSanity('*[_type == "aboutPage"][0]');
  if (!data) return;

  console.log('Loading about page:', data);

  if (data.hero) {
    setText('.hero__title', data.hero.title);
    setText('.hero__description, .hero__desc', data.hero.description);
  }

  if (data.collective) {
    setText('.collective__title, .about-stats__title', data.collective.title);
    setText('.collective__description, .about-stats__desc', data.collective.description);
  }

  if (data.team && data.team.members) {
    setText('.team__title', data.team.title);
    setText('.team__subtitle', data.team.subtitle);
  }
}

/**
 * Load Contact Page
 */
async function loadContactPage() {
  const data = await fetchSanity('*[_type == "contactPage"][0]');
  if (!data) return;

  console.log('Loading contact page:', data);

  if (data.hero) {
    setText('.contact__title, .hero__title', data.hero.title);
    setText('.contact__description, .hero__desc', data.hero.description);
  }

  if (data.faq) {
    setText('.faq__title', data.faq.title);
  }
}

/**
 * Load Trips Page
 */
async function loadTripsPage() {
  const data = await fetchSanity('*[_type == "tripsPage"][0]');
  if (!data) return;

  console.log('Loading trips page:', data);

  if (data.hero) {
    setText('.hero__title', data.hero.title);
    setText('.hero__description, .hero__desc', data.hero.description);
  }

  if (data.categories) {
    setText('.categories__title', data.categories.title);
    setText('.categories__subtitle', data.categories.subtitle);
  }

  if (data.howToBook) {
    setText('.how-to-book__title', data.howToBook.title);
    setText('.how-to-book__subtitle', data.howToBook.subtitle);
  }
}

/**
 * Detect current page and load appropriate content
 */
async function initSanity() {
  console.log('🚀 Sanity Loader initializing...');
  
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  
  console.log('Current page:', page);

  // Always load global settings
  await loadGlobalSettings();

  // Load page-specific content
  switch (page) {
    case 'index':
    case '':
      await loadHomepage();
      break;
    
    case 'trips':
      await loadTripsPage();
      break;
    
    case 'about':
      await loadAboutPage();
      break;
    
    case 'contact':
      await loadContactPage();
      break;
    
    case 'trip-details':
      // Get trip slug from URL
      const urlParams = new URLSearchParams(window.location.search);
      const tripSlug = urlParams.get('trip') || urlParams.get('slug');
      if (tripSlug) {
        await loadTripBySlug(tripSlug);
      } else {
        console.log('No trip slug in URL');
      }
      break;
  }

  console.log('✅ Sanity Loader complete');
}

// Export for debugging
window.SanityLoader = {
  fetchSanity,
  imageUrl,
  loadHomepage,
  loadGlobalSettings,
  loadTrips,
  loadTripBySlug,
  loadAboutPage,
  loadContactPage,
  loadTripsPage,
  initSanity,
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSanity);
} else {
  initSanity();
}
