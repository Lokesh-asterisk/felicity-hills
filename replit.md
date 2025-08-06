# Overview

This is a full-stack React application for Khushalipur - a real estate landing page focused on agricultural land investment near Dehradun. The application showcases available plots, amenities, investment calculators, testimonials, and provides site visit booking functionality. It's built as a single-page application with a modern UI design using shadcn/ui components and Tailwind CSS.

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
- **Schema**: Defined using Drizzle ORM with PostgreSQL dialect
- **Tables**: Three main entities - plots, siteVisits, and testimonials
- **Validation**: Zod schemas for runtime type validation matching database schema
- **Current Implementation**: MemStorage class with sample data for development

## API Structure
- `GET /api/plots` - Retrieve all available plots with pricing and features
- `GET /api/testimonials` - Fetch customer testimonials and success stories  
- `POST /api/site-visits` - Create new site visit booking with form validation

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