
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportHero from "@/components/support/SupportHero";
import VolunteerSection from "@/components/support/VolunteerSection";
import FinancialSection from "@/components/support/FinancialSection";
import { toast } from "@/hooks/use-toast";

const Soutenir = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const type = searchParams.get('type');

    if (success) {
      toast({
        title: "Merci pour votre don !",
        description: type === 'subscription' 
          ? "Votre don mensuel a été configuré avec succès. Vous recevrez une confirmation par email."
          : "Votre don a été traité avec succès. Vous recevrez une confirmation par email.",
      });
    } else if (canceled) {
      toast({
        title: "Don annulé",
        description: "Votre don a été annulé. N'hésitez pas à réessayer quand vous le souhaitez.",
        variant: "destructive"
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SupportHero />
        <VolunteerSection />
        <FinancialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Soutenir;
