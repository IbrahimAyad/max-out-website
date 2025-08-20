"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Share2, 
  ShoppingBag, 
  Trash2, 
  Edit2,
  Mail,
  Calendar,
  Star,
  Gift,
  Check,
  X,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import { useCartStore } from '@/store/cartStore'
import type { WishlistItem } from '@/lib/customer/types'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import { format } from 'date-fns'

const PRIORITY_LABELS = {
  1: { label: 'High Priority', color: 'bg-red-100 text-red-800' },
  2: { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  3: { label: 'Low Priority', color: 'bg-gray-100 text-gray-800' }
}

export function Wishlist() {
  const { 
    profile, 
    removeFromWishlist, 
    updateWishlistItem,
    shareWishlist 
  } = useCustomerStore()
  const { addItem } = useCartStore()
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSharing, setIsSharing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [shareForm, setShareForm] = useState({
    recipientEmail: '',
    recipientName: '',
    message: '',
    occasion: ''
  })
  const [filterPriority, setFilterPriority] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'priority'>('date')

  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign in to create a wishlist</h3>
        <p className="text-gray-600 mb-4">Save your favorite items and share with friends & family</p>
        <Button className="bg-burgundy hover:bg-burgundy-700">
          Sign In
        </Button>
      </Card>
    )
  }

  const wishlist = profile.wishlist || []
  
  // Filter and sort wishlist
  const filteredWishlist = wishlist
    .filter(item => !filterPriority || item.priorityLevel === filterPriority)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price
        case 'priority':
          return (a.priorityLevel || 3) - (b.priorityLevel || 3)
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await addItem({
        productId: item.productId,
        quantity: 1
      })
      removeFromWishlist(item.id)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleShare = async () => {
    if (!shareForm.recipientEmail || selectedItems.size === 0) return
    
    try {
      await shareWishlist(Array.from(selectedItems), shareForm.recipientEmail)
      
      // Send email notification (in real app)
      // console.log('Sharing wishlist:', {
      //   items: Array.from(selectedItems),
      //   ...shareForm
      // })
      
      // Reset form
      setIsSharing(false)
      setSelectedItems(new Set())
      setShareForm({
        recipientEmail: '',
        recipientName: '',
        message: '',
        occasion: ''
      })
    } catch (error) {
      console.error('Failed to share wishlist:', error)
    }
  }

  const copyShareLink = () => {
    const shareableItems = Array.from(selectedItems).join(',')
    const shareUrl = `${window.location.origin}/wishlist/shared?items=${shareableItems}&user=${profile.id}`
    navigator.clipboard.writeText(shareUrl)
  }

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const selectAll = () => {
    setSelectedItems(new Set(filteredWishlist.map(item => item.id)))
  }

  const deselectAll = () => {
    setSelectedItems(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">My Wishlist</h2>
          <p className="text-gray-600 mt-1">
            {wishlist.length} items saved • Share with friends & family
          </p>
        </div>
        
        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSharing(true)}
              disabled={selectedItems.size === 0}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Selected ({selectedItems.size})
            </Button>
          </div>
        )}
      </div>

      {/* Filters & Sort */}
      {wishlist.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by priority:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filterPriority === null ? "default" : "outline"}
                  onClick={() => setFilterPriority(null)}
                  className={cn(filterPriority === null && "bg-burgundy hover:bg-burgundy-700")}
                >
                  All
                </Button>
                {[1, 2, 3].map(priority => (
                  <Button
                    key={priority}
                    size="sm"
                    variant={filterPriority === priority ? "default" : "outline"}
                    onClick={() => setFilterPriority(priority)}
                    className={cn(filterPriority === priority && "bg-burgundy hover:bg-burgundy-700")}
                  >
                    <Star className={cn(
                      "h-3 w-3",
                      priority === 1 && "fill-current"
                    )} />
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              >
                <option value="date">Recently Added</option>
                <option value="price">Price</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Select All/None */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={selectAll}>
                Select All
              </Button>
              <Button size="sm" variant="ghost" onClick={deselectAll}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Wishlist Items */}
      <div className="grid gap-4">
        {filteredWishlist.map((item, index) => {
          const isSelected = selectedItems.has(item.id)
          const isEditing = editingId === item.id
          const priority = PRIORITY_LABELS[item.priorityLevel || 3]

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "p-6 transition-all",
                isSelected && "ring-2 ring-burgundy"
              )}>
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItemSelection(item.id)}
                    className="mt-1"
                  />

                  {/* Product Image */}
                  {item.productImage && (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  )}

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{item.productName}</h3>
                        <p className="text-2xl font-bold text-burgundy mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Added {format(new Date(item.addedAt), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                        {item.sharedWith && item.sharedWith.length > 0 && (
                          <Badge variant="secondary">
                            <Share2 className="mr-1 h-3 w-3" />
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {isEditing ? (
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={item.notes || ''}
                          onChange={(e) => updateWishlistItem(item.id, { notes: e.target.value })}
                          placeholder="Add notes (size preferences, color, etc.)"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                          rows={2}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Priority:</span>
                          {[1, 2, 3].map(level => (
                            <Button
                              key={level}
                              size="sm"
                              variant={item.priorityLevel === level ? "default" : "outline"}
                              onClick={() => updateWishlistItem(item.id, { priorityLevel: level as 1 | 2 | 3 })}
                              className={cn(
                                item.priorityLevel === level && "bg-burgundy hover:bg-burgundy-700"
                              )}
                            >
                              {level === 1 && <Star className="h-3 w-3 fill-current" />}
                              {level === 2 && <Star className="h-3 w-3" />}
                              {level === 3 && ''}
                              <span className="ml-1">{level}</span>
                            </Button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingId(null)}
                            className="bg-burgundy hover:bg-burgundy-700"
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : item.notes ? (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">"{item.notes}"</p>
                      </div>
                    ) : null}

                    {/* Actions */}
                    {!isEditing && (
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="bg-burgundy hover:bg-burgundy-700"
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = `/products/${item.productId}`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(item.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isSharing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsSharing(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Share Wishlist</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    value={shareForm.recipientEmail}
                    onChange={(e) => setShareForm({ ...shareForm, recipientEmail: e.target.value })}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={shareForm.recipientName}
                    onChange={(e) => setShareForm({ ...shareForm, recipientName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Occasion
                  </label>
                  <select
                    value={shareForm.occasion}
                    onChange={(e) => setShareForm({ ...shareForm, occasion: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  >
                    <option value="">Select occasion...</option>
                    <option value="birthday">Birthday</option>
                    <option value="holiday">Holiday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="wedding">Wedding</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Personal Message
                  </label>
                  <textarea
                    value={shareForm.message}
                    onChange={(e) => setShareForm({ ...shareForm, message: e.target.value })}
                    placeholder="Hi! I wanted to share some items from my wishlist..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Sharing {selectedItems.size} items</p>
                  <p className="text-xs text-gray-600">
                    The recipient will receive an email with links to view these items
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleShare}
                    disabled={!shareForm.recipientEmail}
                    className="flex-1 bg-burgundy hover:bg-burgundy-700"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={copyShareLink}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setIsSharing(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {wishlist.length === 0 && (
        <Card className="p-12 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Save your favorite items to share with friends or purchase later
          </p>
          <Button className="bg-burgundy hover:bg-burgundy-700">
            Browse Collection
          </Button>
        </Card>
      )}
    </div>
  )
}