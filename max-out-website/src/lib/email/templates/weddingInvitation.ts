interface WeddingInvitationData {
  memberName: string;
  groomName: string;
  weddingDate: string;
  joinUrl: string;
  weddingCode: string;
}

export function weddingInvitationTemplate(data: WeddingInvitationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wedding Party Invitation - KCT Menswear</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Elegant Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">
                KCT MENSWEAR
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">
                WEDDING COLLECTION
              </p>
            </td>
          </tr>
          
          <!-- Decorative Element -->
          <tr>
            <td style="text-align: center; padding: 30px 0 0 0;">
              <div style="display: inline-block; width: 60px; height: 1px; background-color: #D4AF37;"></div>
              <div style="display: inline-block; margin: 0 10px; color: #D4AF37; font-size: 20px;">♦</div>
              <div style="display: inline-block; width: 60px; height: 1px; background-color: #D4AF37;"></div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px 40px 40px;">
              <h2 style="color: #1a1a1a; margin: 0 0 30px 0; font-size: 28px; text-align: center; font-weight: 300;">
                You're Invited to Join<br>
                ${data.groomName}'s Wedding Party
              </h2>
              
              <p style="color: #666; margin: 0 0 30px 0; line-height: 1.8; text-align: center; font-size: 16px;">
                Dear ${data.memberName},<br><br>
                ${data.groomName} has selected you to be part of his wedding party.
                We're honored to help you look your best on this special day.
              </p>
              
              <!-- Wedding Details Card -->
              <div style="background-color: #faf9f7; border: 1px solid #e5e5e5; padding: 30px; margin: 30px 0; text-align: center;">
                <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 20px; font-weight: 300;">
                  Wedding Date
                </h3>
                <p style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 400;">
                  ${data.weddingDate}
                </p>
              </div>
              
              <!-- Next Steps -->
              <div style="margin: 30px 0;">
                <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 18px; text-align: center;">
                  Your Next Steps:
                </h3>
                <ol style="color: #666; margin: 0; padding-left: 30px; line-height: 2;">
                  <li>Click the button below to access your personal fitting portal</li>
                  <li>Submit your measurements or schedule a fitting appointment</li>
                  <li>Select your attire from the groom's chosen options</li>
                  <li>Receive your perfectly fitted formal wear</li>
                </ol>
              </div>
              
              <!-- Access Code -->
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 30px 0; text-align: center;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                  Your Wedding Party Code:
                </p>
                <p style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                  ${data.weddingCode}
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.joinUrl}" 
                   style="display: inline-block; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: 400; font-size: 16px; letter-spacing: 1px;">
                  ACCESS YOUR FITTING PORTAL
                </a>
              </div>
              
              <!-- Services -->
              <div style="background-color: #faf9f7; padding: 25px; border-radius: 6px; margin-top: 40px;">
                <h4 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px; text-align: center;">
                  Complimentary Services Include:
                </h4>
                <div style="text-align: center; color: #666; line-height: 1.8;">
                  • Professional Measurements •<br>
                  • Expert Tailoring •<br>
                  • Style Consultation •<br>
                  • Group Coordination •
                </div>
              </div>
              
              <!-- Contact -->
              <p style="color: #666; margin: 40px 0 0 0; font-size: 14px; line-height: 1.6; text-align: center;">
                Questions? Our wedding specialists are here to help.<br>
                Call <a href="tel:313-525-2424" style="color: #D4AF37;">313-525-2424</a> or email
                <a href="mailto:weddings@kctmenswear.com" style="color: #D4AF37;">weddings@kctmenswear.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 12px; line-height: 1.6;">
                © 2024 KCT Menswear. All rights reserved.<br>
                Premium Men's Formal Wear • Detroit, Michigan
              </p>
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