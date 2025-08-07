import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface BookingDetails {
  name: string;
  email: string;
  mobile: string;
  preferredDate?: string | null;
  plotSize?: string | null;
  budget?: string | null;
}

export class EmailService {
  private static instance: EmailService;
  private fromEmail = 'lokesh.mvt@gmail.com'; // Must be verified in SendGrid

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendBookingConfirmation(bookingDetails: BookingDetails): Promise<boolean> {
    try {
      const msg = {
        to: bookingDetails.email,
        from: {
          email: this.fromEmail,
          name: 'Khushalipur Agricultural Plots'
        },
        replyTo: this.fromEmail,
        subject: 'Site Visit Booking Confirmed - Khushalipur Agricultural Plots',
        html: this.getConfirmationEmailHtml(bookingDetails),
        text: this.getConfirmationEmailText(bookingDetails),
        categories: ['booking-confirmation'],
        customArgs: {
          'booking_type': 'site_visit',
          'customer': bookingDetails.name
        }
      };

      await sgMail.send(msg);
      console.log(`Confirmation email sent to ${bookingDetails.email}`);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  async sendAdminAlert(bookingDetails: BookingDetails): Promise<boolean> {
    try {
      const msg = {
        to: 'lokesh.mvt@gmail.com',
        from: {
          email: this.fromEmail,
          name: 'Khushalipur Site Visits'
        },
        replyTo: this.fromEmail,
        subject: `Khushalipur Site Visit Request from ${bookingDetails.name}`,
        html: this.getAdminAlertHtml(bookingDetails),
        text: this.getAdminAlertText(bookingDetails),
        categories: ['site-visit-booking'],
        customArgs: {
          'booking_type': 'site_visit',
          'source': 'khushalipur_website'
        }
      };

      await sgMail.send(msg);
      console.log('Admin alert email sent');
      return true;
    } catch (error) {
      console.error('Error sending admin alert email:', error);
      return false;
    }
  }

  private getConfirmationEmailHtml(booking: BookingDetails): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Site Visit Booking Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .contact-info { background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #059669; margin-top: 0; }
          .highlight { color: #059669; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 Booking Confirmed!</h1>
            <p>Thank you for your interest in Khushalipur Agricultural Plots</p>
          </div>
          <div class="content">
            <p>Dear <span class="highlight">${booking.name}</span>,</p>
            
            <p>We're excited to confirm your site visit booking for our premium agricultural land plots in Khushalipur, near Dehradun.</p>
            
            <div class="booking-details">
              <h2>📋 Your Booking Details</h2>
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Mobile:</strong> ${booking.mobile}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              ${booking.preferredDate ? `<p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>` : ''}
              ${booking.plotSize ? `<p><strong>Interested Plot Size:</strong> ${booking.plotSize}</p>` : ''}
              ${booking.budget ? `<p><strong>Budget Range:</strong> ${booking.budget}</p>` : ''}
            </div>

            <div class="contact-info">
              <h2>📞 What's Next?</h2>
              <p>Our team will contact you within <span class="highlight">24 hours</span> to confirm your visit date and provide detailed directions to the site.</p>
              
              <p><strong>Site Location:</strong> Khushalipur Village, Near Delhi-Dehradun Expressway</p>
              <p><strong>Contact:</strong> +91-XXXXXXXXXX</p>
              <p><strong>Email:</strong> info@khushalipur.com</p>
            </div>

            <h2>🏞️ What to Expect During Your Visit</h2>
            <ul>
              <li>Complete site tour with our expert team</li>
              <li>Detailed plot information and pricing</li>
              <li>Legal documentation review</li>
              <li>Investment guidance and ROI calculations</li>
              <li>Refreshments and local hospitality</li>
            </ul>

            <p>We look forward to welcoming you to Khushalipur and helping you make an informed investment decision.</p>
            
            <div class="footer">
              <p>Best regards,<br>
              <strong>Team Khushalipur</strong><br>
              Premium Agricultural Land Investment</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getConfirmationEmailText(booking: BookingDetails): string {
    return `
Dear ${booking.name},

Thank you for booking a site visit to Khushalipur Agricultural Plots!

Your Booking Details:
- Name: ${booking.name}
- Mobile: ${booking.mobile}
- Email: ${booking.email}
${booking.preferredDate ? `- Preferred Date: ${booking.preferredDate}\n` : ''}${booking.plotSize ? `- Interested Plot Size: ${booking.plotSize}\n` : ''}${booking.budget ? `- Budget Range: ${booking.budget}\n` : ''}

Our team will contact you within 24 hours to confirm your visit date and provide directions.

Site Location: Khushalipur Village, Near Delhi-Dehradun Expressway

What to expect during your visit:
- Complete site tour with our expert team
- Detailed plot information and pricing  
- Legal documentation review
- Investment guidance and ROI calculations
- Refreshments and local hospitality

We look forward to welcoming you to Khushalipur!

Best regards,
Team Khushalipur
Premium Agricultural Land Investment
    `;
  }

  private getAdminAlertHtml(booking: BookingDetails): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Site Visit Booking Request</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 25px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #f8fffe; padding: 25px; border: 1px solid #e0f2f1; border-radius: 0 0 12px 12px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .priority-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 18px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0ea5e9; }
          .customer-info { margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 6px; }
          .action-list { background: #fefefe; padding: 18px; border-radius: 6px; border: 1px solid #e5e7eb; }
          h1 { margin: 0; font-size: 24px; font-weight: 600; }
          h2 { color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: 600; }
          .highlight { color: #059669; font-weight: 600; }
          .contact-link { color: #0ea5e9; text-decoration: none; font-weight: 500; }
          .footer { margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Site Visit Request</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Khushalipur Agricultural Plots</p>
          </div>
          <div class="content">
            <div class="priority-box">
              <p style="margin: 0;"><strong>Priority Action:</strong> Please contact this customer within 24 hours to schedule their site visit.</p>
            </div>
            
            <div class="booking-details">
              <h2>Customer Information</h2>
              <div class="customer-info">
                <p><strong>Name:</strong> ${booking.name}</p>
                <p><strong>Phone:</strong> <a href="tel:${booking.mobile}" class="contact-link">${booking.mobile}</a></p>
                <p><strong>Email:</strong> <a href="mailto:${booking.email}" class="contact-link">${booking.email}</a></p>
                ${booking.preferredDate ? `<p><strong>Preferred Visit Date:</strong> <span class="highlight">${booking.preferredDate}</span></p>` : ''}
                ${booking.plotSize ? `<p><strong>Interested Plot Size:</strong> ${booking.plotSize} sq ft</p>` : ''}
                ${booking.budget ? `<p><strong>Budget Range:</strong> ₹${booking.budget} lakhs</p>` : ''}
                <p><strong>Inquiry Received:</strong> ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>

            <div class="action-list">
              <h2>Follow-up Checklist</h2>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Call customer to confirm availability and schedule visit</li>
                <li>Share exact location coordinates and directions</li>
                <li>Prepare relevant plot documentation and pricing sheets</li>
                <li>Coordinate with site team for tour arrangements</li>
                <li>Arrange refreshments and welcome setup</li>
              </ul>
            </div>

            <div class="footer">
              <p>This notification was generated automatically from the Khushalipur website booking system.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminAlertText(booking: BookingDetails): string {
    return `
KHUSHALIPUR SITE VISIT REQUEST

Customer Information:
Name: ${booking.name}
Phone: ${booking.mobile}
Email: ${booking.email}
${booking.preferredDate ? `Preferred Visit Date: ${booking.preferredDate}\n` : ''}${booking.plotSize ? `Interested Plot Size: ${booking.plotSize} sq ft\n` : ''}${booking.budget ? `Budget Range: ₹${booking.budget} lakhs\n` : ''}
Inquiry Received: ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}

PRIORITY ACTION REQUIRED:
Please contact this customer within 24 hours to schedule their site visit.

Follow-up Checklist:
• Call customer to confirm availability and schedule visit
• Share exact location coordinates and directions  
• Prepare relevant plot documentation and pricing sheets
• Coordinate with site team for tour arrangements
• Arrange refreshments and welcome setup

This notification was generated from the Khushalipur website booking system.
    `;
  }
}