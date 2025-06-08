
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, FileText, Shield, ExternalLink } from "lucide-react";

export default function AccessInstitution() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès Professionnel
            </h1>
            <p className="text-lg text-gray-600">
              Interface sécurisée pour les professionnels de santé
            </p>
          </div>

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
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Consultez en temps réel l'évolution des symptômes de vos patients grâce à leur code de partage personnel.
              </p>
              
              <div className="bg-pink-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-pink-800">Suivi des symptômes</h4>
                    <p className="text-sm text-pink-700">Douleur, dyspnée, anxiété - Graphiques d'évolution</p>
                  </div>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                    Accéder
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Code de partage requis :</p>
                    <p className="text-sm text-gray-600">
                      Demandez à votre patient son code personnel de partage des symptômes pour accéder à son suivi et ses directives anticipées.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abonnement Institutionnel */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="w-6 h-6" />
                Abonnement Institutionnel
              </CardTitle>
              <p className="text-blue-700">
                Solution privilégiée pour les établissements de santé
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 font-medium">
                Accès privilégié sans code patient : Les institutions partenaires bénéficient d'un accès direct aux directives des patients selon les droits accordés par l'administration.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h4 className="font-medium text-green-800">Accès direct aux directives anticipées</h4>
                  </div>
                  <p className="text-sm text-green-700">Consultation sans code d'accès patient</p>
                </div>

                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h4 className="font-medium text-green-800">Tableau de bord institution</h4>
                  </div>
                  <p className="text-sm text-green-700">Vue d'ensemble de tous vos patients autorisés</p>
                </div>

                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h4 className="font-medium text-green-800">Suivi palliatif intégré</h4>
                  </div>
                  <p className="text-sm text-green-700">Accès aux données de symptômes en temps réel</p>
                </div>

                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <h4 className="font-medium text-green-800">Intégration dossier de soins</h4>
                  </div>
                  <p className="text-sm text-green-700">API sécurisée pour intégration directe dans votre logiciel</p>
                </div>
              </div>

              <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-purple-800">Intégration Dossier de Soins</h4>
                </div>
                <p className="text-purple-700 mb-3">
                  Intégrez DirectivesPlus directement dans votre système de dossiers de soins pour un accès transparent aux informations des patients.
                </p>
                <p className="text-sm text-purple-600">
                  <strong>API disponible :</strong> Documentation technique et support d'intégration fournis avec l'abonnement institutionnel.
                </p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Demande d'abonnement</h4>
                </div>
                <p className="text-blue-700 mb-3">Établissements de santé, EHPAD, cliniques</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Demander un accès
                </Button>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg border">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Important :</p>
                    <p className="text-sm text-gray-600">
                      Cette demande sera examinée par notre équipe. Un accès institutionnel permet de consulter les directives anticipées des patients et l'accès au suivi des symptômes selon les droits accordés par l'administration.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Votre avis nous intéresse */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Votre avis nous intéresse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                En tant que professionnel de santé, votre retour d'expérience est précieux pour améliorer notre plateforme.
              </p>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <ExternalLink className="w-4 h-4 mr-2" />
                Répondre au questionnaire
              </Button>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <div className="bg-gray-100 p-4 rounded-lg border">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="font-medium text-gray-800">Sécurité et confidentialité :</p>
                <p className="text-sm text-gray-600">
                  Cet accès est sécurisé et tracé. Seuls les professionnels de santé autorisés peuvent consulter les données avec le consentement du patient via son code d'accès personnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
