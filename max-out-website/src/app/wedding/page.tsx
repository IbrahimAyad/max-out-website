"use client";

import { useState } from "react";
import { WeddingPortal } from "@/components/wedding/WeddingPortal";
import { GroupCoordination } from "@/components/wedding/GroupCoordination";
import { WeddingCollections } from "@/components/wedding/WeddingCollections";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VIDEO_IDS } from "@/lib/utils/constants";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

export default function WeddingPage() {
  const [activeTab, setActiveTab] = useState<"portal" | "collections" | "coordination">("portal");

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <VideoPlayer
            videoId="d7768d2c4ed0edd2fae1888a788a9a0f"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <div className="text-center px-4 max-w-5xl mx-auto">
            <div className="space-y-2 mb-8 animate-fade-up">
              <div className="h-px w-24 bg-gold mx-auto"></div>
              <p className="text-gold text-sm tracking-[0.3em] uppercase">Celebrate Your Love Story</p>
              <div className="h-px w-24 bg-gold mx-auto"></div>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 animate-fade-up leading-[0.9]" style={{ animationDelay: '0.2s' }}>
              Wedding
              <span className="block text-gold mt-2">Hub</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 font-light animate-fade-up max-w-4xl mx-auto leading-relaxed text-gray-100" style={{ animationDelay: '0.4s' }}>
              Complete wedding party management with coordinated styles, exclusive group discounts, and personalized service for your perfect day
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <Button size="lg" className="group bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-gold/20 transition-all duration-300 transform hover:scale-105">
                <Calendar className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Start Planning
              </Button>
              <Link href="/occasions/wedding-party">
                <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm text-white border-white/50 hover:bg-white hover:text-black px-10 py-6 text-lg shadow-2xl transition-all duration-300 transform hover:scale-105">
                  View Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase">Explore</span>
            <div className="w-px h-12 bg-white/50"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-gold mb-6">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Wedding Services</span>
              <div className="h-px w-12 bg-gold"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From group coordination to exclusive savings, we handle every detail of your wedding party wardrobe
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Users className="h-10 w-10 text-black" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">Group Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Coordinate sizes, styles, and fittings for your entire party with our streamlined system
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Tag className="h-10 w-10 text-black" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">Exclusive Discounts</h3>
              <p className="text-gray-600 leading-relaxed">
                Save up to 25% on groups of 5 or more groomsmen with our exclusive wedding party pricing
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Calendar className="h-10 w-10 text-black" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">Timeline Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay perfectly on schedule with automated reminders and milestone tracking
              </p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Sparkles className="h-10 w-10 text-black" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors">Style Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Perfectly coordinated looks with our expert styling and color matching service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="border-b border-gold/20 sticky top-16 bg-white/95 backdrop-blur-md z-20 shadow-sm">
        <div className="container-main">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("portal")}
              className={`py-4 px-2 border-b-2 transition-all duration-200 font-medium ${
                activeTab === "portal"
                  ? "border-gold text-gold shadow-sm"
                  : "border-transparent text-gray-600 hover:text-gold hover:border-gold/30"
              }`}
            >
              Wedding Portal
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`py-4 px-2 border-b-2 transition-all duration-200 font-medium ${
                activeTab === "collections"
                  ? "border-gold text-gold shadow-sm"
                  : "border-transparent text-gray-600 hover:text-gold hover:border-gold/30"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab("coordination")}
              className={`py-4 px-2 border-b-2 transition-all duration-200 font-medium ${
                activeTab === "coordination"
                  ? "border-gold text-gold shadow-sm"
                  : "border-transparent text-gray-600 hover:text-gold hover:border-gold/30"
              }`}
            >
              Group Coordination
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-main">
          {activeTab === "portal" && (
            <WeddingPortal
              wedding={{
                id: "mock-wedding",
                weddingDate: new Date("2024-06-15"),
                groomId: "mock-groom",
                partyMembers: [],
                status: "planning"
              }}
              currentUserId="mock-user"
              onUpdateWedding={() => {}}
              onSendMessage={() => {}}
            />
          )}
          {activeTab === "collections" && (
            <WeddingCollections
              themes={[]}
              onThemeSelect={() => {}}
              onAddToCart={() => {}}
            />
          )}
          {activeTab === "coordination" && (
            <GroupCoordination
              wedding={{
                id: "mock-wedding",
                weddingDate: new Date("2024-06-15"),
                groomId: "mock-groom",
                partyMembers: [],
                status: "planning"
              }}
              onSendInvitations={() => {}}
              onUpdateMeasurements={() => {}}
              onCreateGroupOrder={() => {}}
              onInitiatePaymentSplit={() => {}}
            />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
        
        <div className="container-main text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              Ready to Start
              <span className="block text-gold mt-2">Planning?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our wedding specialists are here to help create your perfect day, from the first fitting to the final dance
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-gold/20 transition-all duration-300 transform hover:scale-105">
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black px-10 py-6 text-lg backdrop-blur-sm transition-all duration-300">
                View Wedding Packages
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}