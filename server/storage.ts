import {
  plots,
  siteVisits,
  testimonials,
  brochures,
  videos,
  brochureDownloads,
  users,
  type Plot,
  type SiteVisit,
  type Testimonial,
  type Brochure,
  type Video,
  type BrochureDownload,
  type User,
  type InsertPlot,
  type InsertSiteVisit,
  type InsertTestimonial,
  type InsertBrochure,
  type InsertVideo,
  type InsertBrochureDownload,
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
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  
  // Brochure operations
  getBrochures(): Promise<Brochure[]>;
  createBrochure(brochure: InsertBrochure): Promise<Brochure>;
  getBrochure(id: string): Promise<Brochure | undefined>;
  
  // Brochure download operations
  createBrochureDownload(download: InsertBrochureDownload): Promise<BrochureDownload>;
  getBrochureDownloads(): Promise<BrochureDownload[]>;
  getBrochureDownloadStats(): Promise<any>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
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

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
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
    return await db
      .select({
        id: brochureDownloads.id,
        brochureId: brochureDownloads.brochureId,
        userName: brochureDownloads.userName,
        userEmail: brochureDownloads.userEmail,
        userPhone: brochureDownloads.userPhone,
        downloadedAt: brochureDownloads.downloadedAt,
        ipAddress: brochureDownloads.ipAddress,
        userAgent: brochureDownloads.userAgent,
        brochureTitle: brochures.title,
      })
      .from(brochureDownloads)
      .leftJoin(brochures, eq(brochureDownloads.brochureId, brochures.id))
      .orderBy(desc(brochureDownloads.downloadedAt));
  }

  async getBrochureDownloadStats(): Promise<any> {
    const totalDownloads = await db
      .select({ count: count() })
      .from(brochureDownloads);

    const downloadsByBrochure = await db
      .select({
        brochureId: brochureDownloads.brochureId,
        brochureTitle: brochures.title,
        downloadCount: count(),
      })
      .from(brochureDownloads)
      .leftJoin(brochures, eq(brochureDownloads.brochureId, brochures.id))
      .groupBy(brochureDownloads.brochureId, brochures.title);

    const recentDownloads = await db
      .select({
        userName: brochureDownloads.userName,
        userEmail: brochureDownloads.userEmail,
        downloadedAt: brochureDownloads.downloadedAt,
        brochureTitle: brochures.title,
      })
      .from(brochureDownloads)
      .leftJoin(brochures, eq(brochureDownloads.brochureId, brochures.id))
      .orderBy(desc(brochureDownloads.downloadedAt))
      .limit(10);

    return {
      totalDownloads: totalDownloads[0]?.count || 0,
      downloadsByBrochure,
      recentDownloads,
    };
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  // Initialize with sample data
  async initializeData() {
    // Check if data already exists
    const existingBrochures = await this.getBrochures();
    if (existingBrochures.length > 0) return;

    // Initialize brochures
    const brochureData = [
      {
        title: "Khushalipur Project Brochure",
        description: "Complete project overview with pricing, amenities, and location advantages.",
        downloadUrl: "#",
        fileSize: "2.5 MB"
      },
      {
        title: "Price List & Payment Plans",
        description: "Detailed pricing for all plot categories with flexible payment options.",
        downloadUrl: "#",
        fileSize: "1.8 MB"
      },
      {
        title: "Legal Documentation",
        description: "Registry, clearance certificates, and legal compliance documents.",
        downloadUrl: "#",
        fileSize: "3.2 MB"
      },
      {
        title: "Master Plan Layout",
        description: "Detailed site plan showing plot numbers, roads, and amenities.",
        downloadUrl: "#",
        fileSize: "4.1 MB"
      },
      {
        title: "Amenities Guide",
        description: "Complete guide to all amenities and recreational facilities.",
        downloadUrl: "#",
        fileSize: "2.9 MB"
      }
    ];

    for (const brochure of brochureData) {
      await this.createBrochure(brochure);
    }

    // Initialize testimonials
    const testimonialData = [
      {
        name: "Rahul Sharma",
        location: "Delhi",
        investment: 1500000,
        plotSize: 400,
        returns: 18,
        duration: "18 months",
        review: "Excellent investment opportunity with great returns. The location is perfect for future growth."
      },
      {
        name: "Priya Gupta",
        location: "Mumbai",
        investment: 800000,
        plotSize: 200,
        returns: 22,
        duration: "2 years",
        review: "Very satisfied with my investment. The team is professional and transparent."
      },
      {
        name: "Amit Singh",
        location: "Bangalore",
        investment: 1200000,
        plotSize: 300,
        returns: 20,
        duration: "15 months",
        review: "Great project with excellent amenities. Highly recommend for long-term investment."
      }
    ];

    for (const testimonial of testimonialData) {
      await db.insert(testimonials).values(testimonial);
    }

    // Initialize videos
    const videoData = [
      {
        title: "Khushalipur Project Overview",
        description: "Complete walkthrough of the project location, amenities, and investment potential.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "5:30",
        category: "project"
      },
      {
        title: "Location Advantages",
        description: "Discover why Khushalipur is the perfect location for agricultural land investment.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "3:45",
        category: "location"
      }
    ];

    for (const video of videoData) {
      await this.createVideo(video);
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize data when the module is loaded
storage.initializeData().catch(console.error);