
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MedicalAccessForm } from "@/components/directives/MedicalAccessForm";
import { FileText, Shield } from "lucide-react";

export default function MedicalAccess() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-2 text-primary" />
            <h1 className="text-2xl font-bold">Accès professionnel</h1>
            <p className="text-muted-foreground">
              Portail d'accès aux directives anticipées pour les professionnels de santé
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Consulter des directives anticipées
              </CardTitle>
              <CardDescription>
                Entrez les informations du patient et le code d'accès fourni
              </CardDescription>
            </CardHeader>
            
            <MedicalAccessForm />
          </Card>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Conformément à la législation en vigueur, l'accès aux directives anticipées
              est strictement réservé aux professionnels de santé autorisés.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
