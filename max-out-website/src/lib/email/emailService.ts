import { emailClient } from "./emailClient";
import { orderConfirmationTemplate } from "./templates/orderConfirmation";
import { shippingUpdateTemplate } from "./templates/shippingUpdate";
import { backInStockTemplate } from "./templates/backInStock";
import { weddingInvitationTemplate } from "./templates/weddingInvitation";

export class EmailService {
  async sendOrderConfirmation(data: {
    email: string;
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      size: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: any;
  }) {
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const html = orderConfirmationTemplate({
      ...data,
      estimatedDelivery,
    });

    await emailClient.send({
      to: data.email,
      subject: `Order Confirmation #${data.orderNumber} - KCT Menswear`,
      html,
      tags: [
        { name: "type", value: "order_confirmation" },
        { name: "order_id", value: data.orderNumber },
      ],
    });
  }

  async sendShippingUpdate(data: {
    email: string;
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    carrier: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
  }) {
    const trackingUrl = this.getTrackingUrl(data.carrier, data.trackingNumber);
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const html = shippingUpdateTemplate({
      ...data,
      trackingUrl,
      estimatedDelivery,
    });

    await emailClient.send({
      to: data.email,
      subject: `Your Order Has Shipped! #${data.orderNumber}`,
      html,
      tags: [
        { name: "type", value: "shipping_update" },
        { name: "order_id", value: data.orderNumber },
      ],
    });
  }

  async sendBackInStockAlert(data: {
    email: string;
    customerName: string;
    productName: string;
    productImage: string;
    productPrice: number;
    size: string;
    productId: string;
  }) {
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${data.productId}`;
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(data.email)}&type=back_in_stock`;

    const html = backInStockTemplate({
      ...data,
      productUrl,
      unsubscribeUrl,
    });

    await emailClient.send({
      to: data.email,
      subject: `${data.productName} is Back in Stock!`,
      html,
      tags: [
        { name: "type", value: "back_in_stock" },
        { name: "product_id", value: data.productId },
      ],
    });
  }

  async sendWeddingInvitation(data: {
    email: string;
    memberName: string;
    groomName: string;
    weddingDate: string;
    weddingCode: string;
  }) {
    const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/wedding/join?code=${data.weddingCode}`;

    const html = weddingInvitationTemplate({
      ...data,
      joinUrl,
    });

    await emailClient.send({
      to: data.email,
      subject: `You're Invited to ${data.groomName}'s Wedding Party`,
      html,
      tags: [
        { name: "type", value: "wedding_invitation" },
        { name: "wedding_code", value: data.weddingCode },
      ],
    });
  }

  async sendBatchBackInStockAlerts(subscribers: Array<{
    email: string;
    customerName: string;
    productName: string;
    productImage: string;
    productPrice: number;
    size: string;
    productId: string;
  }>) {
    const emails = subscribers.map((subscriber) => {
      const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${subscriber.productId}`;
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&type=back_in_stock`;

      return {
        to: subscriber.email,
        subject: `${subscriber.productName} is Back in Stock!`,
        html: backInStockTemplate({
          ...subscriber,
          productUrl,
          unsubscribeUrl,
        }),
        tags: [
          { name: "type", value: "back_in_stock" },
          { name: "product_id", value: subscriber.productId },
        ],
      };
    });

    await emailClient.sendBatch(emails);
  }

  private getTrackingUrl(carrier: string, trackingNumber: string): string {
    const carriers: { [key: string]: string } = {
      ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      fedex: `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`,
      dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    };

    return carriers[carrier.toLowerCase()] || "#";
  }
}

export const emailService = new EmailService();