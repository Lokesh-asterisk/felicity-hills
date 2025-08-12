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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Total site visits
    const totalVisits = await db
      .select({ count: count() })
      .from(siteVisits);

    // Today's visits
    const todayVisits = await db
      .select({ count: count() })
      .from(siteVisits)
      .where(sql`${siteVisits.createdAt} >= ${todayStart}`);

    // This week's visits
    const weekVisits = await db
      .select({ count: count() })
      .from(siteVisits)
      .where(sql`${siteVisits.createdAt} >= ${weekStart}`);

    // Recent visits (last 10)
    const recentVisits = await db
      .select()
      .from(siteVisits)
      .orderBy(desc(siteVisits.createdAt))
      .limit(10);

    // Visits by date (last 7 days)
    const visitsByDate = await db
      .select({
        date: sql`DATE(${siteVisits.createdAt})`.as('date'),
        visits: count(),
      })
      .from(siteVisits)
      .where(sql`${siteVisits.createdAt} >= ${weekStart}`)
      .groupBy(sql`DATE(${siteVisits.createdAt})`)
      .orderBy(sql`DATE(${siteVisits.createdAt})`);

    return {
      totalVisits: totalVisits[0]?.count || 0,
      todayVisits: todayVisits[0]?.count || 0,
      weekVisits: weekVisits[0]?.count || 0,
      recentVisits,
      visitsByDate,
    };
  }

  async updateSiteVisitStatus(id: string, status: string): Promise<SiteVisit | undefined> {
    // Note: This would require adding a status field to the siteVisits table
    // For now, this is a placeholder for future implementation
    const [visit] = await db.select().from(siteVisits).where(eq(siteVisits.id, id));
    return visit || undefined;
  }

  async deleteSiteVisit(id: string): Promise<boolean> {
    const result = await db.delete(siteVisits).where(eq(siteVisits.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
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
    return (result.rowCount ?? 0) > 0;
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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Total downloads
    const totalDownloads = await db
      .select({ count: count() })
      .from(brochureDownloads);

    // Today's downloads
    const todayDownloads = await db
      .select({ count: count() })
      .from(brochureDownloads)
      .where(sql`${brochureDownloads.downloadedAt} >= ${todayStart}`);

    // Unique users
    const uniqueUsers = await db
      .select({ count: count(sql`DISTINCT ${brochureDownloads.userEmail}`) })
      .from(brochureDownloads);

    // Top brochures
    const topBrochures = await db
      .select({
        id: brochureDownloads.brochureId,
        title: brochures.title,
        downloadCount: count(),
      })
      .from(brochureDownloads)
      .leftJoin(brochures, eq(brochureDownloads.brochureId, brochures.id))
      .groupBy(brochureDownloads.brochureId, brochures.title)
      .orderBy(desc(count()))
      .limit(5);

    // Recent downloads
    const recentDownloads = await db
      .select({
        id: brochureDownloads.id,
        brochureId: brochureDownloads.brochureId,
        brochureTitle: brochures.title,
        userName: brochureDownloads.userName,
        userEmail: brochureDownloads.userEmail,
        userPhone: brochureDownloads.userPhone,
        downloadedAt: brochureDownloads.downloadedAt,
      })
      .from(brochureDownloads)
      .leftJoin(brochures, eq(brochureDownloads.brochureId, brochures.id))
      .orderBy(desc(brochureDownloads.downloadedAt))
      .limit(10);

    // Downloads by date (last 7 days)
    const downloadsByDate = await db
      .select({
        date: sql`DATE(${brochureDownloads.downloadedAt})`.as('date'),
        downloads: count(),
      })
      .from(brochureDownloads)
      .where(sql`${brochureDownloads.downloadedAt} >= ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}`)
      .groupBy(sql`DATE(${brochureDownloads.downloadedAt})`)
      .orderBy(sql`DATE(${brochureDownloads.downloadedAt})`);

    return {
      totalDownloads: totalDownloads[0]?.count || 0,
      todayDownloads: todayDownloads[0]?.count || 0,
      uniqueUsers: uniqueUsers[0]?.count || 0,
      topBrochures,
      recentDownloads,
      downloadsByDate,
    };
  }

  async deleteBrochureDownload(id: string): Promise<boolean> {
    const result = await db.delete(brochureDownloads).where(eq(brochureDownloads.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Video operations
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async clearAllVideos(): Promise<void> {
    await db.delete(videos);
  }

  // Activity operations
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.createdAt));
  }

  async getRecentActivities(): Promise<Activity[]> {
    // Get activities from today and yesterday
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    return await db
      .select()
      .from(activities)
      .where(sql`${activities.createdAt} >= ${twoDaysAgo}`)
      .orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivity(id: string, activityData: InsertActivity): Promise<Activity | undefined> {
    const [updatedActivity] = await db
      .update(activities)
      .set(activityData)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity || undefined;
  }

  async deleteActivity(id: string): Promise<boolean> {
    try {
      const result = await db.delete(activities).where(eq(activities.id, id));
      return true; // If no error, deletion was successful
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  }

  // Admin settings operations
  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    const [setting] = await db.select().from(adminSettings).where(eq(adminSettings.key, key));
    return setting || undefined;
  }

  async upsertAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    const [upsertedSetting] = await db
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
    return upsertedSetting;
  }

  // Initialize with sample data
  async initializeData() {
    // Check if data already exists first
    const existingBrochures = await this.getBrochures();
    const isFirstRun = existingBrochures.length === 0;
    
    // Always reset videos regardless of other data
    await this.resetVideos(isFirstRun);
    
    if (!isFirstRun) return;

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

    // Videos are handled in resetVideos() method
  }

  // Reset videos to current configuration
  async resetVideos(includeInitialData: boolean = false) {
    // Clear all existing videos
    await this.clearAllVideos();
    
    // Add the single video
    const videoData = [
      {
        title: "Project Video",
        description: "Watch our project overview video",
        videoUrl: "https://drive.google.com/file/d/12OIaXhanE8S2aoB1JQCwe00ODNLNVwsR/preview",
        thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "2:27",
        category: "project"
      }
    ];

    for (const video of videoData) {
      await this.createVideo(video);
    }

    // Only initialize sample brochure downloads on first run
    if (includeInitialData) {
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
    }
  }



  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async getUserAchievements(userEmail: string): Promise<UserAchievement[]> {
    return await db
      .select({
        id: userAchievements.id,
        userEmail: userAchievements.userEmail,
        achievementId: userAchievements.achievementId,
        unlockedAt: userAchievements.unlockedAt,
        progress: userAchievements.progress,
        isCompleted: userAchievements.isCompleted,
        achievementName: achievements.name,
        achievementDescription: achievements.description,
        achievementIcon: achievements.icon,
        achievementCategory: achievements.category,
        achievementRarity: achievements.rarity,
        pointsRequired: achievements.pointsRequired,
      })
      .from(userAchievements)
      .leftJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userEmail, userEmail))
      .orderBy(userAchievements.unlockedAt);
  }

  async unlockAchievement(userEmail: string, achievementId: string): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userEmail,
        achievementId,
        progress: 100,
        isCompleted: true,
      })
      .onConflictDoUpdate({
        target: [userAchievements.userEmail, userAchievements.achievementId],
        set: {
          progress: 100,
          isCompleted: true,
          unlockedAt: new Date(),
        },
      })
      .returning();
    return userAchievement;
  }

  async updateAchievementProgress(userEmail: string, achievementId: string, progress: number): Promise<void> {
    await db
      .insert(userAchievements)
      .values({
        userEmail,
        achievementId,
        progress,
        isCompleted: progress >= 100,
      })
      .onConflictDoUpdate({
        target: [userAchievements.userEmail, userAchievements.achievementId],
        set: {
          progress,
          isCompleted: progress >= 100,
          unlockedAt: progress >= 100 ? new Date() : sql`${userAchievements.unlockedAt}`,
        },
      });
  }

  // Engagement tracking operations
  async recordEngagementEvent(event: InsertEngagementEvent): Promise<EngagementEvent> {
    const [newEvent] = await db.insert(engagementEvents).values(event).returning();
    
    // Update user profile with new activity
    const profile = await this.getUserProfile(event.userEmail);
    if (profile) {
      const newPoints = profile.totalPoints + (event.pointsEarned || 0);
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points
      
      // Calculate streak
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastActivity = profile.lastActivityDate ? new Date(profile.lastActivityDate) : null;
      
      let currentStreak = profile.currentStreak;
      if (!lastActivity || lastActivity < yesterday) {
        currentStreak = 1; // Reset streak
      } else if (lastActivity.toDateString() === yesterday.toDateString()) {
        currentStreak += 1; // Continue streak
      }
      
      await this.updateUserProfile(event.userEmail, {
        totalPoints: newPoints,
        level: newLevel,
        currentStreak,
        longestStreak: Math.max(profile.longestStreak, currentStreak),
        lastActivityDate: today,
      });
    } else {
      // Create new profile if it doesn't exist
      await this.createUserProfile({
        email: event.userEmail,
        name: event.userEmail.split('@')[0], // Use email prefix as default name
        totalPoints: event.pointsEarned || 0,
        level: 1,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
      });
    }
    
    return newEvent;
  }

  async getUserEngagementStats(userEmail: string): Promise<any> {
    const profile = await this.getUserProfile(userEmail);
    const achievements = await this.getUserAchievements(userEmail);
    
    // Get recent events (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentEvents = await db
      .select()
      .from(engagementEvents)
      .where(sql`${engagementEvents.userEmail} = ${userEmail} AND ${engagementEvents.createdAt} >= ${thirtyDaysAgo}`)
      .orderBy(desc(engagementEvents.createdAt));

    // Calculate engagement stats
    const totalEvents = recentEvents.length;
    const totalPoints = recentEvents.reduce((sum, event) => sum + (event.pointsEarned || 0), 0);
    const eventsByType = recentEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const completedAchievements = achievements.filter(a => a.isCompleted).length;
    const totalAchievements = await db.select({ count: count() }).from(achievements);

    return {
      profile,
      achievements,
      stats: {
        totalEvents,
        totalPoints,
        eventsByType,
        completedAchievements,
        totalAchievements: totalAchievements[0]?.count || 0,
        recentEvents: recentEvents.slice(0, 10),
      },
    };
  }

  async getEngagementLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all_time'): Promise<Leaderboard[]> {
    return await db
      .select()
      .from(leaderboards)
      .where(eq(leaderboards.period, period))
      .orderBy(leaderboards.rank)
      .limit(50);
  }

  async updateLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all_time'): Promise<void> {
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all_time':
        startDate = new Date(0);
        break;
    }

    // Get user points for the period
    const userStats = await db
      .select({
        userEmail: engagementEvents.userEmail,
        points: sql`SUM(${engagementEvents.pointsEarned})`.as('points'),
        events: count(),
      })
      .from(engagementEvents)
      .where(sql`${engagementEvents.createdAt} >= ${startDate}`)
      .groupBy(engagementEvents.userEmail)
      .orderBy(sql`SUM(${engagementEvents.pointsEarned}) DESC`)
      .limit(100);

    // Clear existing leaderboard for this period
    await db.delete(leaderboards).where(eq(leaderboards.period, period));

    // Insert new leaderboard entries
    if (userStats.length > 0) {
      const leaderboardEntries = userStats.map((stat, index) => ({
        period,
        userEmail: stat.userEmail,
        userName: stat.userEmail.split('@')[0], // Use email prefix as name
        points: Number(stat.points) || 0,
        rank: index + 1,
        achievements: 0, // Will be calculated separately
      }));

      await db.insert(leaderboards).values(leaderboardEntries);
    }
  }

  async getGamificationStats(): Promise<any> {
    const totalUsers = await db.select({ count: count() }).from(userProfiles);
    const totalEvents = await db.select({ count: count() }).from(engagementEvents);
    const totalAchievements = await db.select({ count: count() }).from(achievements);
    const totalPoints = await db
      .select({ sum: sql`SUM(${userProfiles.totalPoints})`.as('sum') })
      .from(userProfiles);

    // Top users by level
    const topUsers = await db
      .select()
      .from(userProfiles)
      .orderBy(desc(userProfiles.level), desc(userProfiles.totalPoints))
      .limit(10);

    // Most popular events
    const popularEvents = await db
      .select({
        eventType: engagementEvents.eventType,
        count: count(),
        totalPoints: sql`SUM(${engagementEvents.pointsEarned})`.as('totalPoints'),
      })
      .from(engagementEvents)
      .groupBy(engagementEvents.eventType)
      .orderBy(desc(count()))
      .limit(10);

    return {
      overview: {
        totalUsers: totalUsers[0]?.count || 0,
        totalEvents: totalEvents[0]?.count || 0,
        totalAchievements: totalAchievements[0]?.count || 0,
        totalPoints: Number(totalPoints[0]?.sum) || 0,
      },
      topUsers,
      popularEvents,
    };
  }

  // Initialize sample achievements
  async initializeGamificationData(): Promise<void> {
    try {
      // Check if achievements already exist
      const existingAchievements = await this.getAchievements();
      if (existingAchievements.length > 0) {
        return; // Already initialized
      }

      // Create sample achievements
      const sampleAchievements = [
        // Download achievements
        {
          name: "First Download",
          description: "Download your first brochure",
          icon: "Download",
          category: "downloads",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'download_count', target: 1 }),
          rarity: "common",
        },
        {
          name: "Information Seeker",
          description: "Download 5 different brochures",
          icon: "BookOpen",
          category: "downloads",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'download_count', target: 5 }),
          rarity: "rare",
        },
        {
          name: "Document Collector",
          description: "Download 10 different brochures",
          icon: "FolderOpen",
          category: "downloads",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'download_count', target: 10 }),
          rarity: "epic",
        },

        // Visit booking achievements
        {
          name: "Site Visitor",
          description: "Book your first site visit",
          icon: "MapPin",
          category: "visits",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'visit_count', target: 1 }),
          rarity: "common",
        },
        {
          name: "Serious Investor",
          description: "Book 3 site visits",
          icon: "Building",
          category: "visits",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'visit_count', target: 3 }),
          rarity: "rare",
        },

        // Engagement achievements
        {
          name: "Points Collector",
          description: "Earn your first 100 points",
          icon: "Star",
          category: "engagement",
          pointsRequired: 100,
          condition: JSON.stringify({ type: 'points', target: 100 }),
          rarity: "common",
        },
        {
          name: "Rising Investor",
          description: "Earn 500 points",
          icon: "TrendingUp",
          category: "engagement",
          pointsRequired: 500,
          condition: JSON.stringify({ type: 'points', target: 500 }),
          rarity: "rare",
        },
        {
          name: "Investment Expert",
          description: "Earn 1000 points",
          icon: "Award",
          category: "engagement",
          pointsRequired: 1000,
          condition: JSON.stringify({ type: 'points', target: 1000 }),
          rarity: "epic",
        },
        {
          name: "Elite Investor",
          description: "Earn 2500 points",
          icon: "Crown",
          category: "engagement",
          pointsRequired: 2500,
          condition: JSON.stringify({ type: 'points', target: 2500 }),
          rarity: "legendary",
        },

        // Streak achievements
        {
          name: "Consistent Visitor",
          description: "Maintain a 7-day activity streak",
          icon: "Calendar",
          category: "engagement",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'streak', target: 7 }),
          rarity: "rare",
        },
        {
          name: "Dedicated Explorer",
          description: "Maintain a 30-day activity streak",
          icon: "Flame",
          category: "engagement",
          pointsRequired: 0,
          condition: JSON.stringify({ type: 'streak', target: 30 }),
          rarity: "legendary",
        },
      ];

      for (const achievement of sampleAchievements) {
        await this.createAchievement(achievement);
      }

      console.log("Gamification achievements initialized successfully");
    } catch (error) {
      console.error("Failed to initialize gamification data:", error);
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize data when the module is loaded
storage.initializeData().catch(console.error);

