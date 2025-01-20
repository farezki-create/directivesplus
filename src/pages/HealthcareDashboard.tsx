import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  unique_identifier: string;
};

const HealthcareDashboard = () => {
  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    uniqueIdentifier: "",
    rppsNumber: "",
  });
  const { toast } = useToast();

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', searchParams],
    queryFn: async () => {
      console.log('Searching for patients with params:', searchParams);
      
      // Validate that all required fields are filled
      if (!searchParams.firstName || !searchParams.lastName || 
          !searchParams.birthDate || !searchParams.uniqueIdentifier || 
          !searchParams.rppsNumber) {
        return [];
      }

      const { data: healthcareProfessional, error: rppsError } = await supabase
        .from('healthcare_professionals')
        .select('*')
        .eq('rpps_number', searchParams.rppsNumber)
        .single();

      if (rppsError || !healthcareProfessional) {
        console.error('Invalid RPPS number:', rppsError);
        toast({
          title: "Erreur de validation",
          description: "Numéro RPPS invalide",
          variant: "destructive",
        });
        return [];
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, birth_date, unique_identifier')
        .eq('first_name', searchParams.firstName)
        .eq('last_name', searchParams.lastName)
        .eq('birth_date', searchParams.birthDate)
        .eq('unique_identifier', searchParams.uniqueIdentifier);

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      return data as Patient[];
    },
    enabled: Object.values(searchParams).every(value => value.length > 0)
  });

  const handleSearch = () => {
    if (!Object.values(searchParams).every(value => value.length > 0)) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs pour effectuer la recherche",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Espace Professionnel de Santé
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Rechercher un patient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="Prénom du patient"
                  value={searchParams.firstName}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Nom du patient"
                  value={searchParams.lastName}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="Date de naissance"
                  value={searchParams.birthDate}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Code d'identification unique"
                  value={searchParams.uniqueIdentifier}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, uniqueIdentifier: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Votre numéro RPPS"
                  value={searchParams.rppsNumber}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, rppsNumber: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Code d'identification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : patients && patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.last_name}</TableCell>
                      <TableCell>{patient.first_name}</TableCell>
                      <TableCell>
                        {patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('fr-FR') : '-'}
                      </TableCell>
                      <TableCell>{patient.unique_identifier}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Voir le dossier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {Object.values(searchParams).every(value => value.length > 0) 
                        ? 'Aucun patient trouvé' 
                        : 'Veuillez remplir tous les champs pour rechercher un patient'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthcareDashboard;