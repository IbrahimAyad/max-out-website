import { Product } from "@/lib/types";

export interface OccasionBundle {
  id: string;
  name: string;
  description: string;
  occasion: OccasionType;
  image: string;
  price: number; // Total bundle price
  discount: number; // Percentage discount when buying as bundle
  products: BundleProduct[];
  features: string[];
}

export interface BundleProduct {
  product: Product;
  category: "suit" | "shirt" | "tie" | "shoes" | "accessories";
  required: boolean;
  defaultSize?: string;
  alternatives?: Product[]; // Alternative products for customization
}

export type OccasionType = 
  | "wedding-guest"
  | "wedding-party" 
  | "black-tie"
  | "business"
  | "job-interview"
  | "cocktail"
  | "prom"
  | "graduation";

export const occasionDetails: Record<OccasionType, {
  title: string;
  description: string;
  icon: string;
  color: string;
}> = {
  "wedding-guest": {
    title: "Wedding Guest",
    description: "Look sharp without upstaging the groom",
    icon: "🎊",
    color: "bg-rose-50"
  },
  "wedding-party": {
    title: "Wedding Party",
    description: "Coordinated looks for groomsmen",
    icon: "🤵",
    color: "bg-purple-50"
  },
  "black-tie": {
    title: "Black Tie",
    description: "Formal elegance for galas and events",
    icon: "🎩",
    color: "bg-gray-50"
  },
  "business": {
    title: "Business Professional",
    description: "Power dressing for the boardroom",
    icon: "💼",
    color: "bg-blue-50"
  },
  "job-interview": {
    title: "Job Interview",
    description: "Make the perfect first impression",
    icon: "🎯",
    color: "bg-green-50"
  },
  "cocktail": {
    title: "Cocktail Attire",
    description: "Smart casual for evening events",
    icon: "🍸",
    color: "bg-amber-50"
  },
  "prom": {
    title: "Prom",
    description: "Stand out on your special night",
    icon: "🎉",
    color: "bg-pink-50"
  },
  "graduation": {
    title: "Graduation",
    description: "Celebrate your achievement in style",
    icon: "🎓",
    color: "bg-indigo-50"
  }
};