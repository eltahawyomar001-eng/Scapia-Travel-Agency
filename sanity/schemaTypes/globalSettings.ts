import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'SCAPIA',
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'object',
      fields: [
        {name: 'logo', title: 'Logo Text', type: 'string', initialValue: 'SCAPIA'},
        {
          name: 'links',
          title: 'Navigation Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'label', title: 'Label', type: 'string'},
                {name: 'url', title: 'URL', type: 'string'},
              ],
            },
          ],
        },
        {name: 'langButton', title: 'Language Button Text', type: 'string', initialValue: 'EN'},
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        {name: 'description', title: 'Brand Description', type: 'text'},
        {name: 'address', title: 'Address', type: 'string'},
        {name: 'phone', title: 'Phone', type: 'string'},
        {name: 'email', title: 'Email', type: 'string'},
        {
          name: 'quickLinks',
          title: 'Quick Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'label', title: 'Label', type: 'string'},
                {name: 'url', title: 'URL', type: 'string'},
              ],
            },
          ],
        },
        {
          name: 'socialLinks',
          title: 'Social Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'platform', title: 'Platform', type: 'string'},
                {name: 'url', title: 'URL', type: 'string'},
                {name: 'abbr', title: 'Abbreviation', type: 'string'},
              ],
            },
          ],
        },
        {name: 'newsletterText', title: 'Newsletter Text', type: 'text'},
        {name: 'newsletterButton', title: 'Newsletter Button Text', type: 'string', initialValue: 'Send'},
        {name: 'copyright', title: 'Copyright Text', type: 'string'},
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'string'},
        {name: 'buttonText', title: 'Button Text', type: 'string'},
        {name: 'buttonUrl', title: 'Button URL', type: 'string'},
        {name: 'backgroundImage', title: 'Background Image', type: 'image'},
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Settings',
      }
    },
  },
})
