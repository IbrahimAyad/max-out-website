"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  RefreshCw,
  ChevronRight,
  Calendar,
  DollarSign,
  Copy,
  Download,
  Eye,
  ShoppingBag
} from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { useCartStore } from '@/store/cartStore'
import type { OrderSummary, OrderItem } from '@/lib/customer/types'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import { format } from 'date-fns'

const STATUS_CONFIG = {
  pending: { icon: Package, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  cancelled: { icon: Package, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  returned: { icon: RefreshCw, color: 'bg-gray-100 text-gray-800', label: 'Returned' },
  refunded: { icon: DollarSign, color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
}

interface OrderHistoryProps {
  limit?: number
  showPagination?: boolean
}

export function OrderHistory({ limit, showPagination = true }: OrderHistoryProps) {
  const { profile, getRecentOrders } = useCustomerStore()
  const { addItem } = useCartStore()
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = limit || 10

  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign in to view order history</h3>
        <p className="text-gray-600 mb-4">Track your orders and easily reorder favorites</p>
        <Button className="bg-burgundy hover:bg-burgundy-700">
          Sign In
        </Button>
      </Card>
    )
  }

  const orders = profile.orderHistory || []
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleReorder = async (order: OrderSummary) => {
    setReorderingId(order.id)
    
    try {
      // Add selected items to cart
      const itemsToReorder = order.items.filter(item => 
        selectedItems[`${order.id}-${item.id}`] !== false
      )
      
      for (const item of itemsToReorder) {
        await addItem({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          customizations: item.customizations
        })
      }
      
      // Reset selection
      setSelectedItems({})
      setReorderingId(null)
      
      // Show success message or redirect to cart
      // console.log(`Added ${itemsToReorder.length} items to cart`)
    } catch (error) {
      console.error('Reorder failed:', error)
    } finally {
      setReorderingId(null)
    }
  }

  const handleReorderSingle = async (order: OrderSummary, item: OrderItem) => {
    try {
      await addItem({
        productId: item.productId,
        quantity: 1,
        size: item.size,
        color: item.color,
        customizations: item.customizations
      })
      
      // console.log(`Added ${item.productName} to cart`)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  const toggleItemSelection = (orderId: string, itemId: string) => {
    const key = `${orderId}-${itemId}`
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const downloadInvoice = (order: OrderSummary) => {
    // In a real app, this would generate and download a PDF invoice
    // console.log('Downloading invoice for order:', order.orderNumber)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif">Order History</h2>
        <p className="text-gray-600 mt-1">View past orders and quickly reorder favorites</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.map((order, index) => {
          const isExpanded = expandedOrderId === order.id
          const statusConfig = STATUS_CONFIG[order.status]
          const StatusIcon = statusConfig.icon

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                {/* Order Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <StatusIcon className={cn(
                          "h-8 w-8 p-1.5 rounded-full",
                          statusConfig.color
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(order.date), 'MMMM d, yyyy')} • {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 text-gray-400 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {isExpanded && (
                  <div className="border-t">
                    {/* Items */}
                    <div className="p-6 space-y-4">
                      {order.items.map((item) => {
                        const isSelected = selectedItems[`${order.id}-${item.id}`] !== false

                        return (
                          <div key={item.id} className="flex items-start gap-4">
                            {/* Selection Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItemSelection(order.id, item.id)}
                              className="mt-1"
                            />
                            
                            {/* Item Image */}
                            {item.productImage && (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            )}
                            
                            {/* Item Details */}
                            <div className="flex-1">
                              <h4 className="font-medium">{item.productName}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.variant} • Size: {item.size} • Color: {item.color}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                              {item.customizations && (
                                <p className="text-sm text-burgundy mt-1">
                                  Customized
                                </p>
                              )}
                            </div>
                            
                            {/* Item Actions */}
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReorderSingle(order, item)
                                }}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Reorder
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Navigate to product page
                                  window.location.href = `/products/${item.productId}`
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Order Info */}
                    <div className="px-6 py-4 bg-gray-50 space-y-3">
                      {/* Shipping Info */}
                      {order.trackingNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tracking Number:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{order.trackingNumber}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(order.trackingNumber!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {order.estimatedDelivery && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Estimated Delivery:</span>
                          <span className="text-sm font-medium">
                            {format(new Date(order.estimatedDelivery), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}

                      {/* Price Breakdown */}
                      <div className="pt-3 space-y-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => downloadInvoice(order)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                      
                      <Button
                        onClick={() => handleReorder(order)}
                        disabled={reorderingId === order.id}
                        className="bg-burgundy hover:bg-burgundy-700"
                      >
                        <RefreshCw className={cn(
                          "mr-2 h-4 w-4",
                          reorderingId === order.id && "animate-spin"
                        )} />
                        Reorder Selected Items
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10",
                  currentPage === page && "bg-burgundy hover:bg-burgundy-700"
                )}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">
            Once you place your first order, you'll be able to track it here
          </p>
          <Button className="bg-burgundy hover:bg-burgundy-700">
            Start Shopping
          </Button>
        </Card>
      )}
    </div>
  )
}