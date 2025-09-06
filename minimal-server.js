import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import and register just the API routes
import('./dist/index.js').then(module => {
  // This will import your routes but skip the static file serving
}).catch(err => {
  console.error('Import error:', err);
});

// Simple test endpoints
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', port: process.env.PORT || 8080 });
});

const port = parseInt(process.env.PORT || '8080', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Minimal server running on port ${port}`);
});
