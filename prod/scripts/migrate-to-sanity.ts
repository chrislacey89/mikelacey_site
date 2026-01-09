import { createClient } from '@sanity/client'
import { createReadStream, readFileSync, existsSync } from 'fs'
import { basename, join, dirname } from 'path'
import { fileURLToPath } from 'url'

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const projectId = process.env.SANITY_PROJECT_ID || 'yi6f32nh'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('Error: SANITY_WRITE_TOKEN environment variable is required')
  console.log('\nTo get a token:')
  console.log('1. Go to https://www.sanity.io/manage/project/yi6f32nh/api')
  console.log('2. Create a new token with Editor permissions')
  console.log('3. Run: SANITY_WRITE_TOKEN=your-token npx tsx scripts/migrate-to-sanity.ts')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Paths
const dataDir = join(__dirname, '../src/data')
const publicDir = join(__dirname, '../public')

// Helper: Read JSON file
function readJson(filename: string) {
  const path = join(dataDir, filename)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

// Helper: Upload image and return asset reference
async function uploadImage(imagePath: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null> {
  // Handle paths starting with /
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  const fullPath = join(publicDir, relativePath)

  if (!existsSync(fullPath)) {
    console.warn(`  Warning: Image not found: ${fullPath}`)
    return null
  }

  try {
    const asset = await client.assets.upload('image', createReadStream(fullPath), {
      filename: basename(fullPath),
    })
    console.log(`  Uploaded: ${basename(fullPath)}`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`  Failed to upload ${fullPath}:`, error)
    return null
  }
}

// Generate stable IDs
function generateId(type: string, originalId: string): string {
  return `${type}-${originalId.replace(/^(credit-|photo-|interview-|attaboy-|era-|link-)/, '')}`
}

// Migrate Credits
async function migrateCredits() {
  console.log('\n--- Migrating Credits ---')
  const data = readJson('work.json')

  for (const credit of data.credits) {
    const doc = {
      _id: generateId('credit', credit.id),
      _type: 'credit',
      name: credit.name,
      network: credit.network,
    }

    await client.createOrReplace(doc)
    console.log(`  Created: ${credit.name}`)
  }
  console.log(`Migrated ${data.credits.length} credits`)
}

// Migrate Photos
async function migratePhotos() {
  console.log('\n--- Migrating Photos ---')
  const data = readJson('work.json')

  for (const photo of data.photos) {
    const imageRef = await uploadImage(photo.src)

    const doc = {
      _id: generateId('photo', photo.id),
      _type: 'photo',
      image: imageRef ? {
        ...imageRef,
        alt: photo.alt,
        caption: photo.caption,
      } : undefined,
    }

    await client.createOrReplace(doc)
    console.log(`  Created: ${photo.caption}`)
  }
  console.log(`Migrated ${data.photos.length} photos`)
}

// Migrate Interviews
async function migrateInterviews() {
  console.log('\n--- Migrating Interviews ---')
  const data = readJson('work.json')

  for (const interview of data.interviews) {
    const doc = {
      _id: generateId('interview', interview.id),
      _type: 'interview',
      title: interview.title,
      description: interview.description,
      youtubeUrl: interview.youtubeUrl,
    }

    await client.createOrReplace(doc)
    console.log(`  Created: ${interview.title}`)
  }
  console.log(`Migrated ${data.interviews.length} interviews`)
}

// Migrate Timeline Events
async function migrateTimelineEvents() {
  console.log('\n--- Migrating Timeline Events ---')
  const data = readJson('story.json')

  let order = 0
  for (const event of data.timelineEvents) {
    const doc: Record<string, unknown> = {
      _id: generateId('timeline', event.id),
      _type: 'timelineEvent',
      year: event.year,
      title: event.title,
      narrative: event.narrative,
      order: order++,
    }

    if (event.photo) {
      const imageRef = await uploadImage(event.photo)
      if (imageRef) {
        doc.photo = imageRef
      }
    }

    await client.createOrReplace(doc)
    console.log(`  Created: ${event.title}`)
  }
  console.log(`Migrated ${data.timelineEvents.length} timeline events`)
}

// Migrate Testimonials
async function migrateTestimonials() {
  console.log('\n--- Migrating Testimonials ---')
  const data = readJson('attaboys.json')

  for (const testimonial of data.testimonials) {
    const imageRef = await uploadImage(testimonial.src)

    const doc = {
      _id: generateId('testimonial', testimonial.id),
      _type: 'testimonial',
      caption: testimonial.caption,
      image: imageRef ? {
        ...imageRef,
        alt: testimonial.alt,
      } : undefined,
    }

    await client.createOrReplace(doc)
    console.log(`  Created: ${testimonial.caption}`)
  }
  console.log(`Migrated ${data.testimonials.length} testimonials`)
}

// Migrate Site Settings
async function migrateSiteSettings() {
  console.log('\n--- Migrating Site Settings ---')
  const homeData = readJson('home.json')
  const connectData = readJson('connect.json')

  // Upload hero background image
  let heroBackgroundImage = null
  if (homeData.hero?.backgroundImage) {
    heroBackgroundImage = await uploadImage(homeData.hero.backgroundImage)
  }

  // Upload headshot image
  let headshotImage = null
  if (homeData.profile?.headshotImage) {
    headshotImage = await uploadImage(homeData.profile.headshotImage)
  }

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    hero: {
      backgroundImage: heroBackgroundImage,
      headline: homeData.hero?.headline,
      tagline: homeData.hero?.tagline,
    },
    profile: {
      name: homeData.profile?.name,
      title: homeData.profile?.title,
      headshotImage: headshotImage,
      subtitle: homeData.profile?.subtitle,
    },
    ctas: homeData.ctas?.map((cta: { id: string; label: string; href: string; variant: string }) => ({
      _key: cta.id,
      label: cta.label,
      href: cta.href,
      variant: cta.variant,
    })),
    contactInfo: connectData.contactInfo,
    professionalLinks: connectData.professionalLinks?.map((link: { id: string; type: string; label: string; url: string; icon: string }) => ({
      _key: link.id,
      type: link.type,
      label: link.label,
      url: link.url,
      icon: link.icon,
    })),
    sectionContent: connectData.sectionContent,
  }

  await client.createOrReplace(doc)
  console.log('  Created: Site Settings')
}

// Main migration function
async function migrate() {
  console.log('=== Starting Sanity Migration ===')
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)

  try {
    await migrateCredits()
    await migratePhotos()
    await migrateInterviews()
    await migrateTimelineEvents()
    await migrateTestimonials()
    await migrateSiteSettings()

    console.log('\n=== Migration Complete ===')
    console.log('Visit your Sanity Studio to verify the data:')
    console.log('http://localhost:4321/studio')
  } catch (error) {
    console.error('\nMigration failed:', error)
    process.exit(1)
  }
}

migrate()
