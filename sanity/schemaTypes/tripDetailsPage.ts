import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tripDetailsPage',
  title: 'Trip Details Page',
  type: 'document',
  fields: [
    defineField({
      name: 'settings',
      title: 'Page Settings',
      type: 'object',
      fields: [
        {name: 'bookButtonText', title: 'Book Button Text', type: 'string', initialValue: 'Book This Trip'},
        {name: 'includesTitle', title: 'Includes Section Title', type: 'string', initialValue: "What's Included"},
        {name: 'itineraryTitle', title: 'Itinerary Section Title', type: 'string', initialValue: 'Day-by-Day Itinerary'},
        {name: 'galleryTitle', title: 'Gallery Section Title', type: 'string', initialValue: 'Trip Gallery'},
      ],
    }),
    defineField({
      name: 'labels',
      title: 'Info Labels',
      type: 'object',
      fields: [
        {name: 'duration', title: 'Duration Label', type: 'string', initialValue: 'Duration'},
        {name: 'groupSize', title: 'Group Size Label', type: 'string', initialValue: 'Group Size'},
        {name: 'tourType', title: 'Tour Type Label', type: 'string', initialValue: 'Tour Type'},
        {name: 'accommodation', title: 'Accommodation Label', type: 'string', initialValue: 'Accommodation'},
        {name: 'price', title: 'Price Label', type: 'string', initialValue: 'Starting From'},
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Trip Details Page Settings',
      }
    },
  },
})
