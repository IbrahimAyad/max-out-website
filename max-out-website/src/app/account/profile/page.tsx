'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  ChevronLeft,
  Shield,
  Trash2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  preferences: {
    newsletter: boolean
    sms_notifications: boolean
    size_reminders: boolean
  }
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    preferences: {
      newsletter: true,
      sms_notifications: false,
      size_reminders: true,
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/account/profile')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      // Extract name from user metadata if available, otherwise use profile data
      const userMeta = (user as any).user_metadata || {}
      setProfile(prev => ({
        ...prev,
        first_name: userMeta.first_name || (user as any).firstName || '',
        last_name: userMeta.last_name || (user as any).lastName || '',
        phone: userMeta.phone || (user as any).phone || '',
        date_of_birth: userMeta.date_of_birth || (user as any).dateOfBirth || '',
        preferences: userMeta.preferences || (user as any).preferences || prev.preferences,
      }))
      setEditedProfile(prev => ({
        ...prev,
        first_name: userMeta.first_name || '',
        last_name: userMeta.last_name || '',
        phone: userMeta.phone || '',
        date_of_birth: userMeta.date_of_birth || '',
        preferences: userMeta.preferences || prev.preferences,
      }))
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          phone: editedProfile.phone,
          date_of_birth: editedProfile.date_of_birth,
          preferences: editedProfile.preferences,
        }
      })

      if (error) throw error

      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      alert('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email!)
      if (error) throw error
      alert('Password reset link sent to your email')
    } catch (error) {
      alert('Failed to send reset email. Please try again.')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      // In a real app, you would call an API endpoint to delete the account
      alert('Account deletion requested. You will receive an email confirmation.')
    } catch (error) {
      alert('Failed to delete account')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
            <ChevronLeft className="h-4 w-4" />
            Back to Account
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-black hover:bg-black hover:text-white transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.first_name : profile.first_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, first_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={isEditing ? editedProfile.last_name : profile.last_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, last_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={isEditing ? editedProfile.date_of_birth : profile.date_of_birth}
                  onChange={(e) => setEditedProfile({ ...editedProfile, date_of_birth: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Communication Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.newsletter : profile.preferences.newsletter}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    preferences: { ...editedProfile.preferences, newsletter: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="mr-3"
                />
                <span>Email newsletter with exclusive offers and new arrivals</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.sms_notifications : profile.preferences.sms_notifications}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    preferences: { ...editedProfile.preferences, sms_notifications: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="mr-3"
                />
                <span>SMS notifications for order updates</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEditing ? editedProfile.preferences.size_reminders : profile.preferences.size_reminders}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    preferences: { ...editedProfile.preferences, size_reminders: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="mr-3"
                />
                <span>Size recommendations based on purchase history</span>
              </label>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Account Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Password</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Change your password or recover your account
                </p>
                <button
                  onClick={handlePasswordReset}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-black hover:bg-black hover:text-white transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}