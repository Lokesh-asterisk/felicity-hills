# **Felicity Hills Project - Complete Technology Stack Guide**

## 🏗️ **Core Architecture**

### **Frontend Framework**
- **React 18.3.1** - Modern JavaScript library for building user interfaces
  - Uses functional components with hooks
  - Concurrent rendering features for better performance
  - Built-in state management and lifecycle methods

- **TypeScript 5.6.3** - Strongly typed superset of JavaScript
  - Provides compile-time type checking
  - Better IDE support with autocomplete and error detection
  - Safer refactoring and maintenance

### **Build System & Development**
- **Vite 5.4.19** - Ultra-fast build tool and development server
  - Hot Module Replacement (HMR) for instant updates
  - ESBuild for lightning-fast compilation
  - Tree shaking for optimized bundle sizes
  - Native TypeScript support

- **ESBuild 0.25.0** - Extremely fast JavaScript bundler
  - Used for production builds
  - Native Go implementation for speed
  - Code splitting and minification

## 🎨 **UI & Design System**

### **Styling Framework**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
  - Custom color system with CSS variables
  - Responsive design utilities
  - Dark mode support with class-based toggling
  - JIT compilation for optimal performance

### **Component Library**
- **Radix UI Primitives** (Complete Suite) - Unstyled, accessible components
  - **@radix-ui/react-dialog** - Modal dialogs and overlays
  - **@radix-ui/react-dropdown-menu** - Dropdown menus
  - **@radix-ui/react-accordion** - Collapsible content sections
  - **@radix-ui/react-tabs** - Tab navigation
  - **@radix-ui/react-toast** - Notification system
  - **@radix-ui/react-select** - Custom select components
  - **@radix-ui/react-slider** - Range sliders
  - **@radix-ui/react-progress** - Progress bars
  - And 15+ more primitive components

### **Design System Utilities**
- **shadcn/ui** - Pre-built components using Radix + Tailwind
  - Consistent design language
  - Accessible by default
  - Customizable themes

- **class-variance-authority** - Type-safe component variants
- **clsx & tailwind-merge** - Dynamic className utilities
- **lucide-react** - Beautiful, customizable icons
- **react-icons** - Icon library including company logos

## 🔄 **State Management & Data Fetching**

### **Server State**
- **TanStack Query (React Query) 5.60.5** - Powerful data synchronization
  - Caching and background updates
  - Optimistic updates
  - Infinite queries support
  - Error handling and retry logic
  - Offline support

### **Form Management**
- **React Hook Form 7.55.0** - Performant forms with minimal re-renders
  - Uncontrolled components for better performance
  - Built-in validation support
  - TypeScript integration

- **@hookform/resolvers** - Schema validation resolvers
  - Zod integration for type-safe validation
  - Automatic error handling

## 🗄️ **Database & Backend**

### **Database**
- **PostgreSQL** - Robust relational database
- **Neon Database** - Serverless PostgreSQL platform
- **@neondatabase/serverless** - Edge-optimized database client

### **ORM & Schema**
- **Drizzle ORM 0.39.3** - TypeScript-first ORM
  - Type-safe database queries
  - Automatic migrations
  - Excellent TypeScript inference
  - Zero runtime overhead

- **Drizzle Kit 0.30.4** - Database toolkit
  - Schema migrations
  - Database introspection
  - Push/pull operations

### **Validation**
- **Zod 3.24.2** - TypeScript-first schema validation
  - Runtime type checking
  - Error messages
  - Schema composition

- **drizzle-zod** - Integration between Drizzle and Zod
- **zod-validation-error** - Better error formatting

## 🚀 **Backend Technologies**

### **Server Framework**
- **Express 4.21.2** - Fast, minimalist web framework
  - RESTful API design
  - Middleware support
  - Session management

- **Node.js** - JavaScript runtime environment
  - Event-driven, non-blocking I/O
  - NPM ecosystem

### **Authentication & Security**
- **Passport 0.7.0** - Authentication middleware
- **passport-local** - Local username/password strategy
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store

### **Email & Communication**
- **@sendgrid/mail** - Email delivery service
  - Transactional emails
  - Template support
  - Analytics and tracking

## 🛠️ **Development Tools**

### **Replit Integration**
- **@replit/vite-plugin-cartographer** - Project visualization
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error display

