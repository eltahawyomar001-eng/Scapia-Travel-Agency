import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {markdownSchema} from 'sanity-plugin-markdown'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SCAPIA Travel',

  projectId: 'klhue3lk',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Trips section
            S.listItem()
              .title('Trips')
              .child(S.documentTypeList('trip').title('All Trips')),
            S.divider(),
            // Settings section
            S.listItem()
              .title('Global Settings')
              .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
            S.listItem()
              .title('Homepage')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem()
              .title('About Page')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Trips Page')
              .child(S.document().schemaType('tripsPage').documentId('tripsPage')),
            S.listItem()
              .title('Contact Page')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.listItem()
              .title('Trip Details Page')
              .child(S.document().schemaType('tripDetailsPage').documentId('tripDetailsPage')),
            S.divider(),
            S.listItem()
              .title('SEO Settings')
              .child(S.document().schemaType('seoSettings').documentId('seoSettings')),
          ]),
    }),
    visionTool(),
    markdownSchema(),
  ],

  schema: {
    types: schemaTypes,
  },
})
