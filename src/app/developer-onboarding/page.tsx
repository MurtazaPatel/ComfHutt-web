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
import MotionWrapper from '@/components/MotionWrapper';
import './styles.css';

export default function DeveloperOnboardingPage() {
  return (
    <div className="bg-background text-foreground developer-onboarding-page">
      <HeroSection />
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
    </div>
  );
}