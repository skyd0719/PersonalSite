# Overview

This is a professional personal website for Kun Botond built as a full-stack web application. The project features a modern, responsive frontend showcasing consulting services with a fully functional contact form system integrated with Telegram bot notifications. It's designed as a business portfolio/landing page for Kun Botond, with sections for introduction, services, and client contact functionality. The application uses a monorepo structure with shared TypeScript schemas and implements modern web development practices.

# Recent Changes
- **2025-08-05**: Zoom integráció megvalósítva teljes automatizációval
  - **Zoom Meeting automatikus létrehozás**: Minden időpontfoglaláskor automatikusan létrejön a Zoom meeting
  - **24 órás email ütemezés**: Zoom meghívó automatikusan elküldve 24 órával a konzultáció előtt
  - **Naptári integráció**: .ics fájl automatikus generálása és csatolása az emailhez
  - **Automatikus naptárba mentés**: Email melléklettel Outlook, Google Calendar, Apple Calendar támogatás
  - **Server-to-Server OAuth**: Biztonságos Zoom API integráció
  - **Teljes email template**: Professzionális Zoom meghívó design egyedi template-tel
  - **Database kiterjesztés**: Zoom meeting adatok tárolása (ID, URL, jelszó, küldés státusz)
  - **Telegram értesítés bővítés**: Zoom meeting részletek beépítve a Telegram üzenetekbe
- **2025-08-05**: Foglalt időpontok szűrése javítva és email design optimalizálva
  - **Kritikus javítás**: Foglalt időpontok most már nem jelennek meg a naptárban
  - Napspecifikus API lekérdezések a foglalt időpontokhoz
  - Helyes időzóna kezelés (CET/CEST) UTC konverzióval
  - Email template design javítva: kék címkék + fekete értékek + fehér háttér
  - SendGrid email küldés visszaállítva és működőképes
- **2025-08-05**: Advanced booking system implemented and refined
  - **Helyesírási javítás**: "Időpont foglalás" → "Időpontfoglalás" az egész projektben
  - PostgreSQL database integration with Drizzle ORM
  - Services and appointments tables created
  - Focus on single service: 30-minute free online consultation only
  - Professional booking form with time slot selection (weekdays 9-17)
  - Telegram notifications for new appointments
  - Hero section updated to highlight "Ingyenes online konzultáció"
  - Navigation updated to "Ingyenes konzultáció"
  - Future paid services documented but commented out for later activation
- **2025-08-04**: Comprehensive SEO optimization completed
  - Meta tags, Open Graph, Twitter cards optimized
  - Structured data (Schema.org) for business information
  - Robots.txt, sitemap.xml, and manifest.json added
  - Performance hints and caching headers implemented
  - Hungarian language and geographic targeting
- **2025-08-04**: Text formatting consistency improvements (lowercase titles)
- **2025-08-04**: Copyright year updated to 2025
- **2025-08-04**: Telegram bot integration completed and tested successfully
- **2025-08-05**: Email service restored to SendGrid for reliable delivery
  - Previous experiments with MailerSend and Gmail removed
- **2025-08-04**: Contact form validates and sends notifications to Chat ID: 7518315750
- **2025-08-04**: Project ready for deployment and domain connection (botit.hu)

# User Preferences

Preferred communication style: Simple, everyday language.
Personal branding: Professional website for "Kun Botond" (replacing generic "Professzionális Consulting")
Contact information: kun.botond@icloud.com, +36 70 466 6325, Budapest és Vácrátót, Magyarország
Content preferences: Emphasizes digitalization and modernization commitment over generic qualifications

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API endpoints with structured error handling
- **Request Logging**: Custom middleware for API request/response logging
- **Development**: Hot module replacement and live reloading in development mode

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing
- **Schema Validation**: Drizzle-Zod integration for runtime type checking

## External Dependencies
- **Database**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL hosting
- **UI Framework**: Extensive Radix UI component suite for accessible, unstyled primitives
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting
- **Validation**: Zod for runtime type validation and schema definition
- **Development Tools**: Replit-specific plugins for enhanced development experience
- **Session Management**: PostgreSQL session store (connect-pg-simple) for user sessions

## Key Design Patterns
- **Monorepo Structure**: Shared schemas and types between client and server
- **Type Safety**: End-to-end TypeScript with shared validation schemas
- **Component Composition**: Modular component architecture with consistent styling patterns
- **API Integration**: Centralized API client with error handling and authentication support
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Accessibility**: ARIA-compliant components through Radix UI foundation