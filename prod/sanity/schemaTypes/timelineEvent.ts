import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const timelineEventType = defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'timelineEvent' }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showYear',
      title: 'Show Year',
      type: 'boolean',
      description: 'Display the year label on the story page',
      initialValue: false,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'narrative',
      title: 'Narrative',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
    },
  },
})
