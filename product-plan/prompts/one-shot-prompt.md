# One-Shot Implementation Prompt

I need you to implement a complete web application based on detailed design specifications and UI components I'm providing.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary with sections and data model overview
2. **@product-plan/instructions/one-shot-instructions.md** — Complete implementation instructions for all milestones

After reading these, also review:
- **@product-plan/design-system/** — Color and typography tokens
- **@product-plan/data-model/** — Entity types and relationships
- **@product-plan/shell/** — Application shell components
- **@product-plan/sections/** — All section components, types, sample data, and test instructions

## Before You Begin

Please ask me clarifying questions about:

1. **Authentication & Authorization**
   - This is a public portfolio site — no login needed
   - Should there be an admin interface for managing content?

2. **User & Account Modeling**
   - This is Mike's personal portfolio (single-user, public site)
   - How should contact form submissions be handled? (Email, database, third-party service?)

3. **Tech Stack Preferences**
   - What frontend framework/meta-framework should I use? (Next.js, Vite, Remix, etc.)
   - What backend/hosting platform do you prefer? (Vercel, Netlify, self-hosted?)
   - Should the contact form use a serverless function, third-party form service, or backend API?

4. **Backend Business Logic**
   - How should contact form submissions be processed and stored?
   - Should there be email notifications when someone submits the form?
   - Any analytics or tracking requirements?

5. **Content Management**
   - Should content be editable through a CMS, or static/hardcoded?
   - Where should images and media be hosted?

6. **Any Other Clarifications**
   - Questions about specific features or user flows
   - Edge cases that need clarification
   - Integration requirements (analytics, SEO, social sharing)

Lastly, be sure to ask me if I have any other notes to add for this implementation.

Once I answer your questions, create a comprehensive implementation plan before coding.
