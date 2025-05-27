
import { useState, useEffect } from "react";
import IndexHeader from "@/components/sections/IndexHeader";
import HeroSection from "@/components/sections/HeroSection";
import DirectivesInfoSection from "@/components/sections/DirectivesInfoSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import InstitutionalAccessSection from "@/components/sections/InstitutionalAccessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";
import CommunitySection from "@/components/sections/CommunitySection";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <IndexHeader />
      <HeroSection />
      <DirectivesInfoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <InstitutionalAccessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default Index;
