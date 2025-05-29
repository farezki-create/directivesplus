
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportHero from "@/components/support/SupportHero";
import VolunteerSection from "@/components/support/VolunteerSection";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Soutenir = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const type = searchParams.get('type');
    const provider = searchParams.get('provider');

    if (success) {
      const providerName = provider === 'paypal' ? 'PayPal' : 'Stripe';
      toast({
        title: "Merci pour votre don !",
        description: type === 'subscription' 
          ? `Votre don mensuel via ${providerName} a été configuré avec succès. Vous recevrez une confirmation par email.`
          : `Votre don via ${providerName} a été traité avec succès. Vous recevrez une confirmation par email.`,
      });
    } else if (canceled) {
      const providerName = provider === 'paypal' ? 'PayPal' : 'Stripe';
      toast({
        title: "Don annulé",
        description: `Votre don via ${providerName} a été annulé. N'hésitez pas à réessayer quand vous le souhaitez.`,
        variant: "destructive"
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SupportHero />
        
        {/* Section Questionnaire */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-directiveplus-200">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                      alt="DirectivesPlus" 
                      className="h-16 w-auto"
                    />
                  </div>
                  <CardTitle className="text-2xl text-directiveplus-700">
                    Donnez votre avis
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">
                    Votre opinion nous intéresse ! Aidez-nous à améliorer DirectivesPlus en répondant à notre questionnaire.
                  </p>
                  <Button 
                    asChild
                    className="bg-directiveplus-600 hover:bg-directiveplus-700"
                    size="lg"
                  >
                    <a 
                      href="https://framaforms.org/questionnaire-sur-lapplication-de-redaction-des-directives-anticipees-directivesplus-1746994695" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Répondre au questionnaire
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <VolunteerSection />
      </main>
      <Footer />
    </div>
  );
};

export default Soutenir;
