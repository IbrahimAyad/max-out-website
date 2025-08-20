"use client";

import { useState } from "react";
import { useCustomerMeasurements } from "@/lib/hooks/useAuth";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { LoadingState } from "@/components/ui/states/LoadingState";
import { Info } from "lucide-react";

const measurementFields = [
  { key: "chest", label: "Chest", unit: "inches", description: "Around the fullest part" },
  { key: "waist", label: "Waist", unit: "inches", description: "Natural waistline" },
  { key: "hips", label: "Hips", unit: "inches", description: "Around the fullest part" },
  { key: "neck", label: "Neck", unit: "inches", description: "Around the base" },
  { key: "inseam", label: "Inseam", unit: "inches", description: "Crotch to ankle" },
  { key: "sleeve", label: "Sleeve", unit: "inches", description: "Shoulder to wrist" },
];

export default function MeasurementsPage() {
  const { measurements, hasMeasurements, updateMeasurements } = useCustomerMeasurements();
  const { notifySuccess, notifyError } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    chest: measurements?.chest || 0,
    waist: measurements?.waist || 0,
    hips: measurements?.hips || 0,
    neck: measurements?.neck || 0,
    inseam: measurements?.inseam || 0,
    sleeve: measurements?.sleeve || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateMeasurements(formData);
      notifySuccess("Measurements Saved", "Your measurements have been updated");
      setIsEditing(false);
    } catch (error) {
      notifyError("Update Failed", "Failed to save your measurements");
    } finally {
      setIsSaving(false);
    }
  };

  const getSizeRecommendation = () => {
    if (!hasMeasurements) return null;

    const chest = measurements?.chest || 0;
    if (chest >= 46) return "46R";
    if (chest >= 44) return "44R";
    if (chest >= 42) return "42R";
    if (chest >= 40) return "40R";
    if (chest >= 38) return "38R";
    return "36R";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Measurements</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gold hover:bg-gold/90 text-black font-medium py-2 px-4 rounded-md transition-colors"
            >
              {hasMeasurements ? "Edit Measurements" : "Add Measurements"}
            </button>
          )}
        </div>

        {!hasMeasurements && !isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  Save your measurements for personalized size recommendations and faster checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {measurementFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={!isEditing}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  <span className="text-sm text-gray-500">{field.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    chest: measurements?.chest || 0,
                    waist: measurements?.waist || 0,
                    hips: measurements?.hips || 0,
                    neck: measurements?.neck || 0,
                    inseam: measurements?.inseam || 0,
                    sleeve: measurements?.sleeve || 0,
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
                {isSaving ? "Saving..." : "Save Measurements"}
              </button>
            </div>
          )}
        </form>
      </div>

      {hasMeasurements && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Recommendations</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Based on your measurements:</p>
            <p className="text-2xl font-bold text-gray-900">
              Recommended Size: {getSizeRecommendation()}
            </p>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">This recommendation is based on your chest measurement.</p>
            <p>
              For the best fit, we recommend scheduling a virtual or in-store consultation
              with our style experts.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure</h3>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900">Chest</h4>
            <p>Measure around the fullest part of your chest, keeping the tape level.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Waist</h4>
            <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Inseam</h4>
            <p>Measure from the crotch to the bottom of your ankle.</p>
          </div>
          
          <p className="italic">
            For best results, have someone help you take these measurements.
          </p>
        </div>
      </div>
    </div>
  );
}