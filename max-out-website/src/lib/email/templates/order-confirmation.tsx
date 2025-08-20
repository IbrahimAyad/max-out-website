import * as React from 'react'

interface OrderConfirmationEmailProps {
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

export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  orderDate,
  orderTotal,
  items,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#000', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>KCT Menswear</h1>
      </div>
      
      {/* Main Content */}
      <div style={{ padding: '30px', backgroundColor: '#f8f8f8' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Thank you for your order, {customerName}!
        </h2>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          We've received your order and will begin processing it right away. 
          You'll receive another email when your order ships.
        </p>
        
        {/* Order Details */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Order Details</h3>
          <p style={{ margin: '5px 0' }}>
            <strong>Order Number:</strong> {orderNumber}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Order Date:</strong> {orderDate}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Total:</strong> {orderTotal}
          </p>
        </div>
        
        {/* Items */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Items Ordered</h3>
          {items.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
                paddingBottom: '15px',
                marginBottom: '15px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ margin: 0, color: '#666' }}>
                    Quantity: {item.quantity} × {item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Shipping Address */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Shipping Address</h3>
          <p style={{ margin: '5px 0' }}>{shippingAddress.line1}</p>
          {shippingAddress.line2 && <p style={{ margin: '5px 0' }}>{shippingAddress.line2}</p>}
          <p style={{ margin: '5px 0' }}>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
          </p>
          <p style={{ margin: '5px 0' }}>{shippingAddress.country}</p>
        </div>
        
        {/* CTA Buttons */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a 
            href={`https://kctmenswear.com/orders/${orderNumber}`}
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '4px',
              marginRight: '10px'
            }}
          >
            Track Your Order
          </a>
          <a 
            href="https://kctmenswear.com/products"
            style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#000',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '4px',
              border: '1px solid #000'
            }}
          >
            Continue Shopping
          </a>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p style={{ margin: '5px 0' }}>
          Questions? Contact us at{' '}
          <a href="mailto:support@kctmenswear.com" style={{ color: '#000' }}>
            support@kctmenswear.com
          </a>
        </p>
        <p style={{ margin: '5px 0' }}>
          © 2024 KCT Menswear. All rights reserved.
        </p>
      </div>
    </div>
  )
}