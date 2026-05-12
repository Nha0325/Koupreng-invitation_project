# VetCRM - Veterinary Clinic Management System

A comprehensive CRM solution for veterinary clinics built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

### Dashboard
- Overview of key metrics (total pets, owners, today's appointments)
- Recent appointments list
- Quick action buttons for common tasks

### Pets Management
- Full CRUD operations for pet records
- Filter by species (All, Dogs, Cats, Birds, Rabbits, Other)
- Detailed pet profiles with medical history
- Link pets to their owners

### Owners/Clients
- Contact directory with search functionality
- View linked pets and appointment history
- Add notes and communication records

### Appointments
- Schedule and manage appointments
- Filter by status (Scheduled, Confirmed, In Progress, Completed, Cancelled)
- Filter by type (Checkup, Vaccination, Surgery, Dental, Emergency, Grooming, Follow-up)
- Quick status updates

### Medical Records
- Comprehensive medical record management
- Record types: Vaccination, Diagnosis, Prescription, Surgery, Lab Result, Treatment
- Link records to pets with full history tracking

### AI Assistant
- Built-in chatbot powered by Vercel AI SDK and AI Gateway
- Configurable model selection (Claude Opus 4.5 default, Claude Sonnet 4, GPT-4o, and more)
- Adjustable temperature and custom system prompts
- Veterinary clinic context for relevant assistance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: SWR
- **AI**: Vercel AI SDK with AI Gateway
- **Icons**: Lucide React

## Project Structure

```
/app
  /api/chat          # AI chat API route
  /appointments      # Appointments page
  /assistant         # AI assistant page
  /medical-records   # Medical records page
  /owners            # Owners management
    /[id]            # Owner detail page
  /pets              # Pets management
    /[id]            # Pet detail page
  /settings          # Settings page
  page.tsx           # Dashboard

/components
  /appointments      # Appointment components
  /assistant         # AI assistant components
  /dashboard         # Dashboard components
  /medical-records   # Medical record components
  /owners            # Owner components
  /pets              # Pet components
  /settings          # Settings components
  /ui                # shadcn/ui components
  app-header.tsx     # Header with breadcrumbs
  app-layout.tsx     # Main layout wrapper
  app-sidebar.tsx    # Desktop sidebar
  mobile-nav.tsx     # Mobile navigation

/lib
  data-store.ts      # In-memory data store with CRUD operations
  mock-data.ts       # Sample data for development
  types.ts           # TypeScript type definitions
  utils.ts           # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Database Integration

This project uses an in-memory data store for demonstration. To connect to a real database:

1. Add a database integration (Supabase, Neon, etc.) via the Vercel dashboard
2. Replace the mock data store functions in `/lib/data-store.ts` with actual database queries
3. Create the necessary database tables using the types defined in `/lib/types.ts`

## AI Assistant Configuration

The AI assistant uses the Vercel AI Gateway, which requires no additional API key setup. To customize:

1. Navigate to Settings > AI Assistant Settings
2. Select your preferred model
3. Adjust the temperature (0 = deterministic, 1 = creative)
4. Modify the system prompt for specialized behavior

## License

MIT
