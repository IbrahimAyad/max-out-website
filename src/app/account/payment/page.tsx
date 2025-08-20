'use client'

import { useState } from 'react'
import { CreditCard, Plus, Trash2, Edit, Shield } from 'lucide-react'

export default function PaymentMethodsPage() {
  // Start with empty payment methods - this would be populated from Stripe API in production
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  const removePaymentMethod = (methodId: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== methodId))
  }

  const setAsDefault = (methodId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    )
  }

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-1">Manage your saved payment methods</p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Secure Payment Processing</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and securely stored by our payment processor. 
                We never store your full card details on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getBrandIcon(method.brand)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{method.brand}</span>
                      <span className="text-gray-600">•••• {method.last4}</span>
                      {method.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => setAsDefault(method.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Set as Default
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removePaymentMethod(method.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add New Payment Method
            </button>
          ) : (
            <div>
              <h3 className="font-semibold mb-4">Add New Card</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="setDefault" />
                  <label htmlFor="setDefault" className="text-sm text-gray-600">
                    Set as default payment method
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    Add Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {paymentMethods.length === 0 && !showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Methods Saved</h3>
            <p className="text-gray-600 mb-6">Save your payment methods for faster checkout</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Card
            </button>
          </div>
        )}
      </div>
    </div>
  )
}