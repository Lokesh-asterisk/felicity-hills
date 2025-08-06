import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSiteVisitSchema } from "@shared/schema";
import { setupBrochuresWithPdfs } from "./setupBrochures";
import { z } from "zod";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve static files (PDFs and HTML brochures)
  app.use('/pdfs', express.static(path.join(process.cwd(), 'public', 'pdfs')));
  app.use('/brochures', express.static(path.join(process.cwd(), 'public', 'brochures')));
  
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

  // Create site visit booking
  app.post("/api/site-visits", async (req, res) => {
    try {
      const siteVisitData = insertSiteVisitSchema.parse(req.body);
      const siteVisit = await storage.createSiteVisit(siteVisitData);
      res.status(201).json(siteVisit);
    } catch (error) {
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
