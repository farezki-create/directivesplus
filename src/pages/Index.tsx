
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, FileText, Hospital, Key } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Hero />

      {/* Section Accès Professionnel - Version compacte */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Accès Professionnel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solution d'accès sécurisé pour les professionnels de santé
            </p>
          </div>

          <div className="flex justify-center max-w-lg mx-auto">
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Hospital className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-blue-800">
                  Accès Institution
                </CardTitle>
                <CardDescription className="text-sm">
                  Validation avec identité patient complète
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-3 pt-0">
                <p className="text-xs text-gray-600">
                  Accès avec vérification : nom, prénom, date de naissance et code institution.
                </p>
                <Link to="/acces-institution">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Accéder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Information compacte */}
          <div className="mt-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-blue-800 text-xs">
                <strong>Pour les professionnels :</strong> Les codes d'accès sont fournis par les patients. 
                Vérification d'identité complète requise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
