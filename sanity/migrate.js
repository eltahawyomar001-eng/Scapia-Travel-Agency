/**
 * Sanity Migration Script
 * Migrates content from DecapCMS JSON files to Sanity
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'klhue3lk',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // Need to set this
  useCdn: false,
});

// Read JSON files
const contentPath = path.join(__dirname, '../content/settings');

async function migrate() {
  console.log('Starting migration...');

  // Read homepage.json
  const homepageData = JSON.parse(fs.readFileSync(path.join(contentPath, 'homepage.json'), 'utf8'));
  
  // Create homepage document
  const homepage = {
    _id: 'homepage',
    _type: 'homepage',
    hero: {
      title: homepageData.hero?.title,
      description: homepageData.hero?.description,
      buttonText: homepageData.hero?.buttonText,
      buttonUrl: homepageData.hero?.buttonUrl,
      stats: homepageData.hero?.stats,
    },
    services: {
      title: homepageData.services?.title,
      subtitle: homepageData.services?.subtitle,
      cards: homepageData.services?.cards,
    },
    featuredTrips: homepageData.featuredTrips,
    gallery: {
      title: homepageData.gallery?.title,
      subtitle: homepageData.gallery?.subtitle,
    },
    whyChoose: {
      title: homepageData.whyChoose?.title,
      subtitle: homepageData.whyChoose?.subtitle,
      cards: homepageData.whyChoose?.cards,
    },
    testimonials: {
      title: homepageData.testimonials?.title,
      subtitle: homepageData.testimonials?.subtitle,
      items: homepageData.testimonials?.items?.map(item => ({
        quote: item.quote,
        author: item.author,
        role: item.role,
        rating: item.rating,
      })),
    },
  };

  try {
    await client.createOrReplace(homepage);
    console.log('✓ Homepage created');
  } catch (err) {
    console.error('Error creating homepage:', err.message);
  }

  // Read global.json
  try {
    const globalData = JSON.parse(fs.readFileSync(path.join(contentPath, 'global.json'), 'utf8'));
    
    const globalSettings = {
      _id: 'globalSettings',
      _type: 'globalSettings',
      siteName: globalData.siteName,
      navigation: globalData.navigation,
      footer: globalData.footer,
      cta: globalData.cta,
    };

    await client.createOrReplace(globalSettings);
    console.log('✓ Global Settings created');
  } catch (err) {
    console.error('Error with global settings:', err.message);
  }

  // Read about.json
  try {
    const aboutData = JSON.parse(fs.readFileSync(path.join(contentPath, 'about.json'), 'utf8'));
    
    const aboutPage = {
      _id: 'aboutPage',
      _type: 'aboutPage',
      hero: aboutData.hero,
      collective: aboutData.collective,
      partners: aboutData.partners,
      storyTimeline: aboutData.storyTimeline,
      whyChoose: aboutData.whyChoose,
      team: aboutData.team,
    };

    await client.createOrReplace(aboutPage);
    console.log('✓ About Page created');
  } catch (err) {
    console.error('Error with about page:', err.message);
  }

  // Read contact.json
  try {
    const contactData = JSON.parse(fs.readFileSync(path.join(contentPath, 'contact.json'), 'utf8'));
    
    const contactPage = {
      _id: 'contactPage',
      _type: 'contactPage',
      hero: contactData.hero,
      form: contactData.form,
      faq: contactData.faq,
    };

    await client.createOrReplace(contactPage);
    console.log('✓ Contact Page created');
  } catch (err) {
    console.error('Error with contact page:', err.message);
  }

  // Read trips-page.json
  try {
    const tripsData = JSON.parse(fs.readFileSync(path.join(contentPath, 'trips-page.json'), 'utf8'));
    
    const tripsPage = {
      _id: 'tripsPage',
      _type: 'tripsPage',
      hero: tripsData.hero,
      categories: tripsData.categories,
      activities: tripsData.activities,
      popularDestinations: tripsData.popularDestinations,
      promotions: tripsData.promotions,
      exploreTrips: tripsData.exploreTrips,
      howToBook: tripsData.howToBook,
    };

    await client.createOrReplace(tripsPage);
    console.log('✓ Trips Page created');
  } catch (err) {
    console.error('Error with trips page:', err.message);
  }

  // Read trip-details.json
  try {
    const tripDetailsData = JSON.parse(fs.readFileSync(path.join(contentPath, 'trip-details.json'), 'utf8'));
    
    const tripDetailsPage = {
      _id: 'tripDetailsPage',
      _type: 'tripDetailsPage',
      settings: tripDetailsData.settings,
      labels: tripDetailsData.labels,
    };

    await client.createOrReplace(tripDetailsPage);
    console.log('✓ Trip Details Page created');
  } catch (err) {
    console.error('Error with trip details page:', err.message);
  }

  // Read seo.json
  try {
    const seoData = JSON.parse(fs.readFileSync(path.join(contentPath, 'seo.json'), 'utf8'));
    
    const seoSettings = {
      _id: 'seoSettings',
      _type: 'seoSettings',
      defaultTitle: seoData.defaultTitle,
      titleSeparator: seoData.titleSeparator,
      siteName: seoData.siteName,
      defaultDescription: seoData.defaultDescription,
      twitterHandle: seoData.twitterHandle,
      pages: seoData.pages,
    };

    await client.createOrReplace(seoSettings);
    console.log('✓ SEO Settings created');
  } catch (err) {
    console.error('Error with SEO settings:', err.message);
  }

  console.log('\nMigration complete!');
}

migrate().catch(console.error);
