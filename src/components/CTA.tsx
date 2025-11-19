"use client";

import Image from "next/image";
import MotionWrapper from "./MotionWrapper";
import BackgroundMotion from "./BackgroundMotion";

export default function CTA() {
  return (
    <section id="cta" className="py-20 md:py-48 relative overflow-hidden">
      <BackgroundMotion variant="workflow" />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <MotionWrapper className="text-center max-w-3xl mx-auto">
          <span className="text-base md:text-lg font-medium text-blue-300">
            Live Preview
          </span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mt-3 md:mt-4 gradient-text">
            Invest in Seconds.
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mt-6 md:mt-8">
            Experience the future interface of real estate investing.
          </p>
        </MotionWrapper>

        <MotionWrapper
          scale={true}
          className="glass-card mt-12 md:mt-20 p-4 md:p-10 relative overflow-hidden group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              <div className="lg:w-3/5">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-800 relative group-hover:shadow-2xl transition-shadow duration-500">
                  <Image
                    src="https://placehold.co/800x450/1a1a1a/FFFFFF?text=Luxury+Mumbai+Condo"
                    alt="Mumbai Luxury High-Rise"
                    fill
                    unoptimized
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                  <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <span className="text-xs md:text-sm text-gray-400 block mb-1">
                      Total Value
                    </span>
                    <p className="text-lg md:text-xl font-semibold text-white">
                      ₹12 Cr
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <span className="text-xs md:text-sm text-gray-400 block mb-1">
                      Min. Investment
                    </span>
                    <p className="text-lg md:text-xl font-semibold text-white">
                      ₹8,500
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <span className="text-xs md:text-sm text-gray-400 block mb-1">
                      Est. Yield (APY)
                    </span>
                    <p className="text-lg md:text-xl font-semibold text-green-400">
                      9.5%
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <span className="text-xs md:text-sm text-gray-400 block mb-1">
                      Tokens Sold
                    </span>
                    <p className="text-lg md:text-xl font-semibold text-white">
                      42%
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/5 flex flex-col justify-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Lodha World One
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg mt-1">
                    Mumbai, Maharashtra
                  </p>

                  <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-base leading-relaxed">
                    A 2-bed, 3-bath luxury condo. Verified by ComfHutt AI Smart
                    Validator.
                  </p>

                  <div className="mt-6 md:mt-8 space-y-4">
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-300 ml-4 mb-2"
                      >
                        Amount (in INR)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          pattern="[0-9]*"
                          id="amount"
                          className="block w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-base md:text-xl pl-5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                          placeholder="10,000"
                        />
                        <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm font-medium">INR</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mt-2 ml-4 text-xs md:text-sm">
                        ≈ 1.17 Tokens
                      </p>
                    </div>

                    <button className="btn btn-primary w-full text-lg py-4 rounded-2xl font-semibold shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95">
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}