# Data Model

## Overview

Mike Lacey's portfolio uses a simple, flat data model with standalone entities. There are no complex relationships or cross-references between entities — each piece of content can be displayed independently.

## Entities

### TimelineEvent

A milestone in Mike's 44-year career journey. Represents significant moments like starting a new job, moving to a new city, learning a new skill, or career breakthroughs.

**Used in:** Story section (scrolling timeline)

### Credit

A production, show, or project Mike worked on. Includes the role he played, the network or client, and basic metadata.

**Used in:** Work section (credits grid)

### Photo

A career moment captured in an image. Includes the image source, alt text, and caption.

**Used in:** Work section (photo gallery), Story section (optional era photos)

### Interview

A video interview featuring Mike, hosted on YouTube. Includes the video URL, title, and description.

**Used in:** Work section (video embeds)

### Testimonial

An "attaboy" document — a photo of a thank-you note, letter, or recognition from colleagues and industry professionals.

**Used in:** Kudos section (document gallery)

### ContactInfo

Mike's contact details used for the vCard QR code and contact page. Includes name, phone, email, website, and social profile URLs.

**Used in:** Connect section (vCard, professional links)

## Relationships

All entities are **standalone** with no cross-references. This keeps the data simple to manage and allows each piece of content to be displayed independently across the site.

## Notes

- This is a static portfolio site — data can be stored as JSON files, in a CMS, or in a simple database
- Images are referenced by path/URL — host them wherever convenient
- YouTube videos are embedded via URL — no video hosting needed
