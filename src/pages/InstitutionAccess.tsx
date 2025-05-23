
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { InstitutionAccessForm } from "@/components/institution-access/InstitutionAccessForm";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";

export default function InstitutionAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-md mx-auto">
          <BackButton 
            className="mb-4" 
            label="Retour à l'authentification"
            onClick={() => window.location.href = '/auth'}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">
                Accès Professionnel de Santé
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <InstitutionAccessForm />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
              <p>
                Les accès à ces documents sont journalisés pour des raisons de sécurité et de traçabilité.
              </p>
              <p>
                En cas de problème d'accès, veuillez contacter le patient ou le service d'assistance.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
