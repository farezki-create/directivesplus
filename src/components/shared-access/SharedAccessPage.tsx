
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";

interface Directive {
  id: string;
  user_id: string;
  titre: string;
  contenu: string;
  created_at: string;
}

export function SharedAccessPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [code, setCode] = useState("");
  const [docs, setDocs] = useState<Directive[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc("get_directives_by_shared_code", {
        input_nom: nom.trim(),
        input_prenom: prenom.trim(),
        input_date_naissance: dateNaissance,
        input_shared_code: code.trim()
      });
      
      if (error) {
        console.error("Error fetching directives:", error);
        setError("Erreur lors de la vérification du code d'accès. Veuillez réessayer.");
        setDocs([]);
      } else if (!data || data.length === 0) {
        setError("Aucune directive trouvée. Vérifiez vos informations et le code d'accès.");
        setDocs([]);
      } else {
        setDocs(data as Directive[]);
      }
    } catch (err) {
      console.error("Exception:", err);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Accès à vos directives partagées</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Saisissez vos informations</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input 
                  id="nom" 
                  placeholder="Nom de famille" 
                  value={nom} 
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input 
                  id="prenom" 
                  placeholder="Prénom" 
                  value={prenom} 
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input 
                  id="dateNaissance" 
                  type="date" 
                  value={dateNaissance} 
                  onChange={(e) => setDateNaissance(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Code d'accès</Label>
                <Input 
                  id="code" 
                  placeholder="Code d'accès" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Vérification..." : "Voir mes directives"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div>
          {docs.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Directives disponibles</h2>
              {docs.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-directiveplus-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold">{doc.titre}</h3>
                        <p className="text-sm text-gray-700 mt-2">{doc.contenu}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Créé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-center text-gray-500">
                  Entrez vos informations personnelles et le code d'accès pour consulter vos directives partagées.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  };
