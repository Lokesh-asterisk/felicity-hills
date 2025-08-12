import {
  plots,
  siteVisits,
  testimonials,
  brochures,
  videos,
  brochureDownloads,
  activities,
  users,
  adminSettings,
  type Plot,
  type SiteVisit,
  type Testimonial,
  type Brochure,
  type Video,
  type BrochureDownload,
  type Activity,
  type User,
  type AdminSetting,
  type InsertPlot,
  type InsertSiteVisit,
  type InsertTestimonial,
  type InsertBrochure,
  type InsertVideo,
  type InsertBrochureDownload,
  type InsertActivity,
  type InsertUser,
  type InsertAdminSetting,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Plot operations
  getPlots(): Promise<Plot[]>;
  getPlot(id: string): Promise<Plot | undefined>;
  createPlot(plot: InsertPlot): Promise<Plot>;
  
  // Site visit operations
  createSiteVisit(siteVisit: InsertSiteVisit): Promise<SiteVisit>;
  getSiteVisits(): Promise<SiteVisit[]>;
  getSiteVisitStats(): Promise<any>;
  updateSiteVisitStatus(id: string, status: string): Promise<SiteVisit | undefined>;
  deleteSiteVisit(id: string): Promise<boolean>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: InsertTestimonial): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  
  // Brochure operations
  getBrochures(): Promise<Brochure[]>;
  createBrochure(brochure: InsertBrochure): Promise<Brochure>;
  getBrochure(id: string): Promise<Brochure | undefined>;
  
  // Brochure download operations
  createBrochureDownload(download: InsertBrochureDownload): Promise<BrochureDownload>;
  getBrochureDownloads(): Promise<BrochureDownload[]>;
  getBrochureDownloadStats(): Promise<any>;
  deleteBrochureDownload(id: string): Promise<boolean>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Activity operations
  getActivities(): Promise<Activity[]>;
  getRecentActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, activity: InsertActivity): Promise<Activity | undefined>;
  deleteActivity(id: string): Promise<boolean>;
  
  // Admin settings operations
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  upsertAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Plot operations
  async getPlots(): Promise<Plot[]> {
    return await db.select().from(plots);
  }

  async getPlot(id: string): Promise<Plot | undefined> {
    const [plot] = await db.select().from(plots).where(eq(plots.id, id));
    return plot || undefined;
  }

  async createPlot(plot: InsertPlot): Promise<Plot> {
    const [newPlot] = await db.insert(plots).values(plot).returning();
    return newPlot;
  }

  // Site visit operations
  async createSiteVisit(siteVisit: InsertSiteVisit): Promise<SiteVisit> {
    const [newSiteVisit] = await db.insert(siteVisits).values(siteVisit).returning();
    return newSiteVisit;
  }

  async getSiteVisits(): Promise<SiteVisit[]> {
    return await db.select().from(siteVisits).orderBy(desc(siteVisits.createdAt));
  }

  async getSiteVisitStats(): Promise<any> {
    const total = await db.select({ count: count() }).from(siteVisits);
    const thisMonth = await db.select({ count: count() }).from(siteVisits)
      .where(sql`DATE_TRUNC('month', ${siteVisits.createdAt}) = DATE_TRUNC('month', CURRENT_DATE)`);
    const thisWeek = await db.select({ count: count() }).from(siteVisits)
      .where(sql`DATE_TRUNC('week', ${siteVisits.createdAt}) = DATE_TRUNC('week', CURRENT_DATE)`);

    return {
      total: total[0]?.count || 0,
      thisMonth: thisMonth[0]?.count || 0,
      thisWeek: thisWeek[0]?.count || 0,
    };
  }

  async updateSiteVisitStatus(id: string, status: string): Promise<SiteVisit | undefined> {
    const [updatedVisit] = await db
      .update(siteVisits)
      .set({ preferredDate: status }) // Fix: Use valid field
      .where(eq(siteVisits.id, id))
      .returning();
    return updatedVisit || undefined;
  }

  async deleteSiteVisit(id: string): Promise<boolean> {
    const result = await db.delete(siteVisits).where(eq(siteVisits.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.id));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: string, testimonial: InsertTestimonial): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Brochure operations
  async getBrochures(): Promise<Brochure[]> {
    return await db.select().from(brochures).orderBy(desc(brochures.createdAt));
  }

  async createBrochure(brochure: InsertBrochure): Promise<Brochure> {
    const [newBrochure] = await db.insert(brochures).values(brochure).returning();
    return newBrochure;
  }

  async getBrochure(id: string): Promise<Brochure | undefined> {
    const [brochure] = await db.select().from(brochures).where(eq(brochures.id, id));
    return brochure || undefined;
  }

  // Brochure download operations
  async createBrochureDownload(download: InsertBrochureDownload): Promise<BrochureDownload> {
    const [newDownload] = await db.insert(brochureDownloads).values(download).returning();
    return newDownload;
  }

  async getBrochureDownloads(): Promise<BrochureDownload[]> {
    return await db.select().from(brochureDownloads).orderBy(desc(brochureDownloads.downloadedAt));
  }

  async getBrochureDownloadStats(): Promise<any> {
    const total = await db.select({ count: count() }).from(brochureDownloads);
    const thisMonth = await db.select({ count: count() }).from(brochureDownloads)
      .where(sql`DATE_TRUNC('month', ${brochureDownloads.downloadedAt}) = DATE_TRUNC('month', CURRENT_DATE)`);
    const thisWeek = await db.select({ count: count() }).from(brochureDownloads)
      .where(sql`DATE_TRUNC('week', ${brochureDownloads.downloadedAt}) = DATE_TRUNC('week', CURRENT_DATE)`);

    return {
      total: total[0]?.count || 0,
      thisMonth: thisMonth[0]?.count || 0,
      thisWeek: thisWeek[0]?.count || 0,
    };
  }

  async deleteBrochureDownload(id: string): Promise<boolean> {
    const result = await db.delete(brochureDownloads).where(eq(brochureDownloads.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  // Activity operations
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.createdAt));
  }

  async getRecentActivities(): Promise<Activity[]> {
    return await db.select().from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(10);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivity(id: string, activity: InsertActivity): Promise<Activity | undefined> {
    const [updatedActivity] = await db
      .update(activities)
      .set(activity)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity || undefined;
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Admin settings operations
  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    const [setting] = await db.select().from(adminSettings).where(eq(adminSettings.key, key));
    return setting || undefined;
  }

  async upsertAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    const [newSetting] = await db
      .insert(adminSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: adminSettings.key,
        set: {
          value: setting.value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return newSetting;
  }

  // Initialize default data
  async initializeData(): Promise<void> {
    try {
      // Initialize plots if none exist
      const existingPlots = await this.getPlots();
      if (existingPlots.length === 0) {
        const samplePlots = [
          {
            plotNumber: "A-001",
            size: 500,
            pricePerSqYd: 3000,
            roadWidth: 20,
            category: "premium",
            features: ["Water Connection", "Electricity", "Road Access", "Fertile Soil"],
            available: true,
            location: "gate_facing",
          },
          {
            plotNumber: "B-002",
            size: 750,
            pricePerSqYd: 3000,
            roadWidth: 30,
            category: "premium",
            features: ["Water Connection", "Electricity", "Road Access", "Organic Certified"],
            available: true,
            location: "corner",
          },
          {
            plotNumber: "C-003",
            size: 1000,
            pricePerSqYd: 3000,
            roadWidth: 40,
            category: "cottage",
            features: ["Water Connection", "Electricity", "Corner Plot", "Prime Location"],
            available: false,
            location: "pool_facing",
          },
        ];

        for (const plot of samplePlots) {
          await this.createPlot(plot);
        }
      }

      // Initialize testimonials if none exist
      const existingTestimonials = await this.getTestimonials();
      if (existingTestimonials.length === 0) {
        const sampleTestimonials = [
          {
            name: "Rajesh Kumar",
            location: "Delhi",
            investment: 1500000,
            plotSize: 500,
            returns: 15,
            duration: "2 years",
            review: "Investing in Khushalipur was the best decision I made. The returns are excellent and the location is perfect for agriculture.",
          },
          {
            name: "Priya Sharma",
            location: "Mumbai",
            investment: 2250000,
            plotSize: 750,
            returns: 18,
            duration: "18 months",
            review: "The team at Felicity Hills made the entire process smooth and transparent. Highly recommended for agricultural investments.",
          },
          {
            name: "Amit Singh",
            location: "Bangalore",
            investment: 3000000,
            plotSize: 1000,
            returns: 20,
            duration: "3 years",
            review: "Great investment opportunity with excellent infrastructure and support. The agricultural potential is tremendous.",
          },
        ];

        for (const testimonial of sampleTestimonials) {
          await this.createTestimonial(testimonial);
        }
      }

      // Initialize activities if none exist
      const existingActivities = await this.getActivities();
      if (existingActivities.length === 0) {
        const sampleActivities = [
          {
            title: "New plot reservation",
            description: "Plot A-15 reserved by customer for site visit",
            type: "visit",
          },
          {
            title: "Investment inquiry",
            description: "Customer inquired about agricultural land pricing",
            type: "inquiry",
          },
          {
            title: "Site visit completed",
            description: "Successful site visit for Plot B-23",
            type: "visit",
          },
        ];

        for (const activity of sampleActivities) {
          await this.createActivity(activity);
        }
      }

      console.log("Default data initialized successfully");
    } catch (error) {
      console.error("Failed to initialize data:", error);
    }
  }

  // Initialize sample brochure downloads
  async initializeBrochureDownloads(): Promise<void> {
    try {
      const downloadsSetting = await this.getAdminSetting('brochure_downloads_initialized');
      if (downloadsSetting) {
        console.log("Sample brochure downloads already initialized");
        return;
      }

      const sampleDownloads = [
        {
          brochureId: (await this.getBrochures())[0]?.id,
          userName: "Rajesh Kumar",
          userEmail: "rajesh.kumar@example.com",
          userPhone: "+91 98765 43210",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        {
          brochureId: (await this.getBrochures())[1]?.id,
          userName: "Priya Sharma",
          userEmail: "priya.sharma@example.com", 
          userPhone: "+91 87654 32109",
          ipAddress: "192.168.1.101",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15"
        },
        {
          brochureId: (await this.getBrochures())[2]?.id,
          userName: "Amit Singh",
          userEmail: "amit.singh@example.com",
          userPhone: "+91 76543 21098", 
          ipAddress: "192.168.1.102",
          userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
        }
      ];

      for (const download of sampleDownloads) {
        if (download.brochureId) {
          await this.createBrochureDownload(download);
        }
      }

      await this.upsertAdminSetting({
        key: 'brochure_downloads_initialized',
        value: 'true'
      });

      console.log("Sample brochure downloads initialized successfully");
    } catch (error) {
      console.error("Failed to initialize brochure downloads:", error);
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize data when the module is loaded
storage.initializeData().catch(console.error);