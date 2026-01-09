import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'yi6f32nh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
})

const pageContent = {
  storyPage: {
    eyebrow: 'The Journey',
    title: 'My Story',
    intro: "From the shipping department to the director's chair — a career built on passion, perseverance, and making every show the best it can be.",
    footer: {
      heading: 'Ready to see the work?',
      paragraph: 'Explore my portfolio of credits, photos, and interviews from over four decades in television production.',
      primaryCtaLabel: 'See My Work',
      primaryCtaHref: '/work',
      secondaryCtaLabel: 'Get in Touch',
      secondaryCtaHref: '/connect'
    }
  },
  workPage: {
    eyebrow: 'Portfolio',
    title: 'My Work',
    intro: 'Years of television production — from camera operation to directing major sports and entertainment broadcasts.',
    creditsHeading: 'Production Credits',
    photosHeading: 'Behind the Scenes',
    videosHeading: 'Video Interviews',
    footer: {
      heading: "Let's Collaborate",
      paragraph: "Looking for an experienced director for your next production? I'd love to hear about your project.",
      ctaLabel: 'Get in Touch',
      ctaHref: '/connect'
    }
  },
  attaboysPage: {
    eyebrow: 'Recognition',
    title: 'Attaboys',
    intro: 'Thank-you notes, letters, and recognition from colleagues and industry professionals.',
    footer: {
      heading: "Let's Create Something Great",
      paragraph: "Ready to work with a director who's passionate about making every show the best it can be?",
      ctaLabel: 'Get in Touch',
      ctaHref: '/connect'
    }
  }
}

async function migrate() {
  console.log('Updating siteSettings with page content...')

  // Get the existing siteSettings document
  const settings = await client.fetch(`*[_type == "siteSettings"][0]._id`)

  if (!settings) {
    console.error('No siteSettings document found!')
    return
  }

  // Patch the document with page content
  await client
    .patch(settings)
    .set(pageContent)
    .commit()

  console.log('Done! Page content has been added to siteSettings.')
}

migrate().catch(console.error)
