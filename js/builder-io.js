/**
 * Builder.io Integration for SCAPIA Travel Website
 * Enables visual editing for clients - Webflow-like experience
 * 
 * API Key: 31241975b8be44a6a2e379754d16757b
 */

const BUILDER_API_KEY = '31241975b8be44a6a2e379754d16757b';

/**
 * Initialize Builder.io
 */
async function initBuilder() {
  // Check if we're in the Builder.io visual editor
  const isEditing = window.location.search.includes('builder.preview');
  
  if (isEditing) {
    console.log('🎨 Builder.io Editor Mode Active');
  }
  
  // Load content for the current page
  await loadBuilderContent();
}

/**
 * Get the current page path for Builder.io
 */
function getCurrentPagePath() {
  let path = window.location.pathname;
  
  // Normalize path
  if (path === '/' || path === '/index.html') {
    return '/';
  }
  
  // Remove .html extension for cleaner URLs
  return path.replace('.html', '');
}

/**
 * Load Builder.io content for the current page
 */
async function loadBuilderContent() {
  const pagePath = getCurrentPagePath();
  
  try {
    // Fetch page content from Builder.io
    const response = await fetch(
      `https://cdn.builder.io/api/v3/content/page?apiKey=${BUILDER_API_KEY}&url=${encodeURIComponent(pagePath)}&cachebust=true`
    );
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const content = data.results[0].data;
      applyBuilderContent(content);
      console.log('✅ Builder.io content loaded');
    } else {
      console.log('ℹ️ No Builder.io content for this page, using defaults');
    }
  } catch (error) {
    console.warn('⚠️ Could not load Builder.io content:', error);
  }
}

/**
 * Apply Builder.io content to the page
 */
function applyBuilderContent(content) {
  if (!content) return;
  
  // Hero Section
  if (content.hero) {
    if (content.hero.title) {
      const heroTitle = document.querySelector('.hero__title');
      if (heroTitle) heroTitle.textContent = content.hero.title;
    }
    if (content.hero.description) {
      const heroDesc = document.querySelector('.hero__desc');
      if (heroDesc) heroDesc.textContent = content.hero.description;
    }
    if (content.hero.buttonText) {
      const heroBtn = document.querySelector('.hero__content .btn--primary');
      if (heroBtn) heroBtn.textContent = content.hero.buttonText;
    }
    if (content.hero.backgroundImage) {
      const heroContainer = document.querySelector('.hero__container');
      if (heroContainer) {
        heroContainer.style.backgroundImage = `url('${content.hero.backgroundImage}')`;
      }
    }
  }
  
  // Services Section
  if (content.services) {
    if (content.services.title) {
      const servicesTitle = document.querySelector('.services__title');
      if (servicesTitle) servicesTitle.textContent = content.services.title;
    }
    if (content.services.subtitle) {
      const servicesSubtitle = document.querySelector('.services__subtitle');
      if (servicesSubtitle) servicesSubtitle.textContent = content.services.subtitle;
    }
  }
  
  // Featured Section
  if (content.featured) {
    if (content.featured.title) {
      const featuredTitle = document.querySelector('.featured__title');
      if (featuredTitle) featuredTitle.textContent = content.featured.title;
    }
  }
  
  // Add more sections as needed...
}

/**
 * Register editable components with Builder.io
 * This enables inline editing in the visual editor
 */
function registerEditableElements() {
  // Mark elements as editable for Builder.io
  const editableElements = [
    { selector: '.hero__title', field: 'hero.title' },
    { selector: '.hero__desc', field: 'hero.description' },
    { selector: '.services__title', field: 'services.title' },
    { selector: '.services__subtitle', field: 'services.subtitle' },
    { selector: '.featured__title', field: 'featured.title' },
    // Add more editable elements
  ];
  
  editableElements.forEach(({ selector, field }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('data-builder-editable', field);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    registerEditableElements();
    initBuilder();
  });
} else {
  registerEditableElements();
  initBuilder();
}

// Export for external use
window.BuilderIO = {
  init: initBuilder,
  loadContent: loadBuilderContent,
  apiKey: BUILDER_API_KEY
};
