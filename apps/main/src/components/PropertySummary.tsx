"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/lib/mock-data";
import {
  ShieldCheck,
  MapPin,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Share2,
  CheckCircle2,
  TrendingUp,
  Building2,
  Scale,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PropertySummaryProps {
  property: Property;
}

export default function PropertySummary({ property }: PropertySummaryProps) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = React.useState(0);

  const photos = property.photos && property.photos.length ? property.photos : ["/placeholder.png"];
  const isSoldOut = property.tokens_sold >= property.tokens_total;
  const liquidityPercent = Math.min(100, (property.tokens_sold / property.tokens_total) * 100);

  const nextImage = useCallback(() => setCurrentImage((prev) => (prev + 1) % photos.length), [photos.length]);
  const prevImage = useCallback(() => setCurrentImage((prev) => (prev - 1 + photos.length) % photos.length), [photos.length]);

  // Keyboard navigation for slider (Left / Right arrows)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextImage, prevImage]);

  return (
    <div className="w-full bg-white min-h-screen pb-20">
      {/* Top Section: Image Slider & Header */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-100 group mt-0">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl text-gray-800 font-medium shadow-sm hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={photos[currentImage]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            alt={`${property.title} - image ${currentImage + 1}`}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50 || velocity.x < -500) {
                nextImage();
              } else if (swipe > 50 || velocity.x > 500) {
                prevImage();
              }
            }}
          />
        </AnimatePresence>

        {/* Navigation Arrows (Hidden on mobile to encourage swipe, visible on desktop) */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/40 rounded-full text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/40 rounded-full text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentImage(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 rounded-full transition-all shadow-sm ${i === currentImage ? "bg-white w-8" : "bg-white/50 w-2"}`}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        {/* Invest Now button: Desktop Only */}
        <div className="hidden md:flex justify-end mb-4 lg:mb-6">
          {isSoldOut ? (
            <button
              type="button"
              className="px-8 py-3 rounded-xl font-bold text-lg shadow-xl transition-transform transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              disabled
              aria-disabled="true"
              aria-label="Sold out"
            >
              Sold Out
            </button>
          ) : (
            <Link
              href={`/properties/${property.id}/summary`}
              className="px-8 py-3 rounded-xl font-bold text-lg shadow-xl transition-transform transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 inline-block"
              aria-label="Invest now"
            >
              Invest Now
            </Link>
          )}
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12">
          {/* Title & Location */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-md">
                  {property.possession_status}
                </span>
                {property.spv_backed && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> SPV Backed
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-500 font-medium">
                <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                {property.locality}, {property.city}
                {property.state ? `, ${property.state}` : ""}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                aria-label="Share property"
                onClick={() => {
                  // keep presentational; wire your share modal if available
                  navigator.clipboard?.writeText(window.location.href).catch(() => {});
                }}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Projected Yield</p>
              <p className="text-3xl font-bold text-emerald-600">{property.projected_yield_percent}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Min Investment</p>
              <p className="text-3xl font-bold text-gray-900">₹{(property.min_token_price_inr / 1000).toFixed(1)}k</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Asset Value</p>
              <p className="text-xl font-bold text-gray-900">₹{(property.price_inr / 10000000).toFixed(2)} Cr</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Area</p>
              <p className="text-xl font-bold text-gray-900">
                {property.area_sqm} <span className="text-sm font-normal text-gray-500">sqm</span>
              </p>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900">Funding Progress</span>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${isSoldOut ? "text-red-500" : "text-emerald-600"}`}>
                  {((property.tokens_sold / property.tokens_total) * 100).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1"> funded</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${liquidityPercent}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
              <span>{property.tokens_sold.toLocaleString()} tokens sold</span>
              <span>{(property.tokens_total - property.tokens_sold).toLocaleString()} tokens remaining</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About this Property</h3>
            <p className="text-gray-600 leading-relaxed">
              {property.short_description} This {property.type.toLowerCase()} asset offers a compelling opportunity for investors seeking stable rental yields and long-term capital appreciation. Located in the high-growth area of {property.locality}, it benefits from excellent connectivity and infrastructure.
            </p>
          </div>
        </div>

        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Credibility */}
          <div className="lg:col-span-2 space-y-8">
            {/* Detailed Credibility Score */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Credibility Score Breakdown</h2>
              </div>

              <div className="flex items-start gap-8 mb-8">
                <div
                  className={`
                   w-32 h-32 flex-shrink-0 rounded-full flex flex-col items-center justify-center border-8 
                   ${property.credibility_score >= 80 ? "border-emerald-100 text-emerald-700 bg-emerald-50" : property.credibility_score >= 60 ? "border-yellow-100 text-yellow-700 bg-yellow-50" : "border-red-100 text-red-700 bg-red-50"}
                 `}
                >
                  <span className="text-4xl font-bold">{property.credibility_score}</span>
                  <span className="text-xs font-semibold uppercase mt-1">out of 100</span>
                </div>

                <div className="flex-1 space-y-4 pt-2">
                  <p className="text-gray-600">
                    This score is calculated by our proprietary AI engine based on over 50 data points including legal clearance, developer history, and market trends.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Last updated: {property.last_rescored_at ? new Date(property.last_rescored_at).toLocaleDateString() : "N/A"}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Source: {property.source || "Internal"}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Legal Clarity</h4>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">High</span>
                    </div>
                    <p className="text-sm text-gray-600">Title search is clear with no pending litigations. Encumbrance certificate verified for the last 30 years.</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                  <Building2 className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Developer Track Record</h4>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">Verified</span>
                    </div>
                    <p className="text-sm text-gray-600">Developer has successfully delivered 15+ projects in this region. Zero default history.</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Market Demand</h4>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">Stable</span>
                    </div>
                    <p className="text-sm text-gray-600">Location is seeing 8% YoY appreciation. Vacancy rates in this micro-market are below 5%.</p>
                  </div>
                </div>

                {/* Locality Factor */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Locality</h4>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded">Excellent</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Locality includes accessibility, transit, nearby developments, schools, hospitals, safety rating, and growth indicators. These facilities directly contribute to attractiveness and future appreciation.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">*Other indirect parameters are also used for accurate evaluation of the score.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Documents & More */}
          <div className="space-y-6">
            {/* Documents Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-gray-900">Legal Documents</h3>
              </div>

              <div className="space-y-3">
                {["Title Search Report", "SPV Agreement", "Sale Deed Draft", "RERA Certification"].map((doc, idx) => (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      /* Wire actual download logic here */
                    }}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                    aria-label={`Download ${doc}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{doc}</span>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-emerald-800 mb-1">Investigation Report</h4>
                  <p className="text-xs text-emerald-600 mb-3">Full due diligence report available.</p>
                  <button
                    type="button"
                    onClick={() => {
                      /* Wire actual download */
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  >
                    Download Full Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end content container */}

    {/* Sticky Mobile Bottom Action Bar */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40 safe-area-pb">
      <div className="flex items-center gap-4">
        <div className="flex-1">
           <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Min Invest</p>
           <p className="text-lg font-bold text-gray-900">₹{(property.min_token_price_inr / 1000).toFixed(1)}k</p>
        </div>
        {isSoldOut ? (
          <button
            disabled
            className="flex-1 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl text-center cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : (
          <Link
            href={`/properties/${property.id}/summary`}
            className="flex-[2] py-3 bg-black text-white font-bold text-lg rounded-xl text-center shadow-lg active:scale-95 transition-transform"
          >
            Invest Now
          </Link>
        )}
      </div>
    </div>

  </div>
);
}