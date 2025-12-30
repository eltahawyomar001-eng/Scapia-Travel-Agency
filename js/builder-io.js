/**
 * Builder.io Integration for SCAPIA Travel Website
 * Enables CMS editing for clients - No GitHub needed!
 * 
 * API Key: 31241975b8be44a6a2e379754d16757b
 * Model: site-content
 */

const BUILDER_API_KEY = '31241975b8be44a6a2e379754d16757b';
const BUILDER_MODEL = 'site-content';

/**
 * Fetch content from Builder.io
 */
async function loadBuilderContent() {
  try {
    // Fetch from Builder.io Content API
    const response = await fetch(
      `https://cdn.builder.io/api/v3/content/${BUILDER_MODEL}?apiKey=${BUILDER_API_KEY}&limit=1&cachebust=${Date.now()}`
    );
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const content = data.results[0].data;
      applyBuilderContent(content);
      console.log('✅ Builder.io content loaded successfully');
      return content;
    } else {
      console.log('ℹ️ No Builder.io content found, using default HTML content');
      return null;
    }
  } catch (error) {
    console.warn('⚠️ Could not load Builder.io content:', error);
    return null;
  }
}

/**
 * Apply Builder.io content to the page
 */
function applyBuilderContent(content) {
  if (!content) return;
  
  // Hero Section
  if (content.heroTitle) {
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) heroTitle.textContent = content.heroTitle;
  }
  
  if (content.heroDescription) {
    const heroDesc = document.querySelector('.hero__desc');
    if (heroDesc) heroDesc.textContent = content.heroDescription;
  }
  
  if (content.heroButtonText) {
    const heroBtn = document.querySelector('.hero__content .btn--primary');
    if (heroBtn) heroBtn.textContent = content.heroButtonText;
  }
  
  if (content.heroBackgroundImage) {
    const heroContainer = document.querySelector('.hero__container');
    if (heroContainer) {
      heroContainer.style.backgroundImage = `url('${content.heroBackgroundImage}')`;
    }
  }
  
  // Services Section
  if (content.servicesTitle) {
    const servicesTitle = document.querySelector('.services__title');
    if (servicesTitle) servicesTitle.textContent = content.servicesTitle;
  }
  
  if (content.servicesSubtitle) {
    const servicesSubtitle = document.querySelector('.services__subtitle');
    if (servicesSubtitle) servicesSubtitle.textContent = content.servicesSubtitle;
  }
  
  // Featured Section
  if (content.featuredTitle) {
    const featuredTitle = document.querySelector('.featured__title');
    if (featuredTitle) featuredTitle.textContent = content.featuredTitle;
  }
  
  if (content.featuredSubtitle) {
    const featuredDesc = document.querySelector('.featured__desc');
    if (featuredDesc) featuredDesc.textContent = content.featuredSubtitle;
  }
  
  // Add more sections as needed...
}

/**
 * Initialize Builder.io on page load
 */
function initBuilder() {
  loadBuilderContent();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBuilder);
} else {
  initBuilder();
}

// Export for external use
window.BuilderIO = {
  load: loadBuilderContent,
  apiKey: BUILDER_API_KEY,
  model: BUILDER_MODEL
};
