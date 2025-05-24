
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { SimpleAccessForm } from "@/components/institution-access/SimpleAccessForm";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";

export default function InstitutionAccessSimple() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-md mx-auto">
          <BackButton 
            className="mb-4" 
            label="Retour à l'accueil"
            onClick={() => window.location.href = '/'}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">
                Accès Professionnel Simplifié
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <SimpleAccessForm />
            </CardContent>
            
            <CardFooter className="text-center text-sm text-muted-foreground">
              <p>
                Solution simplifiée similaire aux systèmes d'imagerie médicale.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
