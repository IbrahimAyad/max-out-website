"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const previewOutfits = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    style: "Classic Business",
    occasion: "Office & Meetings",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80",
    style: "Black Tie",
    occasion: "Formal Events",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800&q=80",
    style: "Smart Casual",
    occasion: "Weekend & Social",
  },
];

export function StyleSwiperPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative">
      <div className="flex justify-center gap-4 mb-8">
        {previewOutfits.map((outfit, index) => (
          <button
            key={outfit.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "relative w-48 h-64 rounded-lg overflow-hidden transition-all",
              currentIndex === index
                ? "scale-105 shadow-xl"
                : "scale-95 opacity-50"
            )}
          >
            <Image
              src={outfit.image}
              alt={outfit.style}
              fill
              className="object-cover"
            />
            {currentIndex === index && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white">
                  <p className="font-semibold">{outfit.style}</p>
                  <p className="text-sm opacity-90">{outfit.occasion}</p>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="text-center">
        <Link href="/style-quiz">
          <Button size="lg" className="group">
            Start Stylin' Profilin'
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}