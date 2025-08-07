# Overview

This is a full-stack React application for Khushalipur - a real estate landing page focused on agricultural land investment near Dehradun. The application showcases amenities, investment calculators, testimonials, and provides comprehensive site visit booking functionality with automated email notifications. It features a comprehensive brochure management system with download tracking, admin analytics dashboard, and dedicated pages for videos and documentation. Built with a modern UI design using shadcn/ui components and Tailwind CSS.

## Recent Updates (August 2025)
- ✅ Fixed main menu "Book Visit" form submission error
- ✅ Enhanced email notifications with professional formatting and spam prevention
- ✅ Improved admin alert emails for better inbox delivery
- ✅ Both booking forms (main menu + contact section) fully operational
- ✅ Updated website logo with new Felicity Hills branding
- ✅ Added comprehensive About page with company information and project portfolio
- ✅ Ready for deployment to custom domain (felicityhills.com)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing with a simple structure (Home and NotFound pages)
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Styling**: Tailwind CSS with CSS custom properties for theming, configured for both light and dark modes

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API with JSON responses
- **Data Storage**: In-memory storage implementation with interface-based design for easy database migration
- **Development**: Vite integration for hot module replacement and development server
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Database Design
- **Schema**: Defined using Drizzle ORM with PostgreSQL dialect connected to Neon Database
- **Tables**: Six main entities - plots, siteVisits, testimonials, brochures, videos, brochureDownloads, users
- **Validation**: Zod schemas for runtime type validation matching database schema
- **Current Implementation**: DatabaseStorage class with PostgreSQL persistence and comprehensive brochure download tracking

## API Structure
- `GET /api/plots` - Retrieve all available plots with pricing and features
- `GET /api/testimonials` - Fetch customer testimonials and success stories  
- `POST /api/site-visits` - Create new site visit booking with email notifications (user confirmation + admin alert)
- `GET /api/brochures` - Retrieve all available brochures for download
- `POST /api/brochures/:id/download` - Track brochure downloads with user details
- `GET /api/admin/brochure-downloads` - Admin endpoint for download tracking data
- `GET /api/admin/brochure-stats` - Admin endpoint for download analytics and statistics
- `GET /api/videos` - Fetch project videos and testimonials

## Component Architecture
- **Layout**: Modular component structure with Navigation, Hero, and Footer
- **Sections**: Dedicated components for each landing page section (Amenities, Plots, Calculator, etc.)
- **UI Components**: Reusable shadcn/ui components with consistent styling and accessibility
- **Responsive Design**: Mobile-first approach with responsive breakpoints

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter), React Hook Form
- **Build Tools**: Vite with TypeScript support, esbuild for production builds
- **Development**: tsx for TypeScript execution, hot module replacement

## UI and Styling
- **Component Library**: Radix UI primitives (@radix-ui/*) for accessible components
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Animations**: Embla Carousel for interactive carousels

## Data and Validation
- **Database**: Drizzle ORM with PostgreSQL support, Neon Database serverless
- **Validation**: Zod for schema validation and type inference
- **HTTP Client**: Built-in fetch with TanStack Query for caching and state management

## Development and Deployment
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Utilities**: date-fns for date manipulation, nanoid for ID generation
- **Replit Integration**: Specialized plugins for Replit development environment