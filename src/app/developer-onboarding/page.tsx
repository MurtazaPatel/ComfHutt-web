import {
  HeroSection,
  RealitySection,
  MarketDataSection,
  StrategicShiftSection,
  HowItWorksSection,
  DeveloperBenefitsSection,
  WhyNowSection,
  TrustSection,
  CTASection,
} from '@/components/developer-onboarding';
import OnboardingNavbar from '@/components/developer-onboarding/OnboardingNavbar';
import Footer from '@/components/Footer';
import MotionWrapper from '@/components/MotionWrapper';
import './styles.css';


export default function DeveloperOnboardingPage() {
  return (
   

    <div className="bg-background text-foreground developer-onboarding-page relative min-h-screen">
          <OnboardingNavbar />
          <HeroSection />
          <main>
            <MotionWrapper>
              <RealitySection />
            </MotionWrapper>
            <MotionWrapper>
              <MarketDataSection />
            </MotionWrapper>
            <MotionWrapper>
              <StrategicShiftSection />
            </MotionWrapper>
            <MotionWrapper>
              <HowItWorksSection />
            </MotionWrapper>
            <MotionWrapper>
              <DeveloperBenefitsSection />
            </MotionWrapper>
            <MotionWrapper>
              <WhyNowSection />
            </MotionWrapper>
            <MotionWrapper>
              <TrustSection />
            </MotionWrapper>
            <MotionWrapper>
              <CTASection />
            </MotionWrapper>
          </main>
          <Footer />
        </div>
        
  );
}