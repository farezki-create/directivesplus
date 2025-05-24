
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

      {/* Section Accès Professionnel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Accès Professionnel aux Directives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solutions d'accès sécurisé pour les professionnels de santé et les institutions médicales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Accès Institution Simplifié */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-800">
                  Accès Simplifié
                </CardTitle>
                <CardDescription>
                  Solution rapide avec code d'accès unique
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Interface simplifiée similaire aux systèmes d'imagerie médicale.
                  Saisissez uniquement le code d'accès fourni par le patient.
                </p>
                <Link to="/acces-institution-simple">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Accès Simplifié
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Accès Institution Standard */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Hospital className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-800">
                  Accès Standard
                </CardTitle>
                <CardDescription>
                  Validation complète avec identité patient
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Accès avec vérification d'identité complète : nom, prénom, 
                  date de naissance et code d'accès institution.
                </p>
                <Link to="/acces-institution">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Accès Standard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">
                Information pour les professionnels
              </h3>
              <p className="text-blue-800 text-sm">
                Les codes d'accès sont fournis directement par les patients. 
                L'accès simplifié est recommandé pour une utilisation rapide en contexte d'urgence.
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
