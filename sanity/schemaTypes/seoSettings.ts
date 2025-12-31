import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'SEO Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'defaultTitle',
      title: 'Default Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'titleSeparator',
      title: 'Title Separator',
      type: 'string',
      initialValue: ' | ',
    }),
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'defaultDescription',
      title: 'Default Meta Description',
      type: 'text',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
    }),
    defineField({
      name: 'pages',
      title: 'Page SEO',
      type: 'object',
      fields: [
        {
          name: 'home',
          title: 'Home',
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
        {
          name: 'about',
          title: 'About',
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
        {
          name: 'trips',
          title: 'Trips',
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
        {
          name: 'contact',
          title: 'Contact',
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'SEO Settings',
      }
    },
  },
})
