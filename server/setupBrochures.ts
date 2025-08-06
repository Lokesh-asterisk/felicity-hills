import { storage } from "./storage";
import fs from 'fs/promises';
import path from 'path';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

// HTML content for Khushalipur Premium Agricultural Land Investment brochure
const premiumLandHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khushalipur - Premium Agricultural Land Investment</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    
    .brochure-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
    }
    
    /* Cover Page */
    .cover-page {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%);
      color: white;
      padding: 80px 40px;
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }
    
    .cover-page::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: 1;
    }
    
    .cover-page > * {
      position: relative;
      z-index: 2;
    }
    
    .logo {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 20px;
      background: linear-gradient(45deg, #ffffff, #f0f9ff, #e0f2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .tagline {
      font-size: 2.2rem;
      margin-bottom: 40px;
      font-weight: 300;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      line-height: 1.2;
      background: linear-gradient(45deg, #ffffff, #f8fafc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .cover-details {
      background: rgba(255,255,255,0.15);
      padding: 50px;
      border-radius: 20px;
      margin: 50px 0;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .location {
      font-size: 1.5rem;
      margin-bottom: 30px;
      font-weight: 500;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .highlight-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 25px;
      margin: 40px 0;
    }
    
    .stat-box {
      background: rgba(255,255,255,0.2);
      padding: 30px 20px;
      border-radius: 15px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .stat-number {
      font-size: 3rem;
      font-weight: 900;
      display: block;
      background: linear-gradient(45deg, #ffffff, #f0f9ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 1.1rem;
      font-weight: 500;
      color: rgba(255,255,255,0.95);
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    /* Content Pages */
    .content-page {
      padding: 60px 40px;
      page-break-after: always;
    }
    
    .page-header {
      text-align: center;
      margin-bottom: 50px;
      border-bottom: 3px solid #16a34a;
      padding-bottom: 20px;
    }
    
    .page-title {
      font-size: 2.5rem;
      color: #16a34a;
      margin-bottom: 10px;
    }
    
    .page-subtitle {
      font-size: 1.2rem;
      color: #666;
    }
    
    /* Location Section */
    .location-advantages {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin: 40px 0;
    }
    
    .advantage-card {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 10px;
      border-left: 5px solid #16a34a;
    }
    
    .advantage-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #16a34a;
      margin-bottom: 15px;
    }
    
    /* Plot Information */
    .plots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin: 40px 0;
    }
    
    .plot-card {
      background: #fff;
      border: 2px solid #e5e7eb;
      border-radius: 15px;
      padding: 25px;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .plot-card.premium {
      border-color: #fbbf24;
      background: linear-gradient(135deg, #fef3c7 0%, #fef3c7 100%);
    }
    
    .plot-category {
      font-size: 1.1rem;
      font-weight: bold;
      color: #16a34a;
      margin-bottom: 15px;
    }
    
    .plot-size {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .plot-price {
      font-size: 1.5rem;
      color: #dc2626;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .plot-total {
      background: #16a34a;
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-weight: bold;
    }
    
    /* Investment Calculator */
    .calculator-section {
      background: #f0fdf4;
      padding: 40px;
      border-radius: 15px;
      margin: 40px 0;
    }
    
    .roi-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    .roi-table th,
    .roi-table td {
      padding: 15px;
      text-align: center;
      border: 1px solid #d1d5db;
    }
    
    .roi-table th {
      background: #16a34a;
      color: white;
      font-weight: bold;
    }
    
    .roi-table tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 25px;
      margin: 40px 0;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 10px;
    }
    
    .feature-icon {
      width: 40px;
      height: 40px;
      background: #16a34a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .feature-content h4 {
      color: #16a34a;
      margin-bottom: 8px;
    }
    
    /* Contact Section */
    .contact-section {
      background: #16a34a;
      color: white;
      padding: 50px 40px;
      text-align: center;
      border-radius: 15px;
      margin: 40px 0;
    }
    
    .contact-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin: 30px 0;
    }
    
    .contact-item {
      background: rgba(255,255,255,0.1);
      padding: 25px;
      border-radius: 10px;
    }
    
    .contact-item h4 {
      margin-bottom: 10px;
      font-size: 1.2rem;
    }
    
    .contact-item p {
      font-size: 1.1rem;
      font-weight: bold;
    }
    
    /* Legal Section */
    .legal-section {
      background: #f8f9fa;
      padding: 40px;
      border-radius: 15px;
      margin: 40px 0;
    }
    
    .legal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
      margin: 20px 0;
    }
    
    .legal-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #16a34a;
    }
    
    /* Print Styles */
    @media print {
      body {
        font-size: 12pt;
      }
      
      .brochure-container {
        max-width: none;
      }
      
      .content-page,
      .cover-page {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="brochure-container">
    
    <!-- Cover Page -->
    <div class="cover-page">
      <div class="logo">🏡 KHUSHALIPUR</div>
      <div class="tagline">Your Safe Investment in Agricultural Land</div>
      
      <div class="cover-details">
        <div class="location">📍 Near Delhi-Dehradun Expressway, Uttar Pradesh</div>
        
        <div class="highlight-stats">
          <div class="stat-box">
            <span class="stat-number">200-800</span>
            <span class="stat-label">Square Yards Available</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">₹8,100</span>
            <span class="stat-label">Starting Price per Sq Yd</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">15-20%</span>
            <span class="stat-label">Expected Annual Returns</span>
          </div>
          <div class="stat-box">
            <span class="stat-number">100%</span>
            <span class="stat-label">Legal & Clear Title</span>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 60px;">
        <p style="font-size: 1.4rem; font-weight: 400; margin-bottom: 25px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); background: linear-gradient(45deg, #ffffff, #f8fafc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Premium Agricultural Land with Residential Development Potential</p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 30px;">
          <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 25px; font-size: 0.95rem; font-weight: 500; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.3);">
            ✅ Government Approved
          </span>
          <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 25px; font-size: 0.95rem; font-weight: 500; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.3);">
            🏆 Prime Location
          </span>
          <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 25px; font-size: 0.95rem; font-weight: 500; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.3);">
            💰 High ROI
          </span>
        </div>
      </div>
    </div>

    <!-- Location & Strategy Page -->
    <div class="content-page">
      <div class="page-header">
        <h1 class="page-title">Strategic Location</h1>
        <p class="page-subtitle">Near Delhi-Dehradun Expressway, Uttar Pradesh</p>
      </div>
      
      <div class="location-advantages">
        <div class="advantage-card">
          <h3 class="advantage-title">🛣️ Connectivity Excellence</h3>
          <p><strong>Delhi-Dehradun Expressway:</strong> Direct access to major metropolitan areas with reduced travel time and excellent logistics connectivity.</p>
        </div>
        
        <div class="advantage-card">
          <h3 class="advantage-title">🏥 Healthcare Access</h3>
          <p><strong>Max Hospital:</strong> 10 km away<br><strong>Dehradun Medical Facilities:</strong> 15 km proximity with top-tier healthcare infrastructure.</p>
        </div>
        
        <div class="advantage-card">
          <h3 class="advantage-title">✈️ Transportation Hub</h3>
          <p><strong>Jolly Grant Airport:</strong> 25 km distance<br><strong>Dehradun Railway Station:</strong> 15 km away<br><strong>ISBT Dehradun:</strong> Only 13 km</p>
        </div>
        
        <div class="advantage-card">
          <h3 class="advantage-title">🎓 Educational Zone</h3>
          <p><strong>Multiple Schools & Colleges:</strong> Well-established educational infrastructure in the vicinity ensuring sustained community development.</p>
        </div>
        
        <div class="advantage-card">
          <h3 class="advantage-title">🏛️ Government Infrastructure</h3>
          <p><strong>Planned Development:</strong> Government-backed infrastructure projects in the pipeline ensuring long-term appreciation.</p>
        </div>
        
        <div class="advantage-card">
          <h3 class="advantage-title">🌿 Environmental Benefits</h3>
          <p><strong>Clean Air & Natural Setting:</strong> Away from industrial pollution with pristine natural environment perfect for agricultural activities.</p>
        </div>
      </div>
    </div>

    <!-- Plot Information Page -->
    <div class="content-page">
      <div class="page-header">
        <h1 class="page-title">Plot Categories & Pricing</h1>
        <p class="page-subtitle">Flexible sizes to suit every investment need</p>
      </div>
      
      <div class="plots-grid">
        <div class="plot-card">
          <div class="plot-category">Standard Agricultural Plots</div>
          <div class="plot-size">200-400 Sq Yd</div>
          <div class="plot-price">₹8,100 - ₹8,500 per Sq Yd</div>
          <div class="plot-total">Total: ₹16.2L - ₹34L</div>
          <p style="margin-top: 15px; color: #666;">Perfect for small to medium agricultural activities with basic amenities and corner plot advantages.</p>
        </div>
        
        <div class="plot-card premium">
          <div class="plot-category">Premium Plots</div>
          <div class="plot-size">400-600 Sq Yd</div>
          <div class="plot-price">₹9,000 - ₹9,500 per Sq Yd</div>
          <div class="plot-total">Total: ₹36L - ₹57L</div>
          <p style="margin-top: 15px; color: #666;">Wide road frontage, prime location with enhanced connectivity and premium positioning.</p>
        </div>
        
        <div class="plot-card">
          <div class="plot-category">Cottage Development Plots</div>
          <div class="plot-size">600-800 Sq Yd</div>
          <div class="plot-price">₹9,500 - ₹10,000 per Sq Yd</div>
          <div class="plot-total">Total: ₹57L - ₹80L</div>
          <p style="margin-top: 15px; color: #666;">Spacious plots ideal for cottage development with wide road access and future residential potential.</p>
        </div>
      </div>
    </div>

    <!-- Investment Calculator Page -->
    <div class="content-page">
      <div class="page-header">
        <h1 class="page-title">Investment Returns Analysis</h1>
        <p class="page-subtitle">Projected returns based on market trends</p>
      </div>
      
      <div class="calculator-section">
        <h3 style="color: #16a34a; margin-bottom: 20px; text-align: center;">Example Investment Scenario</h3>
        <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Plot Size:</strong> 400 Sq Yd (Premium Category)</p>
          <p><strong>Price per Sq Yd:</strong> ₹9,000</p>
          <p><strong>Total Investment:</strong> ₹36,00,000</p>
          <p><strong>Expected Annual Appreciation:</strong> 15-20%</p>
        </div>
        
        <table class="roi-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>15% Growth</th>
              <th>20% Growth</th>
              <th>Profit (15%)</th>
              <th>Profit (20%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Year 1</td>
              <td>₹41,40,000</td>
              <td>₹43,20,000</td>
              <td>₹5,40,000</td>
              <td>₹7,20,000</td>
            </tr>
            <tr>
              <td>Year 2</td>
              <td>₹47,61,000</td>
              <td>₹51,84,000</td>
              <td>₹11,61,000</td>
              <td>₹15,84,000</td>
            </tr>
            <tr>
              <td>Year 3</td>
              <td>₹54,75,150</td>
              <td>₹62,20,800</td>
              <td>₹18,75,150</td>
              <td>₹26,20,800</td>
            </tr>
            <tr>
              <td>Year 5</td>
              <td>₹72,44,371</td>
              <td>₹89,56,352</td>
              <td>₹36,44,371</td>
              <td>₹53,56,352</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Why Choose Section -->
    <div class="content-page">
      <div class="page-header">
        <h1 class="page-title">Why Choose Khushalipur?</h1>
        <p class="page-subtitle">Comprehensive advantages for smart investors</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">📍</div>
          <div class="feature-content">
            <h4>Strategic Location</h4>
            <p>Prime position near Delhi-Dehradun Expressway ensuring excellent connectivity to major cities and commercial hubs.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">✅</div>
          <div class="feature-content">
            <h4>Government Approvals</h4>
            <p>All necessary NOCs, clearances, and government approvals obtained. Completely legal and transparent documentation.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📋</div>
          <div class="feature-content">
            <h4>Clear Documentation</h4>
            <p>Transparent and legally verified property documents. Revenue records verified, mutation completed, title clear property.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📈</div>
          <div class="feature-content">
            <h4>High Appreciation Potential</h4>
            <p>Rapid infrastructure development in the region ensuring consistent property value appreciation of 15-20% annually.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🌾</div>
          <div class="feature-content">
            <h4>Agricultural Benefits</h4>
            <p>Fertile land suitable for various crops. Agricultural income tax benefits and farming subsidy eligibility.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🏡</div>
          <div class="feature-content">
            <h4>Future Development Potential</h4>
            <p>Potential for residential conversion as the area develops. Cottage development opportunities for tourism income.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🏦</div>
          <div class="feature-content">
            <h4>Bank Loan Facility</h4>
            <p>Bank loan facility available for qualified buyers. Easy EMI options and flexible payment plans.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🛡️</div>
          <div class="feature-content">
            <h4>Secure Investment</h4>
            <p>Land is a tangible asset with inherent value. Protection against inflation and currency devaluation.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Legal Documentation Page -->
    <div class="content-page">
      <div class="page-header">
        <h1 class="page-title">Legal Documentation</h1>
        <p class="page-subtitle">Complete transparency and legal compliance</p>
      </div>
      
      <div class="legal-section">
        <h3 style="color: #16a34a; margin-bottom: 20px; text-align: center;">All Legal Formalities Completed</h3>
        
        <div class="legal-grid">
          <div class="legal-item">
            <h4 style="color: #16a34a;">✅ Revenue Records Verified</h4>
            <p>Complete verification of revenue records and land classification. All documents authenticated by revenue department.</p>
          </div>
          
          <div class="legal-item">
            <h4 style="color: #16a34a;">✅ Mutation Completed</h4>
            <p>Land mutation process completed ensuring clear ownership transfer. Updated records in revenue department.</p>
          </div>
          
          <div class="legal-item">
            <h4 style="color: #16a34a;">✅ NOC from Local Authorities</h4>
            <p>No Objection Certificate obtained from all relevant local authorities and development boards.</p>
          </div>
          
          <div class="legal-item">
            <h4 style="color: #16a34a;">✅ Environmental Clearance</h4>
            <p>Environmental impact assessment completed. Clearance obtained for sustainable development practices.</p>
          </div>
          
          <div class="legal-item">
            <h4 style="color: #16a34a;">✅ Title Clear Property</h4>
            <p>Clear and marketable title with no encumbrances. Legal ownership verification completed by certified lawyers.</p>
          </div>
          
          <div class="legal-item">
            <h4 style="color: #16a34a;">✅ Bank Loan Facility Available</h4>
            <p>Pre-approved bank loan facility available. Partnership with leading banks for easy financing options.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact & Booking Page -->
    <div class="content-page">
      <div class="page-header">
        <h1 class="page-title">Contact & Booking Information</h1>
        <p class="page-subtitle">Ready to start your investment journey?</p>
      </div>
      
      <div style="background: #f0fdf4; padding: 40px; border-radius: 15px; margin: 40px 0;">
        <h3 style="color: #16a34a; margin-bottom: 20px; text-align: center;">Simple Booking Process</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
          <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; background: #16a34a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; font-weight: bold;">1</div>
            <h4 style="color: #16a34a; margin-bottom: 10px;">Site Visit</h4>
            <p>Schedule a free site visit to view the plots and infrastructure development.</p>
          </div>
          <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; background: #16a34a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; font-weight: bold;">2</div>
            <h4 style="color: #16a34a; margin-bottom: 10px;">Plot Selection</h4>
            <p>Choose your preferred plot based on size, location, and budget requirements.</p>
          </div>
          <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; background: #16a34a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; font-weight: bold;">3</div>
            <h4 style="color: #16a34a; margin-bottom: 10px;">Documentation</h4>
            <p>Complete legal verification, paperwork, and due diligence process.</p>
          </div>
          <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; background: #16a34a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; font-weight: bold;">4</div>
            <h4 style="color: #16a34a; margin-bottom: 10px;">Payment</h4>
            <p>Flexible payment options available including bank loan facility and EMI plans.</p>
          </div>
          <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; background: #16a34a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; font-weight: bold;">5</div>
            <h4 style="color: #16a34a; margin-bottom: 10px;">Registration</h4>
            <p>Complete registration process and get immediate possession of your investment.</p>
          </div>
        </div>
      </div>
      
      <div class="contact-section">
        <h3>Contact Information</h3>
        
        <div class="contact-methods">
          <div class="contact-item">
            <h4>📞 Phone</h4>
            <p>+91 8588834221</p>
          </div>
          
          <div class="contact-item">
            <h4>💬 WhatsApp</h4>
            <p>+91 8588834221</p>
          </div>
          
          <div class="contact-item">
            <h4>📧 Email</h4>
            <p>lokesh.mvt@gmail.com</p>
          </div>
          
          <div class="contact-item">
            <h4>🌐 Website</h4>
            <p>felicityhills.com</p>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.2);">
          <h4>🏢 Office Address</h4>
          <p>Felicity Hills Development<br>Near Delhi-Dehradun Expressway, Uttar Pradesh</p>
          <br>
          <p style="font-style: italic; font-size: 0.9rem; opacity: 0.8;">*Investment subject to market risks. Please verify all documents before investing.</p>
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;

// Simplified HTML content for project brochure
const projectBrochureHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khushhalipur Project Brochure</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 30px;
            margin: -20px -20px 30px -20px;
        }
        .header h1 {
            font-size: 2.5em;
            margin: 0;
        }
        .header p {
            font-size: 1.2em;
            margin: 10px 0 0 0;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border-left: 4px solid #22c55e;
            background: #f9f9f9;
        }
        .section h2 {
            color: #16a34a;
            font-size: 1.8em;
            margin-top: 0;
        }
        .highlights {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .highlight-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .highlight-box h3 {
            color: #16a34a;
            font-size: 2em;
            margin: 0;
        }
        .highlight-box p {
            margin: 10px 0 0 0;
            font-weight: bold;
        }
        .plot-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .plot-table th, .plot-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .plot-table th {
            background: #22c55e;
            color: white;
        }
        .plot-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        .contact-info {
            background: #16a34a;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-top: 30px;
        }
        .contact-info h3 {
            margin-top: 0;
        }
        .amenities-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 20px 0;
        }
        .amenities-list li {
            background: white;
            padding: 10px;
            border-radius: 4px;
            list-style: none;
            border-left: 3px solid #22c55e;
        }
        .roi-box {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .roi-box h3 {
            color: #856404;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Khushhalipur</h1>
        <p>Your Safe Investment • Agricultural Land Development Project</p>
        <p>Near Delhi-Dehradun Expressway • Only 13 km from Dehradun ISBT</p>
    </div>

    <div class="highlights">
        <div class="highlight-box">
            <h3>₹8,100</h3>
            <p>Starting Price per sq yd</p>
        </div>
        <div class="highlight-box">
            <h3>15-20%</h3>
            <p>Expected Annual Returns</p>
        </div>
        <div class="highlight-box">
            <h3>200-800</h3>
            <p>Plot Sizes (sq yd)</p>
        </div>
    </div>

    <div class="section">
        <h2>Project Overview</h2>
        <p><strong>Khushhalipur</strong> is a premium agricultural land development project strategically located near the Delhi-Dehradun Expressway in Uttar Pradesh. This project offers excellent investment opportunities with plots ranging from 200 to 800 square yards, perfect for both agricultural activities and future residential development.</p>
        
        <p><strong>Key Features:</strong></p>
        <ul>
            <li>Agricultural land category with clear documentation</li>
            <li>Government approvals and NOCs in place</li>
            <li>Excellent connectivity to major cities</li>
            <li>Planned infrastructure development</li>
            <li>High appreciation potential</li>
        </ul>
    </div>

    <div class="section">
        <h2>Location Advantages</h2>
        <ul>
            <li><strong>Delhi-Dehradun Expressway:</strong> Direct connectivity to major cities</li>
            <li><strong>Dehradun ISBT:</strong> Only 13 km away</li>
            <li><strong>Jolly Grant Airport:</strong> 25 km distance</li>
            <li><strong>Dehradun Railway Station:</strong> 15 km away</li>
            <li><strong>Max Hospital:</strong> 10 km proximity</li>
            <li><strong>Educational Institutions:</strong> Multiple schools and colleges nearby</li>
        </ul>
    </div>

    <div class="section">
        <h2>Plot Details & Pricing</h2>
        <table class="plot-table">
            <thead>
                <tr>
                    <th>Plot Category</th>
                    <th>Size Range (sq yd)</th>
                    <th>Price per sq yd</th>
                    <th>Road Width</th>
                    <th>Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Standard Plots</td>
                    <td>200-400</td>
                    <td>₹8,100-₹8,500</td>
                    <td>24-30 feet</td>
                    <td>Basic amenities, corner advantage</td>
                </tr>
                <tr>
                    <td>Premium Plots</td>
                    <td>400-600</td>
                    <td>₹9,000-₹9,500</td>
                    <td>30-40 feet</td>
                    <td>Wide roads, prime location</td>
                </tr>
                <tr>
                    <td>Cottage Plots</td>
                    <td>600-800</td>
                    <td>₹9,500-₹10,000</td>
                    <td>40+ feet</td>
                    <td>Cottage development ready</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="roi-box">
        <h3>Investment Returns Calculation</h3>
        <p><strong>Example Investment:</strong> 400 sq yd plot at ₹8,500 per sq yd</p>
        <p><strong>Total Investment:</strong> ₹34,00,000</p>
        <p><strong>Expected Annual Appreciation:</strong> 15-20%</p>
        <p><strong>Projected Value after 3 years:</strong> ₹51,68,000 - ₹58,78,400</p>
        <p><strong>Potential Profit:</strong> ₹17,68,000 - ₹24,78,400</p>
    </div>

    <div class="section">
        <h2>Amenities & Infrastructure</h2>
        <ul class="amenities-list">
            <li>🛣️ Concrete Roads</li>
            <li>💡 Street Lighting</li>
            <li>💧 Water Supply System</li>
            <li>🌳 Green Belt Development</li>
            <li>🚗 Parking Facilities</li>
            <li>🔒 Security Gate</li>
            <li>🏢 Community Center</li>
            <li>🚌 Transportation Facility</li>
            <li>⚡ Power Backup</li>
            <li>🏥 Medical Facilities</li>
            <li>🏫 Educational Zone</li>
            <li>🛒 Shopping Complex</li>
        </ul>
    </div>

    <div class="section">
        <h2>Why Choose Khushhalipur?</h2>
        <ul>
            <li><strong>Strategic Location:</strong> Excellent connectivity to Delhi, Dehradun, and Haridwar</li>
            <li><strong>Government Approvals:</strong> All necessary NOCs and clearances obtained</li>
            <li><strong>Clear Documentation:</strong> Transparent and legally verified property documents</li>
            <li><strong>High Appreciation:</strong> Rapid infrastructure development in the region</li>
            <li><strong>Agricultural Benefits:</strong> Fertile land suitable for various crops</li>
            <li><strong>Future Development:</strong> Potential for residential conversion</li>
        </ul>
    </div>

    <div class="section">
        <h2>Legal Documentation</h2>
        <p><strong>All legal formalities are completed:</strong></p>
        <ul>
            <li>✅ Revenue Records Verified</li>
            <li>✅ Mutation Completed</li>
            <li>✅ NOC from Local Authorities</li>
            <li>✅ Environmental Clearance</li>
            <li>✅ Title Clear Property</li>
            <li>✅ Bank Loan Facility Available</li>
        </ul>
    </div>

    <div class="section">
        <h2>Booking Process</h2>
        <ol>
            <li><strong>Site Visit:</strong> Schedule a free site visit to view the plots</li>
            <li><strong>Plot Selection:</strong> Choose your preferred plot based on size and location</li>
            <li><strong>Documentation:</strong> Complete legal verification and paperwork</li>
            <li><strong>Payment:</strong> Flexible payment options available</li>
            <li><strong>Registration:</strong> Complete registration and get possession</li>
        </ol>
    </div>

    <div class="contact-info">
        <h3>Contact Information</h3>
        <p><strong>Phone:</strong> +91 8588834221</p>
        <p><strong>WhatsApp:</strong> +91 8588834221</p>
        <p><strong>Email:</strong> lokesh.mvt@gmail.com</p>
        <p><strong>Website:</strong> felicityhills.com</p>
        <br>
        <p><strong>Office Address:</strong> Felicity Hills Development</p>
        <p>Near Delhi-Dehradun Expressway, Uttar Pradesh</p>
        <br>
        <p><em>*Investment subject to market risks. Please verify all documents before investing.</em></p>
    </div>

</body>
</html>`;

export async function setupBrochuresWithPdfs() {
  try {
    console.log("Starting brochure setup with HTML files...");
    
    // Create HTML directory if it doesn't exist
    const htmlDir = path.join(process.cwd(), 'public', 'brochures');
    await fs.mkdir(htmlDir, { recursive: true });
    
    // Save HTML files
    const premiumLandPath = path.join(htmlDir, 'khushalipur-premium-agricultural-land-investment.html');
    const projectBrochurePath = path.join(htmlDir, 'khushalipur-project-brochure.html');
    
    await fs.writeFile(premiumLandPath, premiumLandHtml, 'utf8');
    await fs.writeFile(projectBrochurePath, projectBrochureHtml, 'utf8');
    
    // Get file sizes
    const premiumLandStats = await fs.stat(premiumLandPath);
    const projectBrochureStats = await fs.stat(projectBrochurePath);
    
    const premiumLandSize = formatFileSize(premiumLandStats.size);
    const projectBrochureSize = formatFileSize(projectBrochureStats.size);
    
    const premiumLandUrl = '/brochures/khushalipur-premium-agricultural-land-investment.html';
    const projectBrochureUrl = '/brochures/khushalipur-project-brochure.html';
    
    // Check if brochures already exist
    const existingBrochures = await storage.getBrochures();
    const premiumLandExists = existingBrochures.find(b => b.title.includes("Premium Agricultural Land Investment"));
    const projectBrochureExists = existingBrochures.find(b => b.title.includes("Khushalipur Project Brochure"));
    
    // Create or update Premium Agricultural Land Investment brochure
    if (!premiumLandExists) {
      await storage.createBrochure({
        title: "Khushalipur - Premium Agricultural Land Investment",
        description: "Comprehensive investment guide featuring detailed plot information, ROI calculations, legal documentation, and strategic location advantages. Perfect for investors seeking high-return agricultural land opportunities near Delhi-Dehradun Expressway.",
        downloadUrl: premiumLandUrl,
        fileSize: premiumLandSize,
      });
      console.log("Created Premium Agricultural Land Investment brochure");
    }
    
    // Create or update Project Brochure
    if (!projectBrochureExists) {
      await storage.createBrochure({
        title: "Khushalipur Project Brochure",
        description: "Essential project overview with plot pricing, amenities, location benefits, and booking process. Quick reference guide for potential investors interested in agricultural land development opportunities.",
        downloadUrl: projectBrochureUrl,
        fileSize: projectBrochureSize,
      });
      console.log("Created Khushalipur Project Brochure");
    }
    
    console.log("Brochure setup completed successfully!");
    return {
      premiumLandUrl,
      projectBrochureUrl,
      premiumLandSize,
      projectBrochureSize
    };
    
  } catch (error) {
    console.error("Error setting up brochures:", error);
    throw error;
  }
}