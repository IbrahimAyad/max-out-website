"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ruler, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Info,
  Star,
  Copy,
  User
} from 'lucide-react'
import { useCustomerStore } from '@/store/customerStore'
import type { MeasurementProfile } from '@/lib/customer/types'
import { cn } from '@/lib/utils/cn'

const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest', icon: '👔', helpText: 'Around fullest part' },
  { key: 'waist', label: 'Waist', icon: '👖', helpText: 'Natural waistline' },
  { key: 'hips', label: 'Hips', icon: '🩳', helpText: 'Widest part' },
  { key: 'neck', label: 'Neck', icon: '👔', helpText: 'Around base' },
  { key: 'sleeve', label: 'Sleeve', icon: '💪', helpText: 'Shoulder to wrist' },
  { key: 'inseam', label: 'Inseam', icon: '📏', helpText: 'Crotch to ankle' },
  { key: 'shoulder', label: 'Shoulder', icon: '🎯', helpText: 'Across back' },
  { key: 'height', label: 'Height', icon: '📐', helpText: 'Total height' },
  { key: 'weight', label: 'Weight', icon: '⚖️', helpText: 'Current weight' }
]

const FIT_PREFERENCES = [
  { value: 'tight', label: 'Tight', description: 'Form-fitting' },
  { value: 'fitted', label: 'Fitted', description: 'Tailored close' },
  { value: 'regular', label: 'Regular', description: 'Standard fit' },
  { value: 'loose', label: 'Loose', description: 'Relaxed fit' }
]

export function MeasurementProfiles() {
  const { 
    profile, 
    addMeasurement, 
    updateMeasurement, 
    deleteMeasurement,
    setDefaultMeasurement 
  } = useCustomerStore()
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<MeasurementProfile>>({
    name: '',
    unit: 'inches',
    fitPreference: 'regular',
    measurements: {}
  })

  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign in to manage measurements</h3>
        <p className="text-gray-600 mb-4">Save your measurements for perfect fits every time</p>
        <Button className="bg-burgundy hover:bg-burgundy-700">
          Sign In
        </Button>
      </Card>
    )
  }

  const handleCreate = () => {
    const newProfile: MeasurementProfile = {
      id: `measurement_${Date.now()}`,
      name: formData.name || 'My Measurements',
      isDefault: profile.measurements.length === 0,
      measurements: formData.measurements || {},
      unit: formData.unit || 'inches',
      fitPreference: formData.fitPreference || 'regular',
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    addMeasurement(newProfile)
    setIsCreating(false)
    setFormData({ name: '', unit: 'inches', fitPreference: 'regular', measurements: {} })
  }

  const handleUpdate = () => {
    if (editingId) {
      updateMeasurement(editingId, {
        ...formData,
        updatedAt: new Date()
      })
      setEditingId(null)
      setFormData({ name: '', unit: 'inches', fitPreference: 'regular', measurements: {} })
    }
  }

  const handleEdit = (measurement: MeasurementProfile) => {
    setEditingId(measurement.id)
    setFormData(measurement)
  }

  const handleDuplicate = (measurement: MeasurementProfile) => {
    const duplicate: MeasurementProfile = {
      ...measurement,
      id: `measurement_${Date.now()}`,
      name: `${measurement.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addMeasurement(duplicate)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Measurement Profiles</h2>
          <p className="text-gray-600 mt-1">Save multiple profiles for different fits</p>
        </div>
        {!isCreating && !editingId && (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-burgundy hover:bg-burgundy-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isCreating ? 'Create New Profile' : 'Edit Profile'}
              </h3>
              
              {/* Profile Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Profile Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Business Suits, Casual Wear"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              {/* Unit Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Measurement Unit</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="inches"
                      checked={formData.unit === 'inches'}
                      onChange={(e) => setFormData({ ...formData, unit: 'inches' })}
                      className="mr-2"
                    />
                    Inches
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="cm"
                      checked={formData.unit === 'cm'}
                      onChange={(e) => setFormData({ ...formData, unit: 'cm' })}
                      className="mr-2"
                    />
                    Centimeters
                  </label>
                </div>
              </div>

              {/* Measurements Grid */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-4">Measurements</label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {MEASUREMENT_FIELDS.map(field => (
                    <div key={field.key}>
                      <label className="flex items-center gap-2 text-sm mb-1">
                        <span>{field.icon}</span>
                        <span>{field.label}</span>
                      </label>
                      <input
                        type="number"
                        value={formData.measurements?.[field.key as keyof typeof formData.measurements] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: {
                            ...formData.measurements,
                            [field.key]: parseFloat(e.target.value) || undefined
                          }
                        })}
                        placeholder="0"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                      />
                      <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fit Preference */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Fit Preference</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FIT_PREFERENCES.map(fit => (
                    <button
                      key={fit.value}
                      onClick={() => setFormData({ ...formData, fitPreference: fit.value as any })}
                      className={cn(
                        "p-3 rounded-lg border text-center transition-all",
                        formData.fitPreference === fit.value
                          ? "border-burgundy bg-burgundy/10 text-burgundy"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <div className="font-medium">{fit.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{fit.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special fitting notes..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  className="bg-burgundy hover:bg-burgundy-700"
                  disabled={!formData.name}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isCreating ? 'Create Profile' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingId(null)
                    setFormData({ name: '', unit: 'inches', fitPreference: 'regular', measurements: {} })
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Measurement Profiles List */}
      <div className="grid gap-4">
        {profile.measurements.map((measurement, index) => (
          <motion.div
            key={measurement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "p-6",
              measurement.isDefault && "ring-2 ring-burgundy"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{measurement.name}</h3>
                    {measurement.isDefault && (
                      <Badge className="bg-burgundy text-white">
                        <Star className="mr-1 h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {new Date(measurement.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {!measurement.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDefaultMeasurement(measurement.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDuplicate(measurement)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(measurement)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMeasurement(measurement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Measurement Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {Object.entries(measurement.measurements)
                  .filter(([_, value]) => value)
                  .slice(0, 4)
                  .map(([key, value]) => {
                    const field = MEASUREMENT_FIELDS.find(f => f.key === key)
                    return (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">{field?.icon}</div>
                        <div className="text-sm text-gray-600">{field?.label}</div>
                        <div className="font-semibold">
                          {value} {measurement.unit === 'inches' ? '"' : 'cm'}
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Fit Preference:</span>
                  <Badge variant="secondary">
                    {FIT_PREFERENCES.find(f => f.value === measurement.fitPreference)?.label}
                  </Badge>
                </div>
                {measurement.notes && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Info className="h-4 w-4" />
                    <span className="italic">{measurement.notes}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {profile.measurements.length === 0 && !isCreating && (
        <Card className="p-12 text-center">
          <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No measurement profiles yet</h3>
          <p className="text-gray-600 mb-6">
            Save your measurements to get personalized size recommendations
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-burgundy hover:bg-burgundy-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Profile
          </Button>
        </Card>
      )}
    </div>
  )
}