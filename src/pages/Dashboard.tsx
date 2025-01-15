import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { DirectivesForm } from "@/components/DirectivesForm";
import { TrustedPersons } from "@/components/TrustedPersons";
import { PDFGenerator } from "@/components/PDFGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { useDialogState } from "@/hooks/useDialogState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { explanationOpen, setExplanationOpen } = useDialogState();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const shouldShowDialog = sessionStorage.getItem('showExplanationDialog') === 'true';
    if (shouldShowDialog) {
      setExplanationOpen(true);
      sessionStorage.removeItem('showExplanationDialog');
    }
  }, [setExplanationOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Tableau de bord
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">
                    {profile.first_name || '-'} {profile.last_name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de naissance</p>
                  <p className="font-medium">
                    {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">
                    {profile.address || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ville</p>
                  <p className="font-medium">
                    {profile.city || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code postal</p>
                  <p className="font-medium">
                    {profile.postal_code || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pays</p>
                  <p className="font-medium">
                    {profile.country || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">
                    {profile.phone_number || '-'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune information disponible</p>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="directives" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="directives">Directives anticipées</TabsTrigger>
            <TabsTrigger value="persons">Personnes de confiance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directives" className="mt-6">
            <DirectivesForm />
          </TabsContent>
          
          <TabsContent value="persons" className="mt-6">
            <TrustedPersons />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <PDFGenerator />
          </TabsContent>
        </Tabs>
      </main>

      <ExplanationDialog 
        open={explanationOpen}
        onOpenChange={setExplanationOpen}
        onContinue={() => setExplanationOpen(false)}
      />
    </div>
  );
};

export default Dashboard;