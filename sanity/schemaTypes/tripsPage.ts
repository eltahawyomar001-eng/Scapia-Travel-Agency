import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tripsPage',
  title: 'Trips Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
        {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Trip Categories Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'cards',
          title: 'Category Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
                {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
                {name: 'url', title: 'Link URL', type: 'string'},
                {
                  name: 'size',
                  title: 'Size',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Large', value: 'large'},
                      {title: 'Flex', value: 'flex'},
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'activities',
      title: 'Activities Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'cards',
          title: 'Activity Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
                {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
                {
                  name: 'layout',
                  title: 'Layout',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Text First', value: 'text-first'},
                      {title: 'Image First', value: 'image-first'},
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'popularDestinations',
      title: 'Popular Destinations Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {name: 'mapImage', title: 'Map Image', type: 'image'},
        {
          name: 'destinations',
          title: 'Destinations',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
                {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
                {name: 'flag', title: 'Flag Emoji', type: 'string'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'promotions',
      title: 'Promotions Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'voucher',
          title: 'Voucher',
          type: 'object',
          fields: [
            {name: 'badge', title: 'Badge Text', type: 'string'},
            {name: 'promoTitle', title: 'Promo Title', type: 'string'},
            {name: 'discountValue', title: 'Discount Value', type: 'string'},
            {name: 'discountLabel', title: 'Discount Label', type: 'string'},
            {name: 'discountNote', title: 'Discount Note', type: 'string'},
            {name: 'buttonText', title: 'Button Text', type: 'string'},
            {name: 'buttonUrl', title: 'Button URL', type: 'string'},
            {name: 'backgroundImage', title: 'Background Image', type: 'image'},
          ],
        },
      ],
    }),
    defineField({
      name: 'exploreTrips',
      title: 'Explore Trips Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
      ],
    }),
    defineField({
      name: 'howToBook',
      title: 'How To Book Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'number', title: 'Step Number', type: 'string'},
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'description', title: 'Description', type: 'text'},
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
        title: 'Trips Page',
      }
    },
  },
})
