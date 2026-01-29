import { defineType, defineField } from 'sanity'

export const interviewType = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'videoType',
      title: 'Video Type',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Direct Video (MP4, etc.)', value: 'direct' },
        ],
        layout: 'radio',
      },
      initialValue: 'youtube',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      hidden: ({ parent }) => parent?.videoType !== 'youtube',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { videoType?: string }
          if (parent?.videoType === 'youtube' && !value) {
            return 'YouTube URL is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'directVideoUrl',
      title: 'Direct Video URL',
      type: 'url',
      description: 'URL to an MP4 or other video file',
      hidden: ({ parent }) => parent?.videoType !== 'direct',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { videoType?: string }
          if (parent?.videoType === 'direct' && !value) {
            return 'Direct video URL is required'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
