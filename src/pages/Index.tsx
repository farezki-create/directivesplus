
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
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Vérifier si l'utilisateur est admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr');

  const handleAdminAccess = () => {
    navigate('/admin');
  };

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
      
      {/* Bouton d'accès administrateur */}
      {isAdmin && (
        <div className="py-6 bg-gray-50 border-t">
          <div className="container mx-auto px-4 text-center">
            <Button
              onClick={handleAdminAccess}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Shield className="mr-2 h-4 w-4" />
              Accès Administrateur
            </Button>
          </div>
        </div>
      )}
      
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default Index;