### **TypeScript Support**
- **@types/** packages for all major dependencies
  - Complete type definitions
  - IDE autocompletion
  - Compile-time error checking

### **Development Server**
- **tsx 4.20.5** - TypeScript execution engine
  - Fast compilation
  - Watch mode support
  - ESM support

## 📱 **User Experience**

### **Navigation & Routing**
- **Wouter 3.3.5** - Minimalist routing library
  - Small bundle size (2KB)
  - Hook-based API
  - TypeScript support

### **Animations & Interactions**
- **Framer Motion 11.13.1** - Production-ready motion library
  - Smooth animations
  - Gesture recognition
  - Layout animations

- **tailwindcss-animate** - CSS animation utilities
- **embla-carousel-react** - Lightweight carousel component

### **Theme Management**
- **next-themes 0.4.6** - Theme switching
  - Dark/light mode support
  - System preference detection
  - No flash of incorrect theme

## 📊 **Data Processing & Utilities**

### **File Handling**
- **multer** - File upload middleware
- **mammoth** - Word document processing
- **pdf-parse** - PDF content extraction
- **csv-parser** - CSV file processing
- **xlsx** - Excel file handling

### **Utilities**
- **date-fns** - Date manipulation library
- **memoizee** - Function memoization
- **memorystore** - Memory-based session store

### **Charts & Visualization**
- **recharts** - Chart library for React
  - SVG-based charts
  - Responsive design
  - Animation support

## 🔧 **Advanced Features**

### **File Upload**
- **Uppy Suite** - Modern file uploader
  - **@uppy/core** - Core functionality
  - **@uppy/dashboard** - UI component
  - **@uppy/aws-s3** - S3 integration
  - **@uppy/react** - React integration

### **Cloud Storage**
- **@google-cloud/storage** - Google Cloud Storage client

### **Web Scraping & Automation**
- **puppeteer** - Headless Chrome automation
  - PDF generation
  - Screenshot capture
  - Web scraping

### **AI Integration**
- **OpenAI 5.12.2** - AI API client
  - GPT model integration
  - Text generation
  - Embeddings support

## 📦 **Build & Deployment**

### **Build Process**
1. **Development**: `npm run dev` - Uses tsx to run TypeScript server
2. **Build**: `npm run build` - Vite builds frontend, ESBuild bundles backend
3. **Production**: `npm start` - Runs compiled Node.js application

### **Configuration Files**
- **vite.config.ts** - Vite configuration with aliases and plugins
- **tailwind.config.ts** - Tailwind customization and theming
- **tsconfig.json** - TypeScript compiler options
- **drizzle.config.ts** - Database configuration

## 🏃‍♂️ **Performance Optimizations**

1. **Bundle Splitting** - Vite automatically splits code for optimal loading
2. **Tree Shaking** - Removes unused code from production builds
3. **Image Optimization** - Asset processing and optimization
4. **Caching Strategy** - React Query handles intelligent caching
5. **TypeScript Compilation** - Fast builds with ESBuild

## 🔒 **Security Features**

1. **Type Safety** - TypeScript prevents runtime type errors
2. **Input Validation** - Zod schemas validate all user inputs
3. **Password Hashing** - bcryptjs secures user passwords
4. **Session Management** - Secure session handling with PostgreSQL storage
5. **CSRF Protection** - Built into form handling

## 🚀 **Getting Started**

### **Installation**
```bash
npm install
```

### **Development**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Start Production Server**
```bash
npm start
```

### **Database Operations**
```bash
# Push schema changes to database
npm run db:push

# Type checking
npm run check
```

## 📁 **Project Structure**

```
felicity-hills/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── attached_assets/       # Static assets and uploads
└── dist/                  # Production build output
```

## 🎯 **Key Features Implemented**

1. **Real Estate Landing Page** - Responsive design with modern UI
2. **Property Listings** - Dynamic plot information and pricing
3. **Investment Calculator** - ROI calculations for investors
4. **Site Visit Booking** - Form submission with email notifications
5. **Admin Dashboard** - Analytics and content management
6. **Testimonial System** - Customer stories and reviews
7. **Brochure Downloads** - PDF downloads with tracking
8. **Email Integration** - Automated notifications via SendGrid
9. **Dark/Light Theme** - User preference-based theming
10. **Mobile Responsive** - Optimized for all device sizes

This technology stack provides a robust, scalable, and maintainable foundation for your Felicity Hills real estate platform, with modern development practices and excellent user experience.