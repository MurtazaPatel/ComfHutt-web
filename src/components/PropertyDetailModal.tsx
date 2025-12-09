"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, FileText, Download, Building2, MapPin, AlertCircle, ChevronLeft, ChevronRight, Share2, ArrowRight } from "lucide-react";
import { Property } from "@/lib/mock-data";
import Link from "next/link";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [currentImage, setCurrentImage] = React.useState(0);

  if (!property) return null;

  const isSoldOut = property.tokens_sold >= property.tokens_total;
  const liquidityPercent = Math.min(100, (property.tokens_sold / property.tokens_total) * 100);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % property.photos.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + property.photos.length) % property.photos.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
             
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl max-h-[90vh] bg-white shadow-2xl rounded-3xl overflow-hidden relative flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-30 p-2.5 bg-white/80 hover:bg-white rounded-full transition-colors backdrop-blur-md shadow-sm"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
                  
                  {/* Left Column: Media (50% width) */}
                  <div className="w-full lg:w-1/2 bg-gray-100 relative group flex flex-col h-[300px] sm:h-[400px] lg:h-auto min-h-0 flex-shrink-0">
                    {/* Main Image */}
                    <div className="relative w-full h-full overflow-hidden">
                      <motion.img
                        key={currentImage}
                        src={property.photos[currentImage]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Navigation Arrows */}
                      {property.photos.length > 1 && (
                        <>
                          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white transition-colors">
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                         <div className="flex gap-2">
                           {property.photos.map((_, i) => (
                             <button
                               key={i}
                               onClick={() => setCurrentImage(i)}
                               className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50'}`}
                             />
                           ))}
                         </div>
                         <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white">
                           <Share2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details & Action (50% width) */}
                  <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col h-auto lg:h-full bg-white lg:overflow-y-auto">
                    
                    {/* Scrollable container for mobile, but on desktop we want it to fit if possible, or scroll the whole modal content if needed.
                        The requirement says "right column must remain fully visible and non-scrollable".
                        This implies the modal height should grow to fit content.
                        However, if content exceeds viewport, something must scroll.
                        "Modal must automatically size its height so all details fit without introducing inner scrollbars."
                        So we let the flex container grow.
                    */}
                    
                    <div className="flex-1 flex flex-col justify-center">

                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                           {property.possession_status}
                         </span>
                         {property.spv_backed && (
                           <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                             <ShieldCheck className="w-3 h-3 text-emerald-600" /> SPV Backed
                           </span>
                         )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{property.title}</h2>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.locality}, {property.city}
                      </div>
                    </div>

                    {/* Financials */}
                    <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Projected Yield</p>
                        <p className="text-2xl font-bold text-emerald-600">{property.projected_yield_percent}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Min Investment</p>
                        <p className="text-2xl font-bold text-gray-900">₹{property.min_token_price_inr.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2 pt-3 border-t border-gray-200">
                         <div className="flex justify-between items-end mb-2">
                           <div>
                             <p className="text-xs text-gray-500">Asset Value</p>
                             <p className="font-semibold text-gray-900">₹{property.price_inr.toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-xs text-gray-500">Tokens Left</p>
                             <p className={`font-semibold ${isSoldOut ? 'text-red-500' : 'text-emerald-600'}`}>
                               {(property.tokens_total - property.tokens_sold).toLocaleString()}
                             </p>
                           </div>
                         </div>
                         <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-emerald-500 rounded-full" 
                             style={{ width: `${liquidityPercent}%` }} 
                           />
                         </div>
                      </div>
                    </div>

                    {/* Credibility Section */}
                    <div className="mb-8">
                       <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                         Credibility Score
                         <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
                       </h3>
                       <div className="flex items-center gap-4">
                         <div className={`
                           w-16 h-16 rounded-full flex items-center justify-center border-4 text-xl font-bold
                           ${property.credibility_score >= 80 ? 'border-emerald-100 text-emerald-700 bg-emerald-50' :
                             property.credibility_score >= 60 ? 'border-yellow-100 text-yellow-700 bg-yellow-50' : 'border-red-100 text-red-700 bg-red-50'}
                         `}>
                           {property.credibility_score}
                         </div>
                         <div className="flex-1">
                            <div className="text-xs text-gray-500 space-y-1 mb-2">
                                <div className="flex justify-between">
                                    <span>Legal Clarity</span>
                                    <span className="font-medium text-gray-900">High</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Developer Track Record</span>
                                    <span className="font-medium text-gray-900">Verified</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Market Demand</span>
                                    <span className="font-medium text-gray-900">Stable</span>
                                </div>
                            </div>
                            <Link
                                href={`/properties/${property.id}/summary`}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group/link"
                            >
                                Learn more about score <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                         </div>
                       </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-auto">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Legal Documents</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['Title Search Report', 'SPV Agreement'].map((doc) => (
                          <div key={doc} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/doc">
                            <FileText className="w-4 h-4 text-gray-400 group-hover/doc:text-gray-600" />
                            <span className="text-xs font-medium text-gray-600 flex-grow truncate">{doc}</span>
                            <Download className="w-3 h-3 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      {isSoldOut ? (
                        <button
                          className="w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] bg-gray-100 text-gray-400 cursor-not-allowed"
                          disabled
                        >
                          Sold Out
                        </button>
                      ) : (
                        <Link
                          href={`/properties/${property.id}/summary`}
                          className="block w-full text-center py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] bg-black text-white hover:bg-gray-800 shadow-xl shadow-gray-200"
                        >
                          Invest Now
                        </Link>
                      )}
                      <p className="text-[10px] text-center text-gray-400 mt-2">
                        {isSoldOut ? 'Join waitlist for resale tokens.' : 'Verification required. No hidden fees.'}
                      </p>
                    </div>

                  </div>
                  </div>
                </div>
              </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}