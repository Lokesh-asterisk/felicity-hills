import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const plots = pgTable("plots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plotNumber: text("plot_number").notNull().unique(),
  size: integer("size").notNull(), // in sq yards
  pricePerSqYd: integer("price_per_sq_yd").notNull(),
  roadWidth: integer("road_width").notNull(), // in feet
  category: text("category").notNull(), // 'small', 'regular', 'premium', 'cottage'
  features: text("features").array().default([]),
  available: boolean("available").default(true),
  location: text("location"), // 'gate_facing', 'pool_facing', 'corner', etc.
  sizeInSqft: integer("size_in_sqft").notNull(), // size in square feet for AI calculations
  pricePerSqft: integer("price_per_sqft").notNull(), // price per square foot
  soilType: text("soil_type"), // 'clay', 'sandy', 'loamy', etc.
  waterAccess: boolean("water_access").default(false),
  roadAccess: text("road_access"), // 'paved', 'gravel', 'dirt'
  nearbyAmenities: text("nearby_amenities").array().default([]),
});

export const siteVisits = pgTable("site_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  preferredDate: text("preferred_date"),
  plotSize: text("plot_size"),
  budget: text("budget"),
  projectId: varchar("project_id"), // Selected project for the site visit
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  investment: integer("investment").notNull(),
  plotSize: integer("plot_size").notNull(),
  returns: integer("returns").notNull(), // percentage
  duration: text("duration").notNull(),
  review: text("review").notNull(),
});

export const brochures = pgTable("brochures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  downloadUrl: text("download_url").notNull(),
  fileSize: text("file_size").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(), // 'project', 'location', 'testimonial'
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const brochureDownloads = pgTable("brochure_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brochureId: varchar("brochure_id").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  userPhone: text("user_phone"),
  downloadedAt: timestamp("downloaded_at").default(sql`now()`),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'visit', 'inquiry', 'sale', 'meeting', 'other'
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").default("user"), // 'admin', 'user'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM Tables
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  company: text("company"),
  status: text("status").notNull().default("new"), // new, contacted, qualified, showing_scheduled, not_interested, converted
  source: text("source").notNull(), // website, referral, social_media, advertisement, cold_call, walk_in
  interestLevel: text("interest_level").notNull().default("medium"), // low, medium, high, very_high
  propertyInterests: text("property_interests").array().default([]), // types of properties they're interested in
  budget: text("budget"),
  notes: text("notes"),
  assignedTo: varchar("assigned_to"), // user id
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").default(60), // in minutes
  location: text("location"),
  propertyId: varchar("property_id"), // reference to plots table
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, completed, cancelled, no_show
  reminderSent: boolean("reminder_sent").default(false),
  createdBy: varchar("created_by"), // user id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const followUps = pgTable("follow_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  status: text("status").notNull().default("pending"), // pending, completed, overdue
  assignedTo: varchar("assigned_to"), // user id
  completedAt: timestamp("completed_at"),
  createdBy: varchar("created_by"), // user id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  status: text("status").notNull().default("active"), // active, coming_soon, completed, sold_out
  type: text("type").notNull(), // Agricultural Plots, Residential Plots, Premium Villas, etc.
  priceRange: text("price_range").notNull(),
  latitude: text("latitude"), // Geographic latitude for heatmap visualization
  longitude: text("longitude"), // Geographic longitude for heatmap visualization
  features: text("features").array().default([]),
  amenities: text("amenities").array().default([]),
  images: text("images").array().default([]), // URLs to project images
  galleryImages: text("gallery_images").array().default([]), // Additional gallery images
  videoUrl: text("video_url"), // Project showcase video
  brochureUrl: text("brochure_url"), // Link to downloadable brochure
  masterPlanUrl: text("master_plan_url"), // Master plan image/PDF
  locationMapUrl: text("location_map_url"), // Google Maps embed or image
  featured: boolean("featured").default(false), // Featured projects display prominently
  sortOrder: integer("sort_order").default(0), // For custom ordering
  investmentReturns: text("investment_returns"), // Expected returns percentage
  totalArea: text("total_area"), // Total project area
  totalPlots: integer("total_plots"), // Number of plots/units
  availablePlots: integer("available_plots"), // Available units
  launchDate: timestamp("launch_date"),
  possessionDate: timestamp("possession_date"),
  approvals: text("approvals").array().default([]), // Required approvals/certificates
  connectivity: text("connectivity").array().default([]), // Transportation links
  nearbyAttractions: text("nearby_attractions").array().default([]), // Tourist spots, landmarks
  contactPerson: text("contact_person"), // Project contact person
  contactPhone: text("contact_phone"), // Project contact number
  contactEmail: text("contact_email"), // Project contact email
  seoTitle: text("seo_title"), // SEO page title
  seoDescription: text("seo_description"), // SEO meta description
  seoKeywords: text("seo_keywords").array().default([]), // SEO keywords
  isActive: boolean("is_active").default(true), // Show/hide project
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const insertPlotSchema = createInsertSchema(plots).omit({ id: true });
export const insertSiteVisitSchema = createInsertSchema(siteVisits).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertBrochureSchema = createInsertSchema(brochures).omit({ id: true, createdAt: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export const insertBrochureDownloadSchema = createInsertSchema(brochureDownloads).omit({ id: true, downloadedAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({ id: true, updatedAt: true });

// CRM Insert Schemas
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  lastContactDate: z.string().datetime().optional().or(z.date().optional()).transform((val) => val ? new Date(val) : undefined),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  appointmentDate: z.string().datetime().or(z.date()).transform((val) => new Date(val)),
});

export const insertFollowUpSchema = createInsertSchema(followUps).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  dueDate: z.string().datetime().or(z.date()).transform((val) => new Date(val)),
  completedAt: z.string().datetime().optional().or(z.date().optional()).transform((val) => val ? new Date(val) : undefined),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  launchDate: z.string().datetime().optional().or(z.date().optional()).transform((val) => val ? new Date(val) : undefined),
  possessionDate: z.string().datetime().optional().or(z.date().optional()).transform((val) => val ? new Date(val) : undefined),
});



export type Plot = typeof plots.$inferSelect;
export type SiteVisit = typeof siteVisits.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Brochure = typeof brochures.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type BrochureDownload = typeof brochureDownloads.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type User = typeof users.$inferSelect;
export type AdminSetting = typeof adminSettings.$inferSelect;

// CRM Types
export type Lead = typeof leads.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type FollowUp = typeof followUps.$inferSelect;

// Project Types
export type Project = typeof projects.$inferSelect;



export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertBrochure = z.infer<typeof insertBrochureSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertBrochureDownload = z.infer<typeof insertBrochureDownloadSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;

// CRM Insert Types
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertFollowUp = z.infer<typeof insertFollowUpSchema>;

// Project Insert Types
export type InsertProject = z.infer<typeof insertProjectSchema>;



export type UpsertUser = typeof users.$inferInsert;


