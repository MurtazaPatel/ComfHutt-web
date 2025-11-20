import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import { auth } from "@/auth";
import Solution from "@/components/Solution";
import Opportunity from "@/components/Opportunity";
import LiveAnalyzer from "@/components/LiveAnalyzer";
import Validator from "@/components/Validator";
import ProductPreview from "@/components/ProductPreview";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";
import Share from "@/components/Share";

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background Effects - Fixed to viewport */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="aurora-bg absolute inset-0 opacity-20" />
        <div className="animated-grid-bg absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <Navbar user={session?.user} />
      <Hero />
      <Problem />
      <Solution />
      <Validator />
      <Opportunity />
      <LiveAnalyzer />
      <ProductPreview />
      <Waitlist />
      <Share />
      <Footer />
    </main>
  );
}
