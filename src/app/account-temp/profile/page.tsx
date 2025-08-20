"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { LoadingState } from "@/components/ui/states/LoadingState";

export default function ProfilePage() {
  const { customer, isLoading, updateProfile } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: "",
  });

  if (isLoading || !customer) {
    return <LoadingState text="Loading profile..." />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      notifySuccess("Profile Updated", "Your profile has been saved successfully");
      setIsEditing(false);
    } catch (error) {
      notifyError("Update Failed", "Failed to update your profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gold hover:bg-gold/90 text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: customer.firstName,
                  lastName: customer.lastName,
                  email: customer.email,
                  phone: "",
                });
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gold hover:bg-gold/90 text-black font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
            <dd className="text-sm text-gray-900 font-mono">{customer.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Member Since</dt>
            <dd className="text-sm text-gray-900">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}