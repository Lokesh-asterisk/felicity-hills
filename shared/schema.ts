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
});

export const siteVisits = pgTable("site_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  preferredDate: text("preferred_date"),
  plotSize: text("plot_size"),
  budget: text("budget"),
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

export const insertPlotSchema = createInsertSchema(plots).omit({ id: true });
export const insertSiteVisitSchema = createInsertSchema(siteVisits).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertBrochureSchema = createInsertSchema(brochures).omit({ id: true, createdAt: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export const insertBrochureDownloadSchema = createInsertSchema(brochureDownloads).omit({ id: true, downloadedAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });

export type Plot = typeof plots.$inferSelect;
export type SiteVisit = typeof siteVisits.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Brochure = typeof brochures.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type BrochureDownload = typeof brochureDownloads.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertBrochure = z.infer<typeof insertBrochureSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertBrochureDownload = z.infer<typeof insertBrochureDownloadSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
