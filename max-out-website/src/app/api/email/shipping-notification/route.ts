import { NextRequest, NextResponse } from 'next/server'
import { sendShippingNotification } from '@/lib/email/service'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify the request is from our admin panel
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, trackingNumber, carrier, estimatedDelivery } = await request.json()

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
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

    // Send shipping notification email
    await sendShippingNotification({
      to: order.email,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        items: order.order_items,
        trackingNumber,
        carrier,
        estimatedDelivery,
        shippingAddress: order.shipping_address
      }
    })

    // Update order status
    await supabase
      .from('orders')
      .update({ 
        status: 'shipped',
        tracking_number: trackingNumber,
        shipping_carrier: carrier,
        estimated_delivery: estimatedDelivery
      })
      .eq('id', orderId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send shipping notification' },
      { status: 500 }
    )
  }
}