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

export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gamification Tables
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  name: varchar("name").notNull(),
  phone: varchar("phone"),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(),
  category: varchar("category").notNull(), // 'downloads', 'visits', 'engagement', 'social'
  pointsRequired: integer("points_required").default(0),
  condition: text("condition").notNull(), // JSON string defining achievement conditions
  rarity: varchar("rarity").notNull().default("common"), // 'common', 'rare', 'epic', 'legendary'
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userEmail: varchar("user_email").notNull(),
  achievementId: varchar("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
});

export const engagementEvents = pgTable("engagement_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userEmail: varchar("user_email").notNull(),
  eventType: varchar("event_type").notNull(), // 'download', 'visit_booking', 'page_view', 'video_watch', 'share'
  eventData: text("event_data"), // JSON string with additional event data
  pointsEarned: integer("points_earned").default(0),
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leaderboards = pgTable("leaderboards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: varchar("period").notNull(), // 'daily', 'weekly', 'monthly', 'all_time'
  userEmail: varchar("user_email").notNull(),
  userName: varchar("user_name").notNull(),
  points: integer("points").notNull(),
  rank: integer("rank").notNull(),
  achievements: integer("achievements").default(0),
  createdAt: timestamp("created_at").defaultNow(),
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

// Gamification insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, createdAt: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, unlockedAt: true });
export const insertEngagementEventSchema = createInsertSchema(engagementEvents).omit({ id: true, createdAt: true });
export const insertLeaderboardSchema = createInsertSchema(leaderboards).omit({ id: true, createdAt: true });

export type Plot = typeof plots.$inferSelect;
export type SiteVisit = typeof siteVisits.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Brochure = typeof brochures.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type BrochureDownload = typeof brochureDownloads.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type User = typeof users.$inferSelect;
export type AdminSetting = typeof adminSettings.$inferSelect;

// Gamification types
export type UserProfile = typeof userProfiles.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type EngagementEvent = typeof engagementEvents.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;

export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertBrochure = z.infer<typeof insertBrochureSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertBrochureDownload = z.infer<typeof insertBrochureDownloadSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;

// Gamification insert types
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertEngagementEvent = z.infer<typeof insertEngagementEventSchema>;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;

export type UpsertUser = typeof users.$inferInsert;

// Engagement Stats interface
export interface EngagementStats {
  totalEvents: number;
  totalPoints: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  averagePointsPerEvent: number;
  mostActiveDay: string;
  eventTypeBreakdown: Array<{
    eventType: string;
    count: number;
    totalPoints: number;
  }>;
}
