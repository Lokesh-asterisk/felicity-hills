import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export class PdfService {
  private static instance: PdfService;
  
  public static getInstance(): PdfService {
    if (!PdfService.instance) {
      PdfService.instance = new PdfService();
    }
    return PdfService.instance;
  }

  async generatePdfFromHtml(html: string, filename: string): Promise<string> {
    let browser;
    try {
      // Ensure the pdfs directory exists
      const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
      await fs.mkdir(pdfDir, { recursive: true });

      // Launch browser with additional Chrome/Chromium environment setup
      browser = await puppeteer.launch({
        headless: 'new',
        executablePath: '/nix/store/*/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-file-access-from-files',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--disable-background-networking',
          '--remote-debugging-port=9222'
        ]
      });

      const page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 800 });
      
      // Set content with proper encoding
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Generate PDF with optimized settings
      const pdfPath = path.join(pdfDir, filename);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        preferCSSPageSize: true
      });

      await browser.close();
      
      // Return the public URL path
      return `/pdfs/${filename}`;
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      console.error('PDF generation error:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFileSize(filePath: string): Promise<string> {
    try {
      const fullPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));
      const stats = await fs.stat(fullPath);
      const sizeInBytes = stats.size;
      
      if (sizeInBytes < 1024) {
        return `${sizeInBytes} B`;
      } else if (sizeInBytes < 1024 * 1024) {
        return `${(sizeInBytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    } catch (error) {
      return 'Unknown';
    }
  }
}