
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, FileText, Hospital, Key, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Hero />

      {/* Section Accès Professionnel - Version complète */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Accès Professionnel
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Interface sécurisée pour les professionnels de santé permettant d'accéder 
              aux directives anticipées des patients avec vérification d'identité complète.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Hospital className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">
                  Accès Institution
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Consultation sécurisée des directives anticipées
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <InstitutionAccessFormComplete />
              </CardContent>
            </Card>

            {/* Informations de sécurité */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold text-green-800">Sécurité maximale</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Vérification d'identité complète</li>
                    <li>• Code d'accès temporaire</li>
                    <li>• Traçabilité totale des accès</li>
                    <li>• Conformité RGPD</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Comment ça marche</h3>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Le patient génère un code d'accès</li>
                    <li>• Saisie des informations du patient</li>
                    <li>• Vérification automatique</li>
                    <li>• Accès immédiat aux directives</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Note légale */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Note importante</h4>
              <p className="text-sm text-gray-600">
                Cette interface est exclusivement réservée aux professionnels de santé autorisés. 
                L'accès aux directives anticipées est encadré par la loi et fait l'objet d'une 
                traçabilité complète. Toute utilisation non conforme est passible de sanctions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
