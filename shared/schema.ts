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

export const insertPlotSchema = createInsertSchema(plots).omit({ id: true });
export const insertSiteVisitSchema = createInsertSchema(siteVisits).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });

export type Plot = typeof plots.$inferSelect;
export type SiteVisit = typeof siteVisits.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
