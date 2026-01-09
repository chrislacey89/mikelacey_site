import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool, defineLocations } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'yi6f32nh'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'mike-lacey-portfolio',
  title: 'Mike Lacey Portfolio',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: 'https://www.themikelacey.com',
        preview: '/?preview=true',
      },
      resolve: {
        locations: {
          // Site settings affect all pages
          siteSettings: defineLocations({
            message: 'This document is used on all pages',
            tone: 'caution',
            locations: [
              { title: 'Home', href: '/?preview=true' },
              { title: 'Story', href: '/story?preview=true' },
              { title: 'Work', href: '/work?preview=true' },
              { title: 'Attaboys', href: '/attaboys?preview=true' },
              { title: 'Connect', href: '/connect?preview=true' },
            ],
          }),
          // Credits appear on the Work page
          credit: defineLocations({
            select: { name: 'name' },
            resolve: (doc) => ({
              locations: [{ title: doc?.name || 'Credit', href: '/work?preview=true' }],
            }),
          }),
          // Photos appear on the Work page
          photo: defineLocations({
            select: { caption: 'image.caption' },
            resolve: (doc) => ({
              locations: [{ title: doc?.caption || 'Photo', href: '/work?preview=true' }],
            }),
          }),
          // Interviews appear on the Work page
          interview: defineLocations({
            select: { title: 'title' },
            resolve: (doc) => ({
              locations: [{ title: doc?.title || 'Interview', href: '/work?preview=true' }],
            }),
          }),
          // Timeline events appear on the Story page
          timelineEvent: defineLocations({
            select: { title: 'title', year: 'year' },
            resolve: (doc) => ({
              locations: [{ title: `${doc?.year}: ${doc?.title}` || 'Event', href: '/story?preview=true' }],
            }),
          }),
          // Testimonials appear on the Attaboys page
          testimonial: defineLocations({
            select: { caption: 'caption' },
            resolve: (doc) => ({
              locations: [{ title: doc?.caption || 'Testimonial', href: '/attaboys?preview=true' }],
            }),
          }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
