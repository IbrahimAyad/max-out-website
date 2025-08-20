"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

interface HomePageHeroProps {
  children: React.ReactNode;
}

export default function HomePageHero({ children }: HomePageHeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {children}
      
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-20 h-px bg-white mx-auto mb-8" />
          <p className="text-white/90 text-sm tracking-[0.3em] uppercase font-light">
            Detroit's Premier Menswear
          </p>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white mb-8 leading-none tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          EXCEPTIONAL
          <span className="block font-light opacity-95 text-4xl md:text-6xl lg:text-7xl mt-2">
            MENSWEAR
          </span>
        </motion.h1>

        <motion.p
          className="text-white/85 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Discover precision-crafted suits and accessories for the modern gentleman.
          <span className="block mt-2 text-lg text-white/75">
            Four decades of excellence in Detroit.
          </span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/collections">
            <button className="bg-white text-gray-900 px-12 py-5 text-lg font-light tracking-wide hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group shadow-xl">
              EXPLORE COLLECTION
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/services">
            <button className="border-2 border-white text-white px-12 py-5 text-lg font-light tracking-wide hover:bg-white hover:text-gray-900 transition-all duration-300">
              BOOK CONSULTATION
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="flex flex-col items-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
          <motion.div
            className="text-white/60 text-xs tracking-wider uppercase"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}