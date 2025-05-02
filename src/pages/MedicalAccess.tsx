
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MedicalAccessForm } from "@/components/directives/MedicalAccessForm";
import { FileText, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FrenchFlag } from "@/components/ui/FrenchFlag";

export default function MedicalAccess() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-2 text-primary" />
            <h1 className="text-2xl font-bold">Accès professionnel</h1>
            <p className="text-muted-foreground">
              Portail d'accès sécurisé pour les professionnels de santé
            </p>
          </div>
          
          <div className="grid gap-6">
            {/* Directives Anticipées Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Accès aux directives anticipées
                </CardTitle>
                <CardDescription>
                  Entrez les informations du patient et l'identifiant du document
                </CardDescription>
              </CardHeader>
              
              <MedicalAccessForm />
            </Card>

            {/* Medical Data Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Accès aux données médicales
                </CardTitle>
                <CardDescription>
                  Accédez aux données médicales du patient avec l'identifiant du document
                </CardDescription>
              </CardHeader>
              
              <MedicalAccessForm type="medical" />
            </Card>
          </div>
          
          <div className="text-center text-sm text-muted-foreground flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">100% sécurisé</span>
              <FrenchFlag />
            </div>
            <p>
              Vos directives anticipées et documents de santé sont hébergés en France 
              dans le serveur Scalingo, certifiés HDS par les autorités de santé.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
