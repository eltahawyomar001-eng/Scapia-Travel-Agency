import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
        {name: 'buttonText', title: 'Button Text', type: 'string'},
        {name: 'buttonUrl', title: 'Button URL', type: 'string'},
        {name: 'backgroundImage', title: 'Background Image', type: 'image'},
        {
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'number', title: 'Number', type: 'string'},
                {name: 'label', title: 'Label', type: 'string'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'services',
      title: 'Services Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'cards',
          title: 'Service Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'icon', title: 'Icon', type: 'string'},
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featuredTrips',
      title: 'Featured Trips Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {name: 'viewAllText', title: 'View All Button Text', type: 'string'},
        {name: 'viewAllUrl', title: 'View All URL', type: 'string'},
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
                {name: 'alt', title: 'Alt Text', type: 'string'},
                {name: 'location', title: 'Location', type: 'string'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'whyChoose',
      title: 'Why Choose Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'icon', title: 'Icon', type: 'string'},
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'items',
          title: 'Testimonials',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'quote', title: 'Quote', type: 'text'},
                {name: 'author', title: 'Author Name', type: 'string'},
                {name: 'role', title: 'Author Role', type: 'string'},
                {name: 'image', title: 'Author Image', type: 'image'},
                {name: 'rating', title: 'Rating', type: 'number', validation: (Rule) => Rule.min(1).max(5)},
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
      }
    },
  },
})
