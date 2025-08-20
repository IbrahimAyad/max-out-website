import { Resend } from 'resend'
import { OrderConfirmationEmail } from './templates/order-confirmation'
import { ShippingNotificationEmail } from './templates/shipping-notification'

// Lazy initialize Resend to avoid build-time errors
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is required')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

interface SendOrderConfirmationParams {
  to: string
  customerName: string
  orderNumber: string
  orderDate: string
  orderTotal: string
  items: Array<{
    name: string
    quantity: number
    price: string
    image?: string
  }>
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

interface SendShippingNotificationParams {
  to: string
  customerName: string
  orderNumber: string
  trackingNumber: string
  carrier: string
  estimatedDelivery: string
  items: Array<{
    name: string
    quantity: number
    image?: string
  }>
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'KCT Menswear <orders@kctmenswear.com>',
      to: params.to,
      subject: `Order Confirmation - ${params.orderNumber}`,
      react: OrderConfirmationEmail({
        customerName: params.customerName,
        orderNumber: params.orderNumber,
        orderDate: params.orderDate,
        orderTotal: params.orderTotal,
        items: params.items,
        shippingAddress: params.shippingAddress,
      }),
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error }
  }
}

export async function sendShippingNotification(params: SendShippingNotificationParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'KCT Menswear <shipping@kctmenswear.com>',
      to: params.to,
      subject: `Your Order Has Shipped - ${params.orderNumber}`,
      react: ShippingNotificationEmail({
        customerName: params.customerName,
        orderNumber: params.orderNumber,
        trackingNumber: params.trackingNumber,
        carrier: params.carrier,
        estimatedDelivery: params.estimatedDelivery,
        items: params.items,
        shippingAddress: params.shippingAddress,
      }),
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send shipping notification email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'KCT Menswear <welcome@kctmenswear.com>',
      to,
      subject: 'Welcome to KCT Menswear',
      html: `
        <h1>Welcome to KCT Menswear, ${name}!</h1>
        <p>Thank you for joining our community of distinguished gentlemen.</p>
        <p>As a member, you'll enjoy:</p>
        <ul>
          <li>Early access to new collections</li>
          <li>Exclusive member discounts</li>
          <li>Personalized style recommendations</li>
          <li>Priority customer service</li>
        </ul>
        <p>Start shopping our latest collection today!</p>
      `,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Assuming amount is in cents
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })
  return formatter.format(amount / 100)
}