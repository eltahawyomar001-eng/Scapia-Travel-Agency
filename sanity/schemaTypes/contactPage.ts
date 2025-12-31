import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
          name: 'contactInfo',
          title: 'Contact Info',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'label', title: 'Label', type: 'string'},
                {name: 'value', title: 'Value', type: 'string'},
                {
                  name: 'type',
                  title: 'Type',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Email', value: 'email'},
                      {title: 'Phone', value: 'phone'},
                      {title: 'Address', value: 'address'},
                    ],
                  },
                },
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
      ],
    }),
    defineField({
      name: 'form',
      title: 'Form Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {
          name: 'fields',
          title: 'Fields',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'label', title: 'Label', type: 'string'},
                {name: 'placeholder', title: 'Placeholder', type: 'string'},
                {
                  name: 'type',
                  title: 'Type',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Text', value: 'text'},
                      {title: 'Email', value: 'email'},
                      {title: 'Phone', value: 'tel'},
                      {title: 'Select', value: 'select'},
                      {title: 'Textarea', value: 'textarea'},
                      {title: 'Date', value: 'date'},
                    ],
                  },
                },
                {name: 'required', title: 'Required', type: 'boolean', initialValue: true},
                {
                  name: 'options',
                  title: 'Options (for select fields)',
                  type: 'array',
                  of: [{type: 'string'}],
                },
              ],
            },
          ],
        },
        {name: 'submitText', title: 'Submit Button Text', type: 'string'},
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ Section',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {
          name: 'questions',
          title: 'Questions',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'question', title: 'Question', type: 'string'},
                {name: 'answer', title: 'Answer', type: 'text'},
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
        title: 'Contact Page',
      }
    },
  },
})
