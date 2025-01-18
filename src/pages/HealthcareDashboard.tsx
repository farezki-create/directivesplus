import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
};

const HealthcareDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      console.log('Searching for patients with term:', searchTerm);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, birth_date')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      return data as Patient[];
    },
    enabled: searchTerm.length >= 2
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Espace Professionnel de Santé
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Rechercher un patient</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Rechercher par nom ou prénom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
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
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Voir le dossier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      {searchTerm.length >= 2 ? 'Aucun patient trouvé' : 'Entrez au moins 2 caractères pour rechercher'}
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