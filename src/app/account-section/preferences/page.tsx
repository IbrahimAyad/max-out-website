"use client";

import { useState } from "react";
import { useStylePreferences } from "@/lib/hooks/useAuth";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { LoadingState } from "@/components/ui/states/LoadingState";

const colorOptions = [
  { value: "black", label: "Black", hex: "#000000" },
  { value: "navy", label: "Navy", hex: "#1e3a8a" },
  { value: "gray", label: "Gray", hex: "#6b7280" },
  { value: "charcoal", label: "Charcoal", hex: "#374151" },
  { value: "brown", label: "Brown", hex: "#92400e" },
  { value: "burgundy", label: "Burgundy", hex: "#881337" },
];

const fitOptions = [
  { value: "slim", label: "Slim Fit", description: "Tailored close to the body" },
  { value: "classic", label: "Classic Fit", description: "Traditional comfortable fit" },
  { value: "modern", label: "Modern Fit", description: "Between slim and classic" },
];

const occasionOptions = [
  { value: "business", label: "Business" },
  { value: "wedding", label: "Wedding" },
  { value: "formal", label: "Formal Events" },
  { value: "casual", label: "Smart Casual" },
  { value: "interview", label: "Job Interview" },
  { value: "date", label: "Date Night" },
];

const stylePersonas = [
  { value: "classic", label: "Classic Gentleman", description: "Timeless, traditional styles" },
  { value: "modern", label: "Modern Professional", description: "Contemporary business attire" },
  { value: "fashion", label: "Fashion Forward", description: "Trendy and bold choices" },
  { value: "minimalist", label: "Minimalist", description: "Simple, clean aesthetics" },
];

export default function StylePreferencesPage() {
  const { stylePreferences, updateStylePreferences } = useStylePreferences();
  const { notifySuccess, notifyError } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    colors: stylePreferences?.colors || [],
    fit: stylePreferences?.fit || "classic",
    occasions: stylePreferences?.occasions || [],
    stylePersona: stylePreferences?.stylePersona || "",
  });

  const handleColorToggle = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.includes(color)
        ? formData.colors.filter((c) => c !== color)
        : [...formData.colors, color],
    });
  };

  const handleOccasionToggle = (occasion: string) => {
    setFormData({
      ...formData,
      occasions: formData.occasions.includes(occasion)
        ? formData.occasions.filter((o) => o !== occasion)
        : [...formData.occasions, occasion],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateStylePreferences(formData);
      notifySuccess("Preferences Saved", "Your style preferences have been updated");
    } catch (error) {
      notifyError("Update Failed", "Failed to save your preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Style Preferences</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Preferred Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorToggle(color.value)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border-2 transition-all
                    ${formData.colors.includes(color.value)
                      ? "border-gold bg-gold/10"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-medium">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Fit */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Fit</h3>
            <div className="space-y-3">
              {fitOptions.map((fit) => (
                <label
                  key={fit.value}
                  className={`
                    flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.fit === fit.value
                      ? "border-gold bg-gold/10"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="fit"
                    value={fit.value}
                    checked={formData.fit === fit.value}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value as any })}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{fit.label}</p>
                    <p className="text-sm text-gray-600">{fit.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shopping For</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {occasionOptions.map((occasion) => (
                <button
                  key={occasion.value}
                  type="button"
                  onClick={() => handleOccasionToggle(occasion.value)}
                  className={`
                    p-3 rounded-lg border-2 font-medium transition-all
                    ${formData.occasions.includes(occasion.value)
                      ? "border-gold bg-gold/10 text-black"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }
                  `}
                >
                  {occasion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style Persona */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Style Persona</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stylePersonas.map((persona) => (
                <label
                  key={persona.value}
                  className={`
                    flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.stylePersona === persona.value
                      ? "border-gold bg-gold/10"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="persona"
                    value={persona.value}
                    checked={formData.stylePersona === persona.value}
                    onChange={(e) => setFormData({ ...formData, stylePersona: e.target.value })}
                    className="sr-only"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{persona.label}</p>
                    <p className="text-sm text-gray-600">{persona.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gold hover:bg-gold/90 text-black font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Pro Tip:</strong> Your style preferences help us recommend products and send you
          personalized notifications about new arrivals that match your taste.
        </p>
      </div>
    </div>
  );
}