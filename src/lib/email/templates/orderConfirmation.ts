import { formatPrice } from "@/lib/utils/format";

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  estimatedDelivery: string;
}

export function orderConfirmationTemplate(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
            <strong>${item.name}</strong><br>
            <span style="color: #666; font-size: 14px;">Size: ${item.size} | Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - KCT Menswear</title>
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
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Premium Men's Formal Wear</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">
                Thank You for Your Order!
              </h2>
              
              <p style="color: #666; margin: 0 0 30px 0; line-height: 1.6;">
                Hi ${data.customerName},<br><br>
                We've received your order and it's being processed. You'll receive a shipping notification once your order is on its way.
              </p>
              
              <!-- Order Details -->
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                <h3 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 18px;">
                  Order #${data.orderNumber}
                </h3>
                <p style="color: #666; margin: 0; font-size: 14px;">
                  Estimated Delivery: ${data.estimatedDelivery}
                </p>
              </div>
              
              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; border-bottom: 2px solid #e5e5e5; color: #1a1a1a;">
                      Items
                    </th>
                    <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e5e5e5; color: #1a1a1a;">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 12px; text-align: right; color: #666;">Subtotal:</td>
                    <td style="padding: 12px; text-align: right;">${formatPrice(data.subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; text-align: right; color: #666;">Tax:</td>
                    <td style="padding: 12px; text-align: right;">${formatPrice(data.tax)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; text-align: right; color: #666;">Shipping:</td>
                    <td style="padding: 12px; text-align: right;">${data.shipping === 0 ? "FREE" : formatPrice(data.shipping)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #e5e5e5;">
                      Total:
                    </td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #e5e5e5;">
                      ${formatPrice(data.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              
              <!-- Shipping Address -->
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">
                  Shipping Address
                </h4>
                <p style="color: #666; margin: 0; line-height: 1.6;">
                  ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
                  ${data.shippingAddress.address}<br>
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${data.orderNumber}" 
                   style="display: inline-block; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold;">
                  Track Your Order
                </a>
              </div>
              
              <!-- Footer Message -->
              <p style="color: #666; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; text-align: center;">
                Questions? Contact us at<br>
                <a href="tel:313-525-2424" style="color: #D4AF37;">313-525-2424</a> or 
                <a href="mailto:support@kctmenswear.com" style="color: #D4AF37;">support@kctmenswear.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              © 2024 KCT Menswear. All rights reserved.<br>
              Detroit, Michigan
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