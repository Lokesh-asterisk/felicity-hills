import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSiteVisitSchema, insertTestimonialSchema, insertActivitySchema, insertAdminSettingSchema } from "@shared/schema";
import { setupBrochuresWithPdfs } from "./setupBrochures";
import { EmailService } from "./emailService";
import { z } from "zod";
import express from "express";
import path from "path";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  // Admin testimonial management endpoints
  app.post("/api/admin/testimonials", async (req, res) => {
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

  app.put("/api/admin/testimonials/:id", async (req, res) => {
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

  app.delete("/api/admin/testimonials/:id", async (req, res) => {
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

  // Create site visit booking
  app.post("/api/site-visits", async (req, res) => {
    try {
      const siteVisitData = insertSiteVisitSchema.parse(req.body);
      const siteVisit = await storage.createSiteVisit(siteVisitData);
      
      // Send email notifications
      const emailService = EmailService.getInstance();
      
      // Prepare booking details for emails
      const bookingDetails = {
        name: siteVisit.name,
        email: siteVisit.email || '',
        mobile: siteVisit.mobile,
        preferredDate: siteVisit.preferredDate,
        plotSize: siteVisit.plotSize,
        budget: siteVisit.budget
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
  app.get("/api/admin/brochure-downloads", async (req, res) => {
    try {
      const downloads = await storage.getBrochureDownloads();
      res.json(downloads);
    } catch (error) {
      console.error("Error fetching brochure downloads:", error);
      res.status(500).json({ message: "Failed to fetch downloads" });
    }
  });

  app.get("/api/admin/brochure-stats", async (req, res) => {
    try {
      const stats = await storage.getBrochureDownloadStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching brochure stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.delete("/api/admin/brochure-downloads/:id", async (req, res) => {
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

  // Admin password management
  app.post("/api/admin/change-password", async (req, res) => {
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
  
  app.post("/api/admin/verify-password", async (req, res) => {
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
        res.json({ valid: true });
      } else {
        res.status(401).json({ valid: false, message: "Invalid password" });
      }
    } catch (error) {
      console.error("Error verifying admin password:", error);
      res.status(500).json({ message: "Failed to verify password" });
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

  const httpServer = createServer(app);
  return httpServer;
}
