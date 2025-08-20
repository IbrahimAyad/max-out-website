import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation, formatOrderDate, formatCurrency } from '@/lib/email/service'
import { createClient } from '@/lib/supabase/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify the request is from our webhook by checking a secret
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (webhookSecret !== process.env.INTERNAL_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await request.json()

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product_id,
          variant_id,
          product_name,
          product_image
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Send email using SendGrid
    const msg = {
      to: order.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: process.env.SENDGRID_FROM_NAME!
      },
      subject: `Order Confirmation - ${order.order_number}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order ${order.order_number} has been confirmed.</p>
        <p>Total: $${(order.total / 100).toFixed(2)}</p>
      `
    }

    await sgMail.send(msg)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}