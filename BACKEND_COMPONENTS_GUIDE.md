# Backend Components and Functionality Guide

## 📁 Backend Folder Structure (Cleaned)

```
📦 backend/
├── 📄 index.ts           # Main server entry point
├── 📄 routes.ts          # API route handlers  
├── 📄 storage.ts         # Database operations layer
├── 📄 db.ts             # Database connection setup
├── 📄 emailService.ts    # Email functionality
├── 📄 package.json       # Backend dependencies
├── 📄 tsconfig.json      # TypeScript configuration
├── 📄 drizzle.config.ts  # Database migration config
└── 📁 shared/            # Shared schemas and types
    └── 📄 schema.ts      # Database schemas and TypeScript types
```

## 🔧 Core Components Explained

### 1. **index.ts** - Server Entry Point
**Purpose**: Main application server startup and configuration

**Key Functionality**:
- ✅ Creates Express application instance
- ✅ Configures CORS for frontend communication
- ✅ Sets up middleware for JSON parsing and request logging
- ✅ Handles error management and HTTP status codes
- ✅ Starts server on port 5000 (or PORT environment variable)

**Key Code Sections**:
```typescript
// CORS setup for frontend communication
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // ... CORS headers
});

// Server startup
server.listen({ port: 5000, host: "0.0.0.0" });
```

**When to Modify**: 
- Add new middleware
- Change server configuration
- Modify CORS settings for different domains

---

### 2. **routes.ts** - API Endpoints Handler  
**Purpose**: Defines all REST API endpoints and their business logic

**Key Functionality**:
- ✅ **Projects API**: `/api/projects` - Retrieve all real estate projects
- ✅ **Site Visits**: `/api/site-visits` - Handle booking requests with email notifications
- ✅ **Testimonials**: `/api/testimonials` - Customer reviews and stories
- ✅ **Brochures**: `/api/brochures` - Download tracking and file management
- ✅ **Admin Dashboard**: `/api/admin/*` - Administrative endpoints
- ✅ **Authentication**: Admin login and session management
- ✅ **File Uploads**: CSV import for leads and appointments

**API Endpoints Structure**:
```
GET    /api/projects              # Get all projects
POST   /api/site-visits           # Book site visit
GET    /api/testimonials          # Get customer testimonials
GET    /api/brochures             # Get available brochures  
POST   /api/brochures/:id/download # Track brochure download
GET    /api/admin/*               # Admin dashboard endpoints
POST   /api/admin/login           # Admin authentication
```

**When to Modify**:
- Add new API endpoints
- Modify existing business logic
- Change email notification content
- Update authentication rules

---

### 3. **storage.ts** - Database Operations Layer
**Purpose**: Handles all database CRUD operations with PostgreSQL

**Key Functionality**:
- ✅ **Projects Management**: Create, read, update project data
- ✅ **Site Visit Bookings**: Store and retrieve booking information
- ✅ **Testimonials**: Customer story management
- ✅ **Brochure Downloads**: Track download analytics
- ✅ **Admin Users**: Authentication and user management
- ✅ **CRM System**: Leads, appointments, and follow-ups

**Database Tables**:
- `projects` - Real estate project information
- `siteVisits` - Site visit booking records
- `testimonials` - Customer testimonials
- `brochures` - Brochure metadata and tracking
- `brochureDownloads` - Download analytics
- `users` - Admin user accounts
- `leads` - Customer leads management
- `appointments` - Appointment scheduling
- `followUps` - Follow-up tracking

**When to Modify**:
- Add new database operations
- Modify existing data queries
- Add new tables or columns
- Update data validation logic

---

### 4. **db.ts** - Database Connection
**Purpose**: Establishes and manages PostgreSQL database connection

**Key Functionality**:
- ✅ Connects to Neon PostgreSQL database using DATABASE_URL
- ✅ Configures Drizzle ORM with WebSocket support
- ✅ Provides database client for all operations

