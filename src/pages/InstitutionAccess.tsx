
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";
import { InstitutionalSubscriptionSection } from "@/components/acces-institution/InstitutionalSubscriptionSection";
import { FeedbackSection } from "@/components/acces-institution/FeedbackSection";
import { SecurityInfoSection } from "@/components/acces-institution/SecurityInfoSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield } from "lucide-react";

export default function InstitutionAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès Institution
            </h1>
            <p className="text-lg text-gray-600">
              Consultation sécurisée des directives anticipées
            </p>
          </div>
          
          {/* Accès aux directives avec code */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">
                Accès aux Directives Anticipées
              </CardTitle>
              <p className="text-blue-700">
                Consultez les directives anticipées d'un patient avec son code d'accès
              </p>
            </CardHeader>
            <CardContent>
              <InstitutionAccessFormComplete />
            </CardContent>
          </Card>

          {/* Dossier Soins Palliatifs */}
          <Card className="bg-pink-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <Heart className="w-6 h-6" />
                Dossier Soins Palliatifs
              </CardTitle>
              <p className="text-pink-700">
                Accès au suivi de symptômes des patients en soins palliatifs
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Consultez en temps réel l'évolution des symptômes de vos patients grâce à leur code de partage personnel.
              </p>
              <div className="bg-pink-100 p-4 rounded-lg border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-pink-600" />
                  <span className="font-medium text-pink-800">Code de partage requis</span>
                </div>
                <p className="text-sm text-pink-700">
                  Demandez à votre patient son code personnel de partage des symptômes pour accéder à son suivi et ses directives anticipées.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Abonnement Institutionnel */}
          <InstitutionalSubscriptionSection />
          
          {/* Votre avis nous intéresse */}
          <FeedbackSection />
          
          {/* Sécurité */}
          <SecurityInfoSection />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
