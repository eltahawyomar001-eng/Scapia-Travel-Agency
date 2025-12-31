import trip from './trip'
import globalSettings from './globalSettings'
import homepage from './homepage'
import aboutPage from './aboutPage'
import tripsPage from './tripsPage'
import contactPage from './contactPage'
import tripDetailsPage from './tripDetailsPage'
import seoSettings from './seoSettings'

export const schemaTypes = [
  // Document types
  trip,
  
  // Singleton settings (one document each)
  globalSettings,
  homepage,
  aboutPage,
  tripsPage,
  contactPage,
  tripDetailsPage,
  seoSettings,
]
