import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'trip',
  title: 'Trips',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'markdown',
    }),
    defineField({
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "7 Days / 6 Nights"',
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      type: 'string',
    }),
    defineField({
      name: 'groupSize',
      title: 'Group Size',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Family Holidays', value: 'family'},
          {title: 'Adventure Travel', value: 'adventure'},
          {title: 'Beach Getaways', value: 'beach'},
          {title: 'Nature Escapes', value: 'nature'},
          {title: 'Cultural Tours', value: 'cultural'},
          {title: 'Romantic Getaways', value: 'romantic'},
          {title: 'Island Retreats', value: 'island'},
        ],
      },
    }),
    defineField({
      name: 'tourType',
      title: 'Tour Type',
      type: 'string',
    }),
    defineField({
      name: 'accommodation',
      title: 'Accommodation',
      type: 'string',
    }),
    defineField({
      name: 'included',
      title: "What's Included",
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'day', title: 'Day', type: 'number'},
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Is Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bestSeller',
      title: 'Is Best Seller',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'nextDate',
      title: 'Next Available Date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'destination',
      media: 'image',
    },
  },
})
