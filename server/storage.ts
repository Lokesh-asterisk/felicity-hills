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
  leads,
  appointments,
  followUps,
  type Plot,
  type SiteVisit,
  type Testimonial,
  type Brochure,
  type Video,
  type BrochureDownload,
  type Activity,
  type User,
  type AdminSetting,
  type Lead,
  type Appointment,
  type FollowUp,
  type InsertPlot,
  type InsertSiteVisit,
  type InsertTestimonial,
  type InsertBrochure,
  type InsertVideo,
  type InsertBrochureDownload,
  type InsertActivity,
  type InsertUser,
  type InsertAdminSetting,
  type InsertLead,
  type InsertAppointment,
  type InsertFollowUp,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, or, gte, lte, like, ilike } from "drizzle-orm";

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

  // CRM operations
  // Lead operations
  getLeads(filters?: { status?: string; source?: string; search?: string }): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;
  getLeadStats(): Promise<any>;

  // Appointment operations
  getAppointments(filters?: { status?: string; leadId?: string; date?: string }): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  getTodaysAppointments(): Promise<Appointment[]>;

  // Follow-up operations
  getFollowUps(filters?: { status?: string; leadId?: string; assignedTo?: string }): Promise<FollowUp[]>;
  getFollowUp(id: string): Promise<FollowUp | undefined>;
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
  updateFollowUp(id: string, followUp: Partial<InsertFollowUp>): Promise<FollowUp | undefined>;
  deleteFollowUp(id: string): Promise<boolean>;
  getOverdueFollowUps(): Promise<FollowUp[]>;
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

  // CRM operations implementation
  // Lead operations
  async getLeads(filters?: { status?: string; source?: string; search?: string }): Promise<Lead[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.status) {
        conditions.push(eq(leads.status, filters.status));
      }
      if (filters.source) {
        conditions.push(eq(leads.source, filters.source));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(leads.firstName, `%${filters.search}%`),
            ilike(leads.lastName, `%${filters.search}%`),
            ilike(leads.email, `%${filters.search}%`),
            ilike(leads.phone, `%${filters.search}%`)
          )
        );
      }
    }
    
    const query = conditions.length > 0 
      ? db.select().from(leads).where(and(...conditions))
      : db.select().from(leads);
    
    return await query.orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLead(id: string, leadData: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...leadData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead || undefined;
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getLeadStats(): Promise<any> {
    const total = await db.select({ count: count() }).from(leads);
    const newLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'new'));
    const qualified = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'qualified'));
    const converted = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'converted'));
    
    return {
      total: total[0]?.count || 0,
      new: newLeads[0]?.count || 0,
      qualified: qualified[0]?.count || 0,
      converted: converted[0]?.count || 0,
    };
  }

  // Appointment operations
  async getAppointments(filters?: { status?: string; leadId?: string; date?: string }): Promise<Appointment[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.status) {
        conditions.push(eq(appointments.status, filters.status));
      }
      if (filters.leadId) {
        conditions.push(eq(appointments.leadId, filters.leadId));
      }
      if (filters.date) {
        conditions.push(
          sql`DATE(${appointments.appointmentDate}) = ${filters.date}`
        );
      }
    }
    
    const query = conditions.length > 0 
      ? db.select().from(appointments).where(and(...conditions))
      : db.select().from(appointments);
    
    return await query.orderBy(desc(appointments.appointmentDate));
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: string, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointmentData, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment || undefined;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTodaysAppointments(): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        sql`DATE(${appointments.appointmentDate}) = CURRENT_DATE`
      )
      .orderBy(appointments.appointmentDate);
  }

  // Follow-up operations
  async getFollowUps(filters?: { status?: string; leadId?: string; assignedTo?: string }): Promise<FollowUp[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.status) {
        conditions.push(eq(followUps.status, filters.status));
      }
      if (filters.leadId) {
        conditions.push(eq(followUps.leadId, filters.leadId));
      }
      if (filters.assignedTo) {
        conditions.push(eq(followUps.assignedTo, filters.assignedTo));
      }
    }
    
    const query = conditions.length > 0 
      ? db.select().from(followUps).where(and(...conditions))
      : db.select().from(followUps);
    
    return await query.orderBy(desc(followUps.dueDate));
  }

  async getFollowUp(id: string): Promise<FollowUp | undefined> {
    const [followUp] = await db.select().from(followUps).where(eq(followUps.id, id));
    return followUp || undefined;
  }

  async createFollowUp(followUp: InsertFollowUp): Promise<FollowUp> {
    const [newFollowUp] = await db.insert(followUps).values(followUp).returning();
    return newFollowUp;
  }

  async updateFollowUp(id: string, followUpData: Partial<InsertFollowUp>): Promise<FollowUp | undefined> {
    const [updatedFollowUp] = await db
      .update(followUps)
      .set({ ...followUpData, updatedAt: new Date() })
      .where(eq(followUps.id, id))
      .returning();
    return updatedFollowUp || undefined;
  }

  async deleteFollowUp(id: string): Promise<boolean> {
    const result = await db.delete(followUps).where(eq(followUps.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getOverdueFollowUps(): Promise<FollowUp[]> {
    return await db
      .select()
      .from(followUps)
      .where(
        and(
          lte(followUps.dueDate, new Date()),
          eq(followUps.status, 'pending')
        )
      )
      .orderBy(followUps.dueDate);
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
            sizeInSqft: 4500, // 500 sq yards = 4,500 sq ft
            pricePerSqYd: 3000,
            pricePerSqft: 333,
            roadWidth: 20,
            category: "premium",
            features: ["Water Connection", "Electricity", "Road Access", "Fertile Soil"],
            available: true,
            location: "gate_facing",
            soilType: "loamy",
            waterAccess: true,
            roadAccess: "paved",
            nearbyAmenities: ["School", "Hospital"],
          },
          {
            plotNumber: "B-002",
            size: 750,
            sizeInSqft: 6750, // 750 sq yards = 6,750 sq ft
            pricePerSqYd: 3000,
            pricePerSqft: 333,
            roadWidth: 30,
            category: "premium",
            features: ["Water Connection", "Electricity", "Road Access", "Organic Certified"],
            available: true,
            location: "corner",
            soilType: "sandy",
            waterAccess: true,
            roadAccess: "paved",
            nearbyAmenities: ["Market", "Temple"],
          },
          {
            plotNumber: "C-003",
            size: 1000,
            sizeInSqft: 9000, // 1000 sq yards = 9,000 sq ft
            pricePerSqYd: 3000,
            pricePerSqft: 333,
            roadWidth: 40,
            category: "cottage",
            features: ["Water Connection", "Electricity", "Corner Plot", "Prime Location"],
            available: false,
            location: "pool_facing",
            soilType: "clay",
            waterAccess: true,
            roadAccess: "paved",
            nearbyAmenities: ["Shopping Center", "Bank"],
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

      // Initialize sample CRM data if none exist
      const existingLeads = await this.getLeads({});
      if (existingLeads.length === 0) {
        const sampleLeads = [
          {
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@example.com",
            phone: "+1-555-0123",
            company: "Tech Solutions Inc",
            status: "new",
            source: "website",
            propertyInterests: ["Residential", "Commercial"],
            budget: "$500,000 - $1,000,000",
            notes: "Interested in properties near the city center. First-time buyer."
          },
          {
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@example.com",
            phone: "+1-555-0124",
            company: "Design Studio",
            status: "qualified",
            source: "referral",
            propertyInterests: ["Office Space", "Warehouse"],
            budget: "$1,000,000+",
            notes: "Expanding business, needs commercial space by Q2."
          },
          {
            firstName: "Michael",
            lastName: "Brown",
            email: "m.brown@example.com",
            phone: "+1-555-0125",
            status: "contacted",
            source: "social_media",
            propertyInterests: ["Residential"],
            budget: "$300,000 - $500,000",
            notes: "Young family looking for their first home. Prefers good school district."
          }
        ];

        for (const lead of sampleLeads) {
          await this.createLead(lead);
        }
      }

      // Initialize sample appointments if none exist
      const existingAppointments = await this.getAppointments({});
      if (existingAppointments.length === 0) {
        const leadIds = await this.getLeads({});
        if (leadIds.length > 0) {
          const sampleAppointments = [
            {
              leadId: leadIds[0].id,
              title: "Property Viewing - Downtown Office",
              description: "Show downtown office space options",
              appointmentDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
              duration: 90,
              location: "123 Main St, Downtown",
              status: "scheduled"
            },
            {
              leadId: leadIds[1].id,
              title: "Investment Consultation",
              description: "Discuss investment property options",
              appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              duration: 60,
              location: "Our Office",
              status: "confirmed"
            }
          ];

          for (const appointment of sampleAppointments) {
            await this.createAppointment(appointment);
          }
        }
      }

      // Initialize sample follow-ups if none exist
      const existingFollowUps = await this.getFollowUps({});
      if (existingFollowUps.length === 0) {
        const leadIds = await this.getLeads({});
        if (leadIds.length > 0) {
          const sampleFollowUps = [
            {
              leadId: leadIds[0].id,
              title: "Follow up on property interest",
              description: "Check if client is still interested in the downtown properties we showed",
              dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
              priority: "high",
              status: "pending"
            },
            {
              leadId: leadIds[1].id,
              title: "Send market analysis report",
              description: "Prepare and send market analysis for commercial properties",
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              priority: "medium",
              status: "pending"
            },
            {
              leadId: leadIds[2].id,
              title: "Schedule school district tour",
              description: "Arrange tour of local schools for family",
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
              priority: "low",
              status: "pending"
            }
          ];

          for (const followUp of sampleFollowUps) {
            await this.createFollowUp(followUp);
          }
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