**Configuration**:
```typescript
// Uses DATABASE_URL environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

**When to Modify**:
- Change database provider
- Update connection configuration
- Add connection pooling settings

---

### 5. **emailService.ts** - Email Notifications
**Purpose**: Handles all email communications using SendGrid

**Key Functionality**:
- ✅ **Booking Confirmations**: Send confirmation emails to customers
- ✅ **Admin Notifications**: Alert admins about new bookings
- ✅ **Professional Templates**: HTML email templates with styling
- ✅ **Error Handling**: Robust email delivery error management

**Email Types**:
- Customer site visit confirmation
- Admin booking alert notifications
- Download notifications (if enabled)

**Configuration Requirements**:
- `SENDGRID_API_KEY` - SendGrid service API key
- `ADMIN_EMAIL` - Admin notification recipient
- `COMPANY_EMAIL` - Company sender email

**When to Modify**:
- Change email templates
- Add new email types
- Update sender/recipient logic
- Modify email content

---

### 6. **shared/schema.ts** - Database Schemas
**Purpose**: Defines PostgreSQL database table schemas and TypeScript types

**Key Functionality**:
- ✅ **Drizzle ORM Schemas**: Database table definitions
- ✅ **TypeScript Types**: Type safety for all data operations
- ✅ **Zod Validation**: Runtime data validation schemas
- ✅ **Insert/Select Types**: Proper typing for database operations

**Schema Definitions**:
```typescript
// Example project schema
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  // ... other fields
});

// TypeScript types
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
```

**When to Modify**:
- Add new database tables
- Modify existing table schemas
- Update validation rules
- Add new data types

---

### 7. **package.json** - Dependencies
**Purpose**: Manages backend-specific dependencies and scripts

**Key Dependencies**:
- `express` - Web server framework
- `drizzle-orm` - Database ORM
- `@sendgrid/mail` - Email service
- `zod` - Data validation
- `bcryptjs` - Password hashing
- `multer` - File upload handling

**Scripts**:
- `npm run dev` - Development server with hot reloading
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run db:push` - Database migration

---

### 8. **tsconfig.json** - TypeScript Configuration
**Purpose**: TypeScript compiler configuration for backend

**Key Settings**:
- ES2022 target for modern Node.js
- ESNext modules for import/export
- Strict type checking enabled
- Path aliases for shared schemas

---

### 9. **drizzle.config.ts** - Database Migration Config
**Purpose**: Configuration for database migrations and schema management

**Key Settings**:
- PostgreSQL connection setup
- Schema file location
- Migration output directory

## 🔄 Data Flow Architecture

```
1. Client Request → index.ts (CORS + Middleware)
2. Route Matching → routes.ts (Business Logic)
3. Data Operations → storage.ts (Database Layer)
4. Database Query → db.ts (Connection) → PostgreSQL
5. Email Sending → emailService.ts (SendGrid)
6. Response → Client
```

## 🛠️ Common Maintenance Tasks

### Adding New API Endpoint:
1. **Update routes.ts** - Add new route handler
2. **Update storage.ts** - Add database operations if needed
3. **Update schema.ts** - Add new database tables/types if needed

### Modifying Email Templates:
1. **Update emailService.ts** - Modify email templates
2. **Test email delivery** - Verify emails are sent correctly

### Adding New Database Table:
1. **Update shared/schema.ts** - Define new table schema
2. **Update storage.ts** - Add CRUD operations
3. **Run npm run db:push** - Apply database changes
4. **Update routes.ts** - Add API endpoints if needed

## 🔒 Security Features

- ✅ **CORS Protection** - Prevents unauthorized cross-origin requests
- ✅ **Input Validation** - Zod schemas validate all incoming data
- ✅ **SQL Injection Protection** - Drizzle ORM provides safe queries
- ✅ **Password Hashing** - bcrypt for secure password storage
- ✅ **Session Management** - Secure admin authentication

## 📊 Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Email Service  
SENDGRID_API_KEY=your_sendgrid_key
ADMIN_EMAIL=admin@felicityhills.com
COMPANY_EMAIL=info@felicityhills.com

# Security
SESSION_SECRET=your_super_secret_key

# Server
NODE_ENV=production
PORT=5000

# Frontend (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

This backend is now clean, focused, and ready for production deployment with all unnecessary files removed!