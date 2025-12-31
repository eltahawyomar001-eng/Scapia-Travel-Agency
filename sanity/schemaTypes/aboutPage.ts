import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
        {
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [{type: 'image', options: {hotspot: true}}],
        },
      ],
    }),
    defineField({
      name: 'collective',
      title: 'Collective Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
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
      name: 'partners',
      title: 'Partner Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'logo', title: 'Logo Image', type: 'image'},
          ],
        },
      ],
    }),
    defineField({
      name: 'storyTimeline',
      title: 'Story Timeline Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [{type: 'image', options: {hotspot: true}}],
        },
        {
          name: 'items',
          title: 'Timeline Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'year', title: 'Year', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
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
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'team',
      title: 'Team Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'members',
          title: 'Team Members',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'name', title: 'Name', type: 'string'},
                {name: 'role', title: 'Role', type: 'string'},
                {name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}},
                {
                  name: 'social',
                  title: 'Social Links',
                  type: 'object',
                  fields: [
                    {name: 'facebook', title: 'Facebook', type: 'string'},
                    {name: 'linkedin', title: 'LinkedIn', type: 'string'},
                    {name: 'instagram', title: 'Instagram', type: 'string'},
                  ],
                },
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
        title: 'About Page',
      }
    },
  },
})
