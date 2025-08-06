import { type Plot, type SiteVisit, type Testimonial, type Brochure, type Video, type InsertPlot, type InsertSiteVisit, type InsertTestimonial, type InsertBrochure, type InsertVideo } from "@shared/schema";
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
  
  // Brochure operations
  getBrochures(): Promise<Brochure[]>;
  createBrochure(brochure: InsertBrochure): Promise<Brochure>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
}

export class MemStorage implements IStorage {
  private plots: Map<string, Plot> = new Map();
  private siteVisits: Map<string, SiteVisit> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();
  private brochures: Map<string, Brochure> = new Map();
  private videos: Map<string, Video> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializePlots();
    this.initializeTestimonials();
    this.initializeBrochures();
    this.initializeVideos();
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

  private initializeBrochures() {
    const brochuresData: InsertBrochure[] = [
      {
        title: "Khushalipur Project Brochure",
        description: "Complete information about our agricultural land investment project with plot details, pricing, and amenities",
        downloadUrl: "/downloads/khushalipur-brochure.pdf",
        fileSize: "2.5 MB"
      },
      {
        title: "Investment Guide",
        description: "Comprehensive guide to agricultural land investment including legal documentation and expected returns",
        downloadUrl: "/downloads/investment-guide.pdf",
        fileSize: "1.8 MB"
      },
      {
        title: "Plot Layout & Pricing",
        description: "Detailed layout map with individual plot pricing and specifications",
        downloadUrl: "/downloads/plot-layout.pdf",
        fileSize: "3.2 MB"
      }
    ];

    brochuresData.forEach(brochureData => {
      const id = randomUUID();
      const brochure: Brochure = { ...brochureData, id, createdAt: new Date() };
      this.brochures.set(id, brochure);
    });
  }

  private initializeVideos() {
    const videosData: InsertVideo[] = [
      {
        title: "Khushalipur Project Overview",
        description: "Complete video tour of our agricultural land project showing location, infrastructure, and amenities",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "5:32",
        category: "project"
      },
      {
        title: "Location & Connectivity",
        description: "Detailed overview of the strategic location near Delhi-Dehradun Expressway and connectivity advantages",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "3:45",
        category: "location"
      },
      {
        title: "Customer Success Stories",
        description: "Real testimonials from satisfied investors sharing their experience and returns",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "4:18",
        category: "testimonial"
      },
      {
        title: "Amenities & Infrastructure",
        description: "Tour of all modern amenities including swimming pool, clubhouse, security, and green spaces",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        duration: "6:12",
        category: "project"
      }
    ];

    videosData.forEach(videoData => {
      const id = randomUUID();
      const video: Video = { ...videoData, id, createdAt: new Date() };
      this.videos.set(id, video);
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
    const plot: Plot = { 
      ...insertPlot, 
      id,
      location: insertPlot.location || null,
      features: insertPlot.features || [],
      available: insertPlot.available ?? true
    };
    this.plots.set(id, plot);
    return plot;
  }

  async createSiteVisit(insertSiteVisit: InsertSiteVisit): Promise<SiteVisit> {
    const id = randomUUID();
    const siteVisit: SiteVisit = { 
      ...insertSiteVisit, 
      id, 
      createdAt: new Date(),
      email: insertSiteVisit.email || null,
      preferredDate: insertSiteVisit.preferredDate || null,
      plotSize: insertSiteVisit.plotSize || null,
      budget: insertSiteVisit.budget || null
    };
    this.siteVisits.set(id, siteVisit);
    return siteVisit;
  }

  async getSiteVisits(): Promise<SiteVisit[]> {
    return Array.from(this.siteVisits.values());
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getBrochures(): Promise<Brochure[]> {
    return Array.from(this.brochures.values());
  }

  async createBrochure(insertBrochure: InsertBrochure): Promise<Brochure> {
    const id = randomUUID();
    const brochure: Brochure = { 
      ...insertBrochure, 
      id, 
      createdAt: new Date()
    };
    this.brochures.set(id, brochure);
    return brochure;
  }

  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo, 
      id, 
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }
}

export const storage = new MemStorage();
