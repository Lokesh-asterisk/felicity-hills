import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSiteVisitSchema, 
  insertTestimonialSchema, 
  insertActivitySchema, 
  insertAdminSettingSchema,
  insertLeadSchema,
  insertAppointmentSchema,
  insertFollowUpSchema
} from "@shared/schema";
import { setupBrochuresWithPdfs } from "./setupBrochures";
import { EmailService } from "./emailService";
import { z } from "zod";
import express from "express";
import path from "path";
import bcrypt from "bcryptjs";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Configure session middleware
  const PostgresqlStore = connectPgSimple(session);
  
  app.use(session({
    store: new PostgresqlStore({
      conString: process.env.DATABASE_URL,
      tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'khushalipur-admin-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Simplified admin authentication middleware
  const requireAdminAuth = (req: any, res: any, next: any) => {
    // For now, allow all admin requests to pass through
    next();
  };
  
  // Configure multer for file uploads
  const upload = multer({ storage: multer.memoryStorage() });
  
  // Serve static files (PDFs, HTML brochures, and images)
  app.use('/pdfs', express.static(path.join(process.cwd(), 'public', 'pdfs')));
  app.use('/brochures', express.static(path.join(process.cwd(), 'public', 'brochures')));
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  // Initialize brochures with PDFs on startup
  try {
    await setupBrochuresWithPdfs();
    console.log("Brochures with PDFs initialized successfully");
  } catch (error) {
    console.error("Failed to initialize brochures:", error);
  }
  
  // Get all plots
  app.get("/api/plots", async (_req, res) => {
    try {
      const plots = await storage.getPlots();
      res.json(plots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plots" });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Get recent activities (today and yesterday)
  app.get("/api/activities/recent", async (_req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  // Get all activities
  app.get("/api/activities", async (_req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Create new activity
  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create activity" });
      }
    }
  });

  // Update activity
  app.put("/api/activities/:id", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.updateActivity(req.params.id, activityData);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Error updating activity:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update activity" });
      }
    }
  });

  // Delete activity
  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const success = await storage.deleteActivity(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Admin testimonial management endpoints
  app.post("/api/admin/testimonials", requireAdminAuth, async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create testimonial" });
      }
    }
  });

  app.put("/api/admin/testimonials/:id", requireAdminAuth, async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, testimonialData);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update testimonial" });
      }
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteTestimonial(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Get all site visits (admin)
  app.get("/api/admin/site-visits", requireAdminAuth, async (_req, res) => {
    try {
      const siteVisits = await storage.getSiteVisits();
      res.json(siteVisits);
    } catch (error) {
      console.error("Error fetching site visits:", error);
      res.status(500).json({ message: "Failed to fetch site visits" });
    }
  });

  // Get site visit statistics (admin)
  app.get("/api/admin/site-visit-stats", requireAdminAuth, async (_req, res) => {
    try {
      const stats = await storage.getSiteVisitStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching site visit stats:", error);
      res.status(500).json({ message: "Failed to fetch site visit statistics" });
    }
  });

  // Delete site visit (admin)
  app.delete("/api/admin/site-visits/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteSiteVisit(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Site visit not found" });
      }
      res.json({ message: "Site visit deleted successfully" });
    } catch (error) {
      console.error("Error deleting site visit:", error);
      res.status(500).json({ message: "Failed to delete site visit" });
    }
  });

  // Create site visit booking
  app.post("/api/site-visits", async (req, res) => {
    try {
      // Extract projectId from request body before validation
      const { projectId, ...siteVisitBody } = req.body;
      
      const siteVisitData = insertSiteVisitSchema.parse(siteVisitBody);
      const siteVisit = await storage.createSiteVisit(siteVisitData);
      
      // Fetch project details if projectId is provided
      let projectInfo = null;
      if (projectId) {
        try {
          projectInfo = await storage.getProject(projectId);
        } catch (error) {
          console.warn('Could not fetch project details:', error);
        }
      }
      
      // Send email notifications
      const emailService = EmailService.getInstance();
      
      // Prepare booking details for emails
      const bookingDetails = {
        name: siteVisit.name,
        email: siteVisit.email || '',
        mobile: siteVisit.mobile,
        preferredDate: siteVisit.preferredDate,
        plotSize: siteVisit.plotSize,
        budget: siteVisit.budget,
        project: projectInfo ? `${projectInfo.name} (${projectInfo.location})` : 'General Inquiry'
      };
      
      // Send confirmation email to user (if email provided)
      if (siteVisit.email) {
        const userEmailSent = await emailService.sendBookingConfirmation(bookingDetails);
        if (!userEmailSent) {
          console.warn('Failed to send confirmation email to user');
        }
      }
      
      // Send alert email to admin
      const adminEmailSent = await emailService.sendAdminAlert(bookingDetails);
      if (!adminEmailSent) {
        console.warn('Failed to send alert email to admin');
      }
      
      res.status(201).json({
        ...siteVisit,
        emailStatus: {
          userNotified: siteVisit.email ? true : false,
          adminNotified: adminEmailSent
        }
      });
    } catch (error) {
      console.error('Site visit booking error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create site visit booking" });
      }
    }
  });

  // Get brochures
  app.get("/api/brochures", async (_req, res) => {
    try {
      const brochures = await storage.getBrochures();
      res.json(brochures);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brochures" });
    }
  });

  // Track brochure download
  app.post("/api/brochures/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const { userName, userEmail, userPhone } = req.body;

      if (!userName || !userEmail) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      const brochure = await storage.getBrochure(id);
      if (!brochure) {
        return res.status(404).json({ message: "Brochure not found" });
      }

      // Track the download
      await storage.createBrochureDownload({
        brochureId: id,
        userName,
        userEmail,
        userPhone: userPhone || null,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      });

      res.json({ 
        success: true, 
        downloadUrl: brochure.downloadUrl,
        message: "Download tracked successfully" 
      });
    } catch (error) {
      console.error("Error tracking brochure download:", error);
      res.status(500).json({ message: "Failed to track download" });
    }
  });

  // Admin routes for brochure management
  app.get("/api/admin/brochure-downloads", requireAdminAuth, async (req, res) => {
    try {
      const downloads = await storage.getBrochureDownloads();
      res.json(downloads);
    } catch (error) {
      console.error("Error fetching brochure downloads:", error);
      res.status(500).json({ message: "Failed to fetch downloads" });
    }
  });

  app.get("/api/admin/brochure-stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await storage.getBrochureDownloadStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching brochure stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.delete("/api/admin/brochure-downloads/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await storage.deleteBrochureDownload(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Download record not found" });
      }
      res.json({ message: "Download record deleted successfully" });
    } catch (error) {
      console.error("Error deleting brochure download:", error);
      res.status(500).json({ message: "Failed to delete download record" });
    }
  });

  // Bulk delete brochure downloads
  app.delete("/api/admin/brochure-downloads", requireAdminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid request: 'ids' array is required" });
      }
      
      let deletedCount = 0;
      const failures = [];
      
      for (const id of ids) {
        try {
          const success = await storage.deleteBrochureDownload(id);
          if (success) {
            deletedCount++;
          } else {
            failures.push(id);
          }
        } catch (error) {
          failures.push(id);
        }
      }
      
      res.json({ 
        message: `Successfully deleted ${deletedCount} download records`,
        deletedCount,
        failures: failures.length > 0 ? failures : undefined
      });
    } catch (error) {
      console.error("Error bulk deleting brochure downloads:", error);
      res.status(500).json({ message: "Failed to bulk delete download records" });
    }
  });

  // Admin password management
  app.post("/api/admin/change-password", requireAdminAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      
      // Get current password from settings
      const passwordSetting = await storage.getAdminSetting("admin_password");
      const currentHashedPassword = passwordSetting?.value || "khushalipur2025"; // fallback to default
      
      // Verify current password
      let isCurrentPasswordValid = false;
      if (passwordSetting) {
        // Check if it's hashed (starts with $2a$ or $2b$)
        if (currentHashedPassword.startsWith("$2")) {
          isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentHashedPassword);
        } else {
          // Plain text comparison for backwards compatibility
          isCurrentPasswordValid = currentPassword === currentHashedPassword;
        }
      } else {
        // No setting exists, check against default
        isCurrentPasswordValid = currentPassword === "khushalipur2025";
      }
      
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Save the new password
      await storage.upsertAdminSetting({
        key: "admin_password",
        value: hashedNewPassword
      });
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing admin password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  app.post("/api/admin/verify-password", async (req: any, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      
      // Get current password from settings
      const passwordSetting = await storage.getAdminSetting("admin_password");
      const storedPassword = passwordSetting?.value || "khushalipur2025"; // fallback to default
      
      let isPasswordValid = false;
      if (passwordSetting && storedPassword.startsWith("$2")) {
        // Hashed password
        isPasswordValid = await bcrypt.compare(password, storedPassword);
      } else {
        // Plain text comparison for default or legacy passwords
        isPasswordValid = password === storedPassword;
      }
      
      if (isPasswordValid) {
        // Set admin authentication in session
        req.session.adminAuthenticated = true;
        res.json({ valid: true });
      } else {
        res.status(401).json({ valid: false, message: "Invalid password" });
      }
    } catch (error) {
      console.error("Error verifying admin password:", error);
      res.status(500).json({ message: "Failed to verify password" });
    }
  });

  // Add admin logout endpoint
  app.post("/api/admin/logout", (req: any, res) => {
    req.session?.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  // Project showcase management routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { status, type, featured } = req.query as { status?: string; type?: string; featured?: string };
      const filters: any = {};
      
      if (status) filters.status = status;
      if (type) filters.type = type;
      if (featured !== undefined) filters.featured = featured === 'true';
      
      const projects = await storage.getProjects(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Admin project management routes
  app.post("/api/admin/projects", requireAdminAuth, async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const updatedProject = await storage.updateProject(req.params.id, req.body);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post("/api/admin/projects/:id/toggle-featured", requireAdminAuth, async (req, res) => {
    try {
      const updatedProject = await storage.toggleProjectFeatured(req.params.id);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      console.error("Error toggling project featured status:", error);
      res.status(500).json({ message: "Failed to toggle featured status" });
    }
  });

  app.post("/api/admin/projects/:id/update-order", requireAdminAuth, async (req, res) => {
    try {
      const { sortOrder } = req.body;
      const updatedProject = await storage.updateProjectOrder(req.params.id, sortOrder);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project order:", error);
      res.status(500).json({ message: "Failed to update project order" });
    }
  });

  app.get("/api/admin/project-stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await storage.getProjectStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching project stats:", error);
      res.status(500).json({ message: "Failed to fetch project stats" });
    }
  });

  // Get videos
  app.get("/api/videos", async (_req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // CRM Routes
  // Lead routes
  app.get("/api/leads", async (req, res) => {
    try {
      const { status, source, search } = req.query as { status?: string; source?: string; search?: string };
      const leads = await storage.getLeads({ status, source, search });
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/stats", async (_req, res) => {
    try {
      const stats = await storage.getLeadStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      res.status(500).json({ message: "Failed to fetch lead stats" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create lead" });
      }
    }
  });

  app.put("/api/leads/:id", async (req, res) => {
    try {
      const leadData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(req.params.id, leadData);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update lead" });
      }
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const success = await storage.deleteLead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Import leads from CSV
  app.post("/api/leads/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const results: any[] = [];
      const stream = Readable.from(req.file.buffer);
      
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            let importedCount = 0;
            let errorCount = 0;

            for (const row of results) {
              try {
                // Map CSV columns to lead schema
                const leadData = {
                  firstName: row.firstName || row.first_name || '',
                  lastName: row.lastName || row.last_name || '',
                  email: row.email || '',
                  phone: row.phone || '',
                  company: row.company || '',
                  status: row.status || 'new',
                  source: row.source || 'import',
                  interestLevel: row.interestLevel || row.interest_level || 'medium',
                  budget: row.budget || '',
                  notes: row.notes || ''
                };

                // Validate required fields
                if (!leadData.firstName || !leadData.lastName || !leadData.phone) {
                  errorCount++;
                  continue;
                }

                // Validate and parse with schema
                const validatedData = insertLeadSchema.parse(leadData);
                await storage.createLead(validatedData);
                importedCount++;
              } catch (error) {
                console.error("Error importing lead row:", error);
                errorCount++;
              }
            }

            res.json({ 
              count: importedCount, 
              errors: errorCount,
              message: `Successfully imported ${importedCount} leads${errorCount > 0 ? ` (${errorCount} errors)` : ''}`
            });
          } catch (error) {
            console.error("Error processing CSV:", error);
            res.status(500).json({ message: "Failed to process CSV data" });
          }
        })
        .on('error', (error) => {
          console.error("CSV parsing error:", error);
          res.status(400).json({ message: "Invalid CSV format" });
        });
    } catch (error) {
      console.error("Error importing leads:", error);
      res.status(500).json({ message: "Failed to import leads" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const { status, leadId, date } = req.query as { status?: string; leadId?: string; date?: string };
      const appointments = await storage.getAppointments({ status, leadId, date });
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/today", async (_req, res) => {
    try {
      const appointments = await storage.getTodaysAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      res.status(500).json({ message: "Failed to fetch today's appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create appointment" });
      }
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(req.params.id, appointmentData);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update appointment" });
      }
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const success = await storage.deleteAppointment(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Follow-up routes
  app.get("/api/follow-ups", async (req, res) => {
    try {
      const { status, leadId, assignedTo } = req.query as { status?: string; leadId?: string; assignedTo?: string };
      const followUps = await storage.getFollowUps({ status, leadId, assignedTo });
      res.json(followUps);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      res.status(500).json({ message: "Failed to fetch follow-ups" });
    }
  });

  app.get("/api/follow-ups/overdue", async (_req, res) => {
    try {
      const followUps = await storage.getOverdueFollowUps();
      res.json(followUps);
    } catch (error) {
      console.error("Error fetching overdue follow-ups:", error);
      res.status(500).json({ message: "Failed to fetch overdue follow-ups" });
    }
  });

  app.get("/api/follow-ups/:id", async (req, res) => {
    try {
      const followUp = await storage.getFollowUp(req.params.id);
      if (!followUp) {
        return res.status(404).json({ message: "Follow-up not found" });
      }
      res.json(followUp);
    } catch (error) {
      console.error("Error fetching follow-up:", error);
      res.status(500).json({ message: "Failed to fetch follow-up" });
    }
  });

  app.post("/api/follow-ups", async (req, res) => {
    try {
      const followUpData = insertFollowUpSchema.parse(req.body);
      const followUp = await storage.createFollowUp(followUpData);
      res.json(followUp);
    } catch (error) {
      console.error("Error creating follow-up:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create follow-up" });
      }
    }
  });

  app.put("/api/follow-ups/:id", async (req, res) => {
    try {
      const followUpData = insertFollowUpSchema.partial().parse(req.body);
      const followUp = await storage.updateFollowUp(req.params.id, followUpData);
      if (!followUp) {
        return res.status(404).json({ message: "Follow-up not found" });
      }
      res.json(followUp);
    } catch (error) {
      console.error("Error updating follow-up:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update follow-up" });
      }
    }
  });

  app.delete("/api/follow-ups/:id", async (req, res) => {
    try {
      const success = await storage.deleteFollowUp(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Follow-up not found" });
      }
      res.json({ message: "Follow-up deleted successfully" });
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      res.status(500).json({ message: "Failed to delete follow-up" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
