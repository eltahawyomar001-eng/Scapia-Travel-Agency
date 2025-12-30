// CMS Content Loader - Loads content from DecapCMS JSON files
// This script dynamically loads content from /content/settings/ JSON files

/**
 * Validates if an image URL is safe to use
 * Only allows: full URLs (http/https) or CMS uploaded images (/images/uploads/)
 * Rejects: broken local paths like /images/hero-bg.jpg that don't exist
 */
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  // Allow full URLs (Unsplash, etc.)
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  // Allow CMS uploaded images
  if (url.startsWith('/images/uploads/')) return true;
  // Reject all other local paths (they likely don't exist)
  return false;
}

/**
 * Safely set background image only if URL is valid
 */
function safeSetBackgroundImage(element, imageUrl) {
  if (element && isValidImageUrl(imageUrl)) {
    element.style.backgroundImage = `url('${imageUrl}')`;
  }
}

/**
 * Safely set image src only if URL is valid
 */
function safeSetImageSrc(element, imageUrl, altText = '') {
  if (element && isValidImageUrl(imageUrl)) {
    element.src = imageUrl;
    if (altText) element.alt = altText;
  }
}

async function loadHomepageContent() {
  try {
    // Fetch homepage content from CMS
    const response = await fetch('/content/settings/homepage.json');
    const data = await response.json();
    
    // Update Hero Section
    if (data.hero) {
      const heroTitle = document.querySelector('.hero__title');
      const heroDesc = document.querySelector('.hero__desc');
      const heroBtn = document.querySelector('.hero__content .btn--primary');
      const heroContainer = document.querySelector('.hero__container');
      
      if (heroTitle) heroTitle.textContent = data.hero.title;
      if (heroDesc) heroDesc.textContent = data.hero.description;
      if (heroBtn) {
        heroBtn.textContent = data.hero.buttonText;
        heroBtn.href = data.hero.buttonUrl;
      }
      safeSetBackgroundImage(heroContainer, data.hero.backgroundImage);
    }
    
    // Update Services Section
    if (data.services) {
      const servicesTitle = document.querySelector('.services__title');
      const servicesSubtitle = document.querySelector('.services__subtitle');
      
      if (servicesTitle) servicesTitle.textContent = data.services.title;
      if (servicesSubtitle) servicesSubtitle.textContent = data.services.subtitle;
      
      // Update service cards
      const serviceCards = document.querySelectorAll('.service-card');
      if (data.services.cards && serviceCards.length > 0) {
        serviceCards.forEach((card, index) => {
          if (data.services.cards[index]) {
            const title = card.querySelector('.service-card__title');
            const desc = card.querySelector('.service-card__desc');
            
            if (title) title.textContent = data.services.cards[index].title;
            if (desc) desc.textContent = data.services.cards[index].description;
          }
        });
      }
    }
    
    // Update Featured Section
    if (data.featuredTrips) {
      const featuredTitle = document.querySelector('.featured__title');
      const featuredDesc = document.querySelector('.featured__desc');
      
      if (featuredTitle) featuredTitle.textContent = data.featuredTrips.title;
      if (featuredDesc) featuredDesc.textContent = data.featuredTrips.subtitle;
    }
    
    // Update Categories Section
    if (data.categories) {
      const categoriesTitle = document.querySelector('.categories__title');
      const categoriesSubtitle = document.querySelector('.categories__subtitle');
      
      if (categoriesTitle) categoriesTitle.textContent = data.categories.title;
      if (categoriesSubtitle) categoriesSubtitle.textContent = data.categories.subtitle;
    }
    
    // Update Why Choose Us Section
    if (data.whyChoose) {
      const whyUsTitle = document.querySelector('.why-us__title');
      
      if (whyUsTitle) whyUsTitle.textContent = data.whyChoose.title;
    }
    
    // Update Video Section
    if (data.video) {
      const videoTitle = document.querySelector('.video-section__title');
      const videoSubtitle = document.querySelector('.video-section__subtitle');
      
      if (videoTitle) videoTitle.textContent = data.video.title;
      if (videoSubtitle) videoSubtitle.textContent = data.video.subtitle;
    }
    
    // Update Promotions Section
    if (data.promotions) {
      const promotionsTitle = document.querySelector('.promotions__title');
      const promotionsSubtitle = document.querySelector('.promotions__subtitle');
      
      if (promotionsTitle) promotionsTitle.textContent = data.promotions.title;
      if (promotionsSubtitle) promotionsSubtitle.textContent = data.promotions.subtitle;
    }
    
    // Update Adventures Section
    if (data.adventures) {
      const adventuresTitle = document.querySelector('.adventures__title');
      const adventuresDesc = document.querySelector('.adventures__desc');
      
      if (adventuresTitle) adventuresTitle.textContent = data.adventures.title;
      if (adventuresDesc) adventuresDesc.textContent = data.adventures.subtitle;
    }
    
    // Update Testimonial Section
    if (data.testimonial) {
      const testimonialTitle = document.querySelector('.testimonial__title');
      const testimonialSubtitle = document.querySelector('.testimonial__subtitle');
      
      if (testimonialTitle) testimonialTitle.textContent = data.testimonial.title;
      if (testimonialSubtitle) testimonialSubtitle.textContent = data.testimonial.subtitle;
    }
    
    // Update Blog Preview Section
    if (data.blogPreview) {
      const blogTitle = document.querySelector('.blog-preview__title');
      
      if (blogTitle) blogTitle.textContent = data.blogPreview.title;
    }
    
    console.log('✅ Homepage content loaded from CMS');
  } catch (error) {
    console.warn('⚠️ Could not load CMS content, using default HTML content:', error);
  }
}

// Load global settings (footer, navigation, etc.)
async function loadGlobalSettings() {
  try {
    const response = await fetch('/content/settings/global.json');
    const data = await response.json();
    
    // Update footer description
    if (data.footer && data.footer.description) {
      const footerDesc = document.querySelector('.footer__desc');
      if (footerDesc) footerDesc.textContent = data.footer.description;
    }
    
    // Update CTA section
    if (data.cta) {
      const ctaTitle = document.querySelector('.cta__title');
      const ctaDesc = document.querySelector('.cta__desc');
      const ctaBtn = document.querySelector('.cta__btn');
      
      if (ctaTitle) ctaTitle.textContent = data.cta.title;
      if (ctaDesc) ctaDesc.textContent = data.cta.description;
      if (ctaBtn) ctaBtn.textContent = data.cta.buttonText;
    }
    
    console.log('✅ Global settings loaded from CMS');
  } catch (error) {
    console.warn('⚠️ Could not load global settings:', error);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadHomepageContent();
    loadGlobalSettings();
  });
} else {
  loadHomepageContent();
  loadGlobalSettings();
}
