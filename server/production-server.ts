import express from "express";
import path from "path";
import fs from "fs";
import { log } from "./vite.js";

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple static file serving for production
function setupProductionStatic() {
  // Use process.cwd() which is reliable in production
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  console.log(`Looking for static files in: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.warn(`Build directory not found: ${distPath}`);
    console.log("Continuing without static file serving...");
    return;
  }

  app.use(express.static(distPath));

  // Fallback to index.html for SPA routing
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("App not found - please build the frontend first");
    }
  });
}

// Setup static serving
setupProductionStatic();

// Import and setup API routes
import("./routes.js").then((routes) => {
  // API routes will be registered here
  console.log("API routes loaded successfully");
}).catch(err => {
  console.error("Failed to load API routes:", err);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

const port = parseInt(process.env.PORT || "8080", 10);

app.listen(port, "0.0.0.0", () => {
  log(`Production server running on port ${port}`);
  log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;