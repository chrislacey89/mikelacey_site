import { defineType, defineField } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
        }),
        defineField({
          name: 'tagline',
          title: 'Tagline',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'profile',
      title: 'Profile',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'headshotImage',
          title: 'Headshot Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'ctas',
      title: 'Call to Action Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
            }),
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({ name: 'fullName', title: 'Full Name', type: 'string' }),
        defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
        defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'phoneDisplay', title: 'Phone Display', type: 'string' }),
        defineField({ name: 'website', title: 'Website', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'imdb', title: 'IMDb', type: 'url' }),
      ],
    }),
    defineField({
      name: 'professionalLinks',
      title: 'Professional Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'type', title: 'Type', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'string' }),
            defineField({ name: 'icon', title: 'Icon', type: 'string' }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'sectionContent',
      title: 'Connect Page Content',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro', type: 'text' }),
      ],
    }),
    defineField({
      name: 'storyPage',
      title: 'Story Page',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow Text', type: 'string' }),
        defineField({ name: 'title', title: 'Page Title', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text' }),
        defineField({
          name: 'footer',
          title: 'Footer Section',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'paragraph', title: 'Paragraph', type: 'text' }),
            defineField({ name: 'primaryCtaLabel', title: 'Primary Button Label', type: 'string' }),
            defineField({ name: 'primaryCtaHref', title: 'Primary Button Link', type: 'string' }),
            defineField({ name: 'secondaryCtaLabel', title: 'Secondary Button Label', type: 'string' }),
            defineField({ name: 'secondaryCtaHref', title: 'Secondary Button Link', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'workPage',
      title: 'Work Page',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow Text', type: 'string' }),
        defineField({ name: 'title', title: 'Page Title', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text' }),
        defineField({ name: 'creditsHeading', title: 'Credits Section Heading', type: 'string' }),
        defineField({ name: 'photosHeading', title: 'Photos Section Heading', type: 'string' }),
        defineField({ name: 'videosHeading', title: 'Videos Section Heading', type: 'string' }),
        defineField({
          name: 'footer',
          title: 'Footer Section',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'paragraph', title: 'Paragraph', type: 'text' }),
            defineField({ name: 'ctaLabel', title: 'Button Label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Button Link', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'attaboysPage',
      title: 'Attaboys Page',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow Text', type: 'string' }),
        defineField({ name: 'title', title: 'Page Title', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text' }),
        defineField({
          name: 'footer',
          title: 'Footer Section',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'paragraph', title: 'Paragraph', type: 'text' }),
            defineField({ name: 'ctaLabel', title: 'Button Label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Button Link', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
