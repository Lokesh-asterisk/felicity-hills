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
        from: this.fromEmail,
        subject: 'Site Visit Booking Confirmed - Khushalipur Agricultural Plots',
        html: this.getConfirmationEmailHtml(bookingDetails),
        text: this.getConfirmationEmailText(bookingDetails)
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
        from: this.fromEmail,
        subject: 'New Site Visit Booking - Khushalipur',
        html: this.getAdminAlertHtml(bookingDetails),
        text: this.getAdminAlertText(bookingDetails)
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
        <title>New Site Visit Booking</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .urgent { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #fca5a5; }
          h1 { margin: 0; font-size: 22px; }
          h2 { color: #dc2626; margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Site Visit Booking Alert</h1>
            <p>Action Required - Contact Customer</p>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>⚠️ Priority:</strong> Contact within 24 hours to confirm visit details
            </div>
            
            <div class="booking-details">
              <h2>Customer Details</h2>
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Mobile:</strong> ${booking.mobile}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              ${booking.preferredDate ? `<p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>` : ''}
              ${booking.plotSize ? `<p><strong>Interested Plot Size:</strong> ${booking.plotSize}</p>` : ''}
              ${booking.budget ? `<p><strong>Budget Range:</strong> ${booking.budget}</p>` : ''}
              <p><strong>Booking Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
            </div>

            <h2>Next Steps</h2>
            <ul>
              <li>Call the customer to confirm visit date and time</li>
              <li>Provide detailed directions to Khushalipur site</li>
              <li>Prepare plot information based on their requirements</li>
              <li>Arrange for site tour and refreshments</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminAlertText(booking: BookingDetails): string {
    return `
NEW SITE VISIT BOOKING ALERT

Customer Details:
- Name: ${booking.name}
- Mobile: ${booking.mobile}
- Email: ${booking.email}
${booking.preferredDate ? `- Preferred Date: ${booking.preferredDate}\n` : ''}${booking.plotSize ? `- Interested Plot Size: ${booking.plotSize}\n` : ''}${booking.budget ? `- Budget Range: ${booking.budget}\n` : ''}
- Booking Time: ${new Date().toLocaleString('en-IN')}

ACTION REQUIRED: Contact customer within 24 hours to confirm visit details.

Next Steps:
- Call the customer to confirm visit date and time
- Provide detailed directions to Khushalipur site  
- Prepare plot information based on their requirements
- Arrange for site tour and refreshments
    `;
  }
}