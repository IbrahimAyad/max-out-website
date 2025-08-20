import { formatPrice } from "@/lib/utils/format";

interface BackInStockData {
  customerName: string;
  productName: string;
  productImage: string;
  productPrice: number;
  size: string;
  productUrl: string;
  unsubscribeUrl: string;
}

export function backInStockTemplate(data: BackInStockData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Back in Stock - KCT Menswear</title>
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
          
          <!-- Alert Banner -->
          <tr>
            <td style="background-color: #D4AF37; padding: 15px; text-align: center;">
              <h2 style="color: #1a1a1a; margin: 0; font-size: 20px; font-weight: bold;">
                🎉 IT'S BACK IN STOCK!
              </h2>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #666; margin: 0 0 30px 0; line-height: 1.6;">
                Hi ${data.customerName},<br><br>
                Great news! The item you were waiting for is now back in stock.
              </p>
              
              <!-- Product Card -->
              <div style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="200" style="padding: 20px;">
                      <img src="${data.productImage}" alt="${data.productName}" 
                           style="width: 100%; height: auto; display: block; border-radius: 4px;">
                    </td>
                    <td style="padding: 20px;">
                      <h3 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 18px;">
                        ${data.productName}
                      </h3>
                      <p style="color: #666; margin: 0 0 10px 0;">
                        Size: <strong>${data.size}</strong>
                      </p>
                      <p style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: bold;">
                        ${formatPrice(data.productPrice)}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Urgency Message -->
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #D4AF37;">
                <p style="color: #856404; margin: 0; font-weight: bold;">
                  ⏰ Don't wait too long!
                </p>
                <p style="color: #856404; margin: 5px 0 0 0; font-size: 14px;">
                  This item sold out quickly last time. We recommend ordering soon to avoid disappointment.
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.productUrl}" 
                   style="display: inline-block; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Shop Now
                </a>
              </div>
              
              <!-- Additional Info -->
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-top: 30px;">
                <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">
                  Why shop with KCT Menswear?
                </h4>
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>Free shipping on orders over $200</li>
                  <li>Expert tailoring services</li>
                  <li>30-day return policy</li>
                  <li>Personalized style consultations</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              You received this email because you requested to be notified when this item is back in stock.<br>
              <a href="${data.unsubscribeUrl}" style="color: #999;">Unsubscribe from back in stock alerts</a><br><br>
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