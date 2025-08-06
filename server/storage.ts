import { type Plot, type SiteVisit, type Testimonial, type InsertPlot, type InsertSiteVisit, type InsertTestimonial } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Plot operations
  getPlots(): Promise<Plot[]>;
  getPlot(id: string): Promise<Plot | undefined>;
  createPlot(plot: InsertPlot): Promise<Plot>;
  
  // Site visit operations
  createSiteVisit(siteVisit: InsertSiteVisit): Promise<SiteVisit>;
  getSiteVisits(): Promise<SiteVisit[]>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
}

export class MemStorage implements IStorage {
  private plots: Map<string, Plot> = new Map();
  private siteVisits: Map<string, SiteVisit> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();

  constructor() {
    // Initialize with sample plots data
    this.initializePlots();
    this.initializeTestimonials();
  }

  private initializePlots() {
    const plotsData: InsertPlot[] = [
      {
        plotNumber: "Plot 1",
        size: 400,
        pricePerSqYd: 9500,
        roadWidth: 40,
        category: "regular",
        features: ["40 ft road"],
        available: true,
        location: "main_road"
      },
      {
        plotNumber: "Plot 2",
        size: 350,
        pricePerSqYd: 9500,
        roadWidth: 40,
        category: "regular",
        features: ["40 ft road"],
        available: true,
        location: "main_road"
      },
      {
        plotNumber: "Plot 3",
        size: 450,
        pricePerSqYd: 9500,
        roadWidth: 40,
        category: "regular",
        features: ["40 ft road"],
        available: true,
        location: "main_road"
      },
      {
        plotNumber: "Plot 4",
        size: 500,
        pricePerSqYd: 9500,
        roadWidth: 40,
        category: "regular",
        features: ["40 ft road"],
        available: false,
        location: "main_road"
      },
      {
        plotNumber: "Plot 5",
        size: 600,
        pricePerSqYd: 10000,
        roadWidth: 40,
        category: "premium",
        features: ["Double road", "Pool facing"],
        available: true,
        location: "pool_facing"
      },
      {
        plotNumber: "Plot 6",
        size: 550,
        pricePerSqYd: 9500,
        roadWidth: 40,
        category: "premium",
        features: ["Corner plot", "40+30 ft road"],
        available: true,
        location: "corner"
      },
      {
        plotNumber: "Plot S1",
        size: 200,
        pricePerSqYd: 8100,
        roadWidth: 25,
        category: "small",
        features: ["25 ft road"],
        available: true,
        location: "small_road"
      },
      {
        plotNumber: "Plot S2",
        size: 220,
        pricePerSqYd: 8100,
        roadWidth: 25,
        category: "small",
        features: ["25 ft road"],
        available: true,
        location: "small_road"
      },
      {
        plotNumber: "Plot S3",
        size: 180,
        pricePerSqYd: 8100,
        roadWidth: 25,
        category: "small",
        features: ["25 ft road"],
        available: false,
        location: "small_road"
      }
    ];

    plotsData.forEach(plotData => {
      const id = randomUUID();
      const plot: Plot = { ...plotData, id };
      this.plots.set(id, plot);
    });
  }

  private initializeTestimonials() {
    const testimonialsData: InsertTestimonial[] = [
      {
        name: "Rahul Sharma",
        location: "Delhi",
        investment: 1500000,
        plotSize: 300,
        returns: 35,
        duration: "2 years",
        review: "Investing in Khushhalipur was my best decision. Got 35% returns in 2 years. The team is very supportive and transparent."
      },
      {
        name: "Priya Gupta",
        location: "Gurgaon",
        investment: 1620000,
        plotSize: 200,
        returns: 22,
        duration: "18 months",
        review: "Excellent location with easy access from Delhi. Great future prospects. The entire process was very smooth."
      },
      {
        name: "Amit Kumar",
        location: "Noida",
        investment: 4050000,
        plotSize: 500,
        returns: 28,
        duration: "2.5 years",
        review: "Clear documentation, government approvals, and excellent amenities. This is truly a safe investment."
      },
      {
        name: "Sanjay Verma",
        location: "Faridabad",
        investment: 3240000,
        plotSize: 400,
        returns: 31,
        duration: "2 years",
        review: "Got bank loan easily. EMI facility is excellent. Now I have 3 plots and getting good returns on all of them."
      }
    ];

    testimonialsData.forEach(testimonialData => {
      const id = randomUUID();
      const testimonial: Testimonial = { ...testimonialData, id };
      this.testimonials.set(id, testimonial);
    });
  }

  async getPlots(): Promise<Plot[]> {
    return Array.from(this.plots.values());
  }

  async getPlot(id: string): Promise<Plot | undefined> {
    return this.plots.get(id);
  }

  async createPlot(insertPlot: InsertPlot): Promise<Plot> {
    const id = randomUUID();
    const plot: Plot = { ...insertPlot, id };
    this.plots.set(id, plot);
    return plot;
  }

  async createSiteVisit(insertSiteVisit: InsertSiteVisit): Promise<SiteVisit> {
    const id = randomUUID();
    const siteVisit: SiteVisit = { ...insertSiteVisit, id, createdAt: new Date() };
    this.siteVisits.set(id, siteVisit);
    return siteVisit;
  }

  async getSiteVisits(): Promise<SiteVisit[]> {
    return Array.from(this.siteVisits.values());
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
}

export const storage = new MemStorage();
