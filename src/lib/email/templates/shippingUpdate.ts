interface ShippingUpdateData {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export function shippingUpdateTemplate(data: ShippingUpdateData): string {
  const itemsList = data.items
    .map((item) => `• ${item.name} (${item.quantity}x)`)
    .join("<br>");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped - KCT Menswear</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">KCT MENSWEAR</h1>
            </td>
          </tr>
          
          <!-- Icon -->
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              <div style="display: inline-block; background-color: #D4AF37; border-radius: 50%; padding: 20px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8H17V6C17 4.9 16.1 4 15 4H9C7.9 4 7 4.9 7 6V8H4C2.9 8 2 8.9 2 10V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V10C22 8.9 21.1 8 20 8ZM9 6H15V8H9V6ZM20 19H4V13H7V15H9V13H15V15H17V13H20V19Z" fill="#1a1a1a"/>
                </svg>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
                Your Order is On Its Way!
              </h2>
              
              <p style="color: #666; margin: 0 0 30px 0; line-height: 1.6;">
                Hi ${data.customerName},<br><br>
                Great news! Your order #${data.orderNumber} has been shipped and is on its way to you.
              </p>
              
              <!-- Tracking Info -->
              <div style="background-color: #f9f9f9; padding: 25px; border-radius: 6px; margin-bottom: 30px; text-align: center;">
                <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">
                  Tracking Information
                </h3>
                <p style="color: #666; margin: 0 0 5px 0;">
                  <strong>Carrier:</strong> ${data.carrier}
                </p>
                <p style="color: #666; margin: 0 0 20px 0;">
                  <strong>Tracking Number:</strong> ${data.trackingNumber}
                </p>
                <a href="${data.trackingUrl}" 
                   style="display: inline-block; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold;">
                  Track Package
                </a>
              </div>
              
              <!-- Delivery Estimate -->
              <div style="background-color: #e8f4f8; padding: 20px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #D4AF37;">
                <p style="color: #1a1a1a; margin: 0; font-weight: bold;">
                  Estimated Delivery:
                </p>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 18px;">
                  ${data.estimatedDelivery}
                </p>
              </div>
              
              <!-- Items -->
              <div style="margin-bottom: 30px;">
                <h4 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px;">
                  Items in This Shipment:
                </h4>
                <p style="color: #666; margin: 0; line-height: 1.8;">
                  ${itemsList}
                </p>
              </div>
              
              <!-- Tips -->
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px;">
                <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">
                  Delivery Tips:
                </h4>
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>Someone should be available to sign for the package</li>
                  <li>Check the package immediately upon arrival</li>
                  <li>Contact us within 48 hours if there are any issues</li>
                </ul>
              </div>
              
              <!-- Contact -->
              <p style="color: #666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; text-align: center;">
                Questions about your order?<br>
                Call us at <a href="tel:313-525-2424" style="color: #D4AF37;">313-525-2424</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              © 2024 KCT Menswear. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}