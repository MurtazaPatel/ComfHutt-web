"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X, ChevronDown, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { startListingRouter } from "@/utils/onboarding";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import Pagination from "@/components/Pagination";
import { Property, generateProperties } from "@/lib/mock-data";

// --- Types ---
interface Filters {
  location: string;
  minBudget: number | "";
  maxBudget: number | "";
  minYield: number | "";
  propertyType: string;
  minCredibility: number | "";
}

const allProperties = generateProperties(50);

const QUICK_REGIONS = [...new Set(allProperties.map(p => p.state))];
const YIELD_OPTIONS = [...new Set(allProperties.map(p => Math.floor(p.projected_yield_percent)))].sort((a, b) => a - b);
const CREDIBILITY_OPTIONS = [...new Set(allProperties.map(p => Math.floor(p.credibility_score / 10) * 10))].sort((a, b) => a - b);
const PROPERTY_TYPES = ["All", ...new Set(allProperties.map(p => p.type))];

// --- Helper Components ---

const FilterDropdown = ({ 
  label, 
  isActive, 
  children 
}: { 
  label: string; 
  isActive: boolean; 
  children: React.ReactNode 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
          isActive || isOpen
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
        }`}
      >
        {label} <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-3 animate-in fade-in zoom-in-95 duration-200">
            {children}
          </div>
        </>
      )}
    </div>
  );
};


export default function MarketplacePage() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 15;
  
  // Filter State
  const [filters, setFilters] = useState<Filters>({
    location: "",
    minBudget: "",
    maxBudget: "",
    minYield: "",
    propertyType: "All",
    minCredibility: "",
  });

  // Debounced Location
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.location]);

  // Filter Logic (Client-Side)
  const filteredProperties = useMemo(() => {
    return allProperties.filter((p) => {
      // Location (Title, City, Locality)
      if (debouncedLocation) {
        const query = debouncedLocation.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.locality.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Budget
      if (filters.minBudget && p.min_token_price_inr < filters.minBudget) return false;
      if (filters.maxBudget && p.min_token_price_inr > filters.maxBudget) return false;

      // Yield
      if (filters.minYield && p.projected_yield_percent < filters.minYield) return false;

      // Type
      if (filters.propertyType !== "All" && p.type !== filters.propertyType) return false;

      // Credibility
      if (filters.minCredibility && p.credibility_score < filters.minCredibility) return false;

      return true;
    });
  }, [debouncedLocation, filters.minBudget, filters.maxBudget, filters.minYield, filters.propertyType, filters.minCredibility]);

  // Fetch properties
  useEffect(() => {
    setLoading(true);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setProperties(filteredProperties.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));
    setLoading(false);
  }, [currentPage, filteredProperties]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minBudget: "",
      maxBudget: "",
      minYield: "",
      propertyType: "All",
      minCredibility: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "" && v !== "All");

  return (
    <div className="min-h-screen bg-[#F5F7F8] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 text-[10px] font-bold tracking-widest uppercase text-gray-400"
          >
            <span>SPV-backed</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>AI Credibility</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Legal Documents</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Own a piece. Earn real rents.
          </motion.h1>

          {/* Advanced Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2"
          >
            {/* Location Input (Main) */}
            <div className="flex-1 w-full md:w-auto relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Search location..."
                className="w-full py-3 pl-10 pr-4 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-emerald-100 transition-all outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-8 bg-gray-200" />

            {/* Filters Row */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar mask-gradient-right md:mask-none md:flex-wrap">
              
              {/* Budget Filter */}
              <FilterDropdown label="Budget" isActive={!!filters.minBudget || !!filters.maxBudget}>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Min Price</label>
                    <input 
                      type="number" 
                      placeholder="₹5,000"
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      value={filters.minBudget}
                      onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value ? Number(e.target.value) : "" }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Max Price</label>
                    <input 
                      type="number" 
                      placeholder="₹50,000"
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      value={filters.maxBudget}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value ? Number(e.target.value) : "" }))}
                    />
                  </div>
                </div>
              </FilterDropdown>

              {/* Yield Filter */}
              <FilterDropdown label="Min Yield" isActive={!!filters.minYield}>
                 <div className="space-y-2">
                    {YIELD_OPTIONS.map(val => (
                       <button
                         key={val}
                         onClick={() => setFilters(prev => ({ ...prev, minYield: val }))}
                         className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between items-center ${
                           filters.minYield === val ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'
                         }`}
                       >
                         {val}% +
                         {filters.minYield === val && <Check className="w-3 h-3" />}
                       </button>
                    ))}
                 </div>
              </FilterDropdown>

              {/* Type Filter */}
              <FilterDropdown label="Type" isActive={filters.propertyType !== "All"}>
                 <div className="space-y-1">
                    {PROPERTY_TYPES.map(type => (
                       <button
                         key={type}
                         onClick={() => setFilters(prev => ({ ...prev, propertyType: type as any }))}
                         className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between items-center ${
                           filters.propertyType === type ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'
                         }`}
                       >
                         {type}
                         {filters.propertyType === type && <Check className="w-3 h-3" />}
                       </button>
                    ))}
                 </div>
              </FilterDropdown>

               {/* Credibility Filter */}
               <FilterDropdown label="Credibility" isActive={!!filters.minCredibility}>
                 <div className="space-y-2">
                    {CREDIBILITY_OPTIONS.map(val => (
                       <button
                         key={val}
                         onClick={() => setFilters(prev => ({ ...prev, minCredibility: val }))}
                         className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex justify-between items-center ${
                           filters.minCredibility === val ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-600'
                         }`}
                       >
                         Score {val}+
                         {filters.minCredibility === val && <Check className="w-3 h-3" />}
                       </button>
                    ))}
                 </div>
              </FilterDropdown>

              {/* Clear Button */}
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}

            </div>
          </motion.div>
        </div>

        {/* Simplified Full-Width Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">New Listings</h2>
            <span className="text-sm text-gray-500">{filteredProperties.length} properties found</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              <AnimatePresence mode="popLayout">
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <div key={property.id} className="h-full">
                      <PropertyCard
                        property={property}
                        onView={setSelectedProperty}
                      />
                    </div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center text-gray-400"
                  >
                    <p>No properties match your filters.</p>
                    <button onClick={clearFilters} className="text-emerald-600 font-bold text-sm mt-2 hover:underline">Clear all filters</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!loading && (
             <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={handlePageChange}
             />
          )}
        </div>

        {/* Owner List CTA Section */}
        <div className="mt-32 max-w-3xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl shadow-gray-100 border border-gray-100">
           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
             Planning to list your property and get quick liquidity?
           </h2>
           <p className="text-gray-500 mb-8 max-w-lg mx-auto">
             Tokenize your real estate and reach verified investors instantly. No middlemen, just smart contracts.
           </p>
           <button
             onClick={() => startListingRouter(router, undefined, isAuthenticated)}
             className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-transform active:scale-95 shadow-lg"
           >
             Start Listing <ArrowRight className="w-4 h-4" />
           </button>
        </div>

      </main>

      <Footer />
      
      {/* Detail Modal */}
      <PropertyDetailModal 
        property={selectedProperty} 
        isOpen={!!selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
      />
    </div>
  );
}