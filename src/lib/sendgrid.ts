import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {

} else {
  sgMail.setApiKey(apiKey);
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

// Default sender email - update this with your verified sender
const DEFAULT_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@kctmenswear.com';
const DEFAULT_FROM_NAME = 'KCT Menswear';

export async function sendEmail(options: EmailOptions) {
  if (!apiKey) {

    throw new Error('Email service not configured');
  }

  const msg = {
    to: options.to,
    from: options.from || {
      email: DEFAULT_FROM_EMAIL,
      name: DEFAULT_FROM_NAME
    },
    subject: options.subject,
    text: options.text,
    html: options.html,
    templateId: options.templateId,
    dynamicTemplateData: options.dynamicTemplateData,
  };

  try {
    const response = await sgMail.send(msg);

    return response;
  } catch (error) {

    throw error;
  }
}

// Specific email functions

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This email was sent from the KCT Menswear contact form.
      </p>
    </div>
  `;

  // Send to admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'KCTMenswear@gmail.com',
    subject: `Contact Form: ${data.subject || 'New Inquiry'} from ${data.name}`,
    html: emailContent,
    text: `New contact form submission from ${data.name}\n\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nSubject: ${data.subject || 'Not specified'}\n\nMessage:\n${data.message}`
  });

  // Send confirmation to user
  const confirmationEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #333;">Thank You for Contacting KCT Menswear</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${data.name},</p>
        <p>We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you within 24 hours.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Message:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <p>If you need immediate assistance, please call us at:</p>
        <p><strong>(269) 532-4852</strong></p>
        <p>Best regards,<br>The KCT Menswear Team</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>KCT Menswear | 213 S Kalamazoo Mall, Kalamazoo, MI 49007</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: data.email,
    subject: 'Thank you for contacting KCT Menswear',
    html: confirmationEmail,
    text: `Thank you for contacting KCT Menswear\n\nDear ${data.name},\n\nWe've received your message and will get back to you within 24 hours.\n\nBest regards,\nThe KCT Menswear Team`
  });
}

export async function sendNewsletterWelcome(email: string) {
  const welcomeEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background-color: #000;">
        <h1 style="color: #D4AF37; margin: 0;">Welcome to KCT Menswear</h1>
      </div>
      <div style="padding: 40px 20px;">
        <h2 style="color: #333;">Thank You for Subscribing!</h2>
        <p>Welcome to the KCT Menswear family! We're excited to have you join our community of style-conscious gentlemen.</p>

        <h3>What to Expect:</h3>
        <ul style="line-height: 1.8;">
          <li>Exclusive offers and early access to sales</li>
          <li>New collection announcements</li>
          <li>Style tips and fashion advice</li>
          <li>Special event invitations</li>
        </ul>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #333; margin-top: 0;">First-Time Subscriber Offer</h3>
          <p style="font-size: 24px; color: #D4AF37; font-weight: bold; margin: 10px 0;">10% OFF</p>
          <p>Your Next Purchase</p>
          <p style="font-size: 14px; color: #666;">Use code: WELCOME10</p>
        </div>

        <p>Visit our stores:</p>
        <p><strong>Downtown:</strong> 213 S Kalamazoo Mall<br>
        <strong>Portage:</strong> 6650 S Westnedge Ave</p>

        <p>Questions? Call us at <strong>(269) 532-4852</strong></p>
      </div>
      <div style="text-align: center; padding: 20px; background-color: #f5f5f5; color: #666; font-size: 12px;">
        <p>You're receiving this email because you subscribed to our newsletter.</p>
        <p>© 2024 KCT Menswear. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to KCT Menswear - 10% Off Your First Order!',
    html: welcomeEmail,
    text: 'Welcome to KCT Menswear!\n\nThank you for subscribing to our newsletter. As a welcome gift, enjoy 10% off your next purchase with code: WELCOME10\n\nVisit us at our Downtown or Portage locations.\n\nBest regards,\nThe KCT Menswear Team'
  });

  // Also notify admin of new subscriber
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'KCTMenswear@gmail.com',
    subject: 'New Newsletter Subscriber',
    text: `New newsletter subscriber: ${email}`,
    html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`
  });
}

export async function sendOrderConfirmation(orderData: {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}) {
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const orderEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px; background-color: #000;">
        <h1 style="color: #D4AF37; margin: 0;">Order Confirmation</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Thank you for your order, ${orderData.customerName}!</h2>
        <p>Your order #${orderData.orderId} has been confirmed and is being processed.</p>

        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">$${orderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">$${orderData.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;">Tax:</td>
              <td style="padding: 10px; text-align: right;">$${orderData.tax.toFixed(2)}</td>
            </tr>
            <tr style="font-weight: bold; font-size: 1.1em;">
              <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">$${orderData.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <h3>Shipping Address:</h3>
        <p>
          ${orderData.shippingAddress.street}<br>
          ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}
        </p>

        <p>You'll receive a shipping confirmation email with tracking information once your order ships.</p>

        <p>Questions? Contact us at (269) 532-4852 or KCTMenswear@gmail.com</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: orderData.customerEmail,
    subject: `Order Confirmation #${orderData.orderId} - KCT Menswear`,
    html: orderEmail
  });
}