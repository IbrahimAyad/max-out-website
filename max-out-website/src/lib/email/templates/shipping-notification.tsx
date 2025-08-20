import * as React from 'react'

interface ShippingNotificationEmailProps {
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

export function ShippingNotificationEmail({
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
  shippingAddress,
}: ShippingNotificationEmailProps) {
  const getTrackingUrl = () => {
    switch (carrier.toLowerCase()) {
      case 'ups':
        return `https://www.ups.com/track?tracknum=${trackingNumber}`
      case 'fedex':
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
      case 'usps':
        return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
      default:
        return '#'
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#000', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>KCT Menswear</h1>
      </div>
      
      {/* Main Content */}
      <div style={{ padding: '30px', backgroundColor: '#f8f8f8' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Great news, {customerName}! Your order has shipped.
        </h2>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Your order is on its way! Track your package to see when it will arrive.
        </p>
        
        {/* Tracking Info */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Tracking Information</h3>
          <p style={{ margin: '5px 0' }}>
            <strong>Order Number:</strong> {orderNumber}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Tracking Number:</strong> {trackingNumber}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Carrier:</strong> {carrier}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Estimated Delivery:</strong> {estimatedDelivery}
          </p>
          
          <a 
            href={getTrackingUrl()}
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '15px'
            }}
          >
            Track Your Package
          </a>
        </div>
        
        {/* Items */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Items in This Shipment</h3>
          {items.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
                paddingBottom: '10px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                  />
                )}
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Delivery Address */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Delivery Address</h3>
          <p style={{ margin: '5px 0' }}>{shippingAddress.line1}</p>
          {shippingAddress.line2 && <p style={{ margin: '5px 0' }}>{shippingAddress.line2}</p>}
          <p style={{ margin: '5px 0' }}>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
          </p>
          <p style={{ margin: '5px 0' }}>{shippingAddress.country}</p>
        </div>
        
        {/* Tips */}
        <div style={{ backgroundColor: '#fffbf0', padding: '20px', borderRadius: '8px', border: '1px solid #ffd700' }}>
          <h4 style={{ color: '#333', marginTop: 0, marginBottom: '10px' }}>Delivery Tips</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li style={{ marginBottom: '5px' }}>
              Someone should be available to sign for the package
            </li>
            <li style={{ marginBottom: '5px' }}>
              Check with neighbors if you miss the delivery
            </li>
            <li style={{ marginBottom: '5px' }}>
              Contact us if the package doesn't arrive by {estimatedDelivery}
            </li>
          </ul>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p style={{ margin: '5px 0' }}>
          Need help? Contact us at{' '}
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