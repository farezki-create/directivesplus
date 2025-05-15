
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash, Save } from "lucide-react";

type TrustedPerson = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  relation?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
};

const TrustedPersonsManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch trusted persons on component mount
  useEffect(() => {
    fetchTrustedPersons();
  }, [user?.id]);

  const fetchTrustedPersons = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("trusted_persons")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTrustedPersons(data || []);
      console.log("Trusted persons loaded:", data);
    } catch (error: any) {
      console.error("Error fetching trusted persons:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos personnes de confiance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = () => {
    const newPerson: Omit<TrustedPerson, "id"> = {
      name: "",
      phone: "",
      email: "",
      relation: "",
      address: "",
      city: "",
      postal_code: "",
    };
    
    // Add temporary ID for UI purposes
    setTrustedPersons([...trustedPersons, { ...newPerson, id: `temp-${Date.now()}` }]);
  };

  const handleChange = (index: number, field: keyof TrustedPerson, value: string) => {
    const updatedPersons = [...trustedPersons];
    updatedPersons[index] = {
      ...updatedPersons[index],
      [field]: value,
    };
    setTrustedPersons(updatedPersons);
  };

  const handleRemove = (index: number) => {
    const updatedPersons = [...trustedPersons];
    updatedPersons.splice(index, 1);
    setTrustedPersons(updatedPersons);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Filter out invalid entries (must have at least a name)
      const validPersons = trustedPersons.filter(person => person.name.trim() !== "");
      
      if (validPersons.length === 0) {
        // If no valid persons, just refresh the list from database
        await fetchTrustedPersons();
        return;
      }

      // First delete all existing persons for this user
      const { error: deleteError } = await supabase
        .from("trusted_persons")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Then insert all current persons
      const personsWithUserId = validPersons.map(person => ({
        name: person.name,
        phone: person.phone || null,
        email: person.email || null,
        relation: person.relation || null,
        address: person.address || null,
        city: person.city || null,
        postal_code: person.postal_code || null,
        user_id: user.id,
      }));

      const { error: insertError } = await supabase
        .from("trusted_persons")
        .insert(personsWithUserId);

      if (insertError) throw insertError;

      toast({
        title: "Sauvegarde réussie",
        description: "Vos personnes de confiance ont été enregistrées.",
      });

      // Refresh the list to get the server-generated IDs
      await fetchTrustedPersons();
    } catch (error: any) {
      console.error("Error saving trusted persons:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos personnes de confiance.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la rédaction
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        Personne de Confiance
      </h1>

      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          La personne de confiance est une personne que vous désignez pour vous accompagner dans vos démarches médicales et qui sera consultée en priorité si vous n'êtes plus en mesure d'exprimer votre volonté.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {trustedPersons.map((person, index) => (
              <Card key={person.id || index}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {index === 0 ? "Personne de confiance principale" : `Personne de confiance ${index + 1}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Nom complet *</Label>
                        <Input
                          id={`name-${index}`}
                          value={person.name}
                          onChange={(e) => handleChange(index, "name", e.target.value)}
                          placeholder="Nom et prénom"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`relation-${index}`}>Relation</Label>
                        <Input
                          id={`relation-${index}`}
                          value={person.relation || ""}
                          onChange={(e) => handleChange(index, "relation", e.target.value)}
                          placeholder="Ex: Conjoint, Enfant, Ami"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${index}`}>Téléphone</Label>
                        <Input
                          id={`phone-${index}`}
                          value={person.phone || ""}
                          onChange={(e) => handleChange(index, "phone", e.target.value)}
                          placeholder="Numéro de téléphone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>Email</Label>
                        <Input
                          id={`email-${index}`}
                          value={person.email || ""}
                          onChange={(e) => handleChange(index, "email", e.target.value)}
                          placeholder="Adresse email"
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`address-${index}`}>Adresse</Label>
                      <Input
                        id={`address-${index}`}
                        value={person.address || ""}
                        onChange={(e) => handleChange(index, "address", e.target.value)}
                        placeholder="Adresse"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`postal_code-${index}`}>Code postal</Label>
                        <Input
                          id={`postal_code-${index}`}
                          value={person.postal_code || ""}
                          onChange={(e) => handleChange(index, "postal_code", e.target.value)}
                          placeholder="Code postal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`city-${index}`}>Ville</Label>
                        <Input
                          id={`city-${index}`}
                          value={person.city || ""}
                          onChange={(e) => handleChange(index, "city", e.target.value)}
                          placeholder="Ville"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center">
            <Button
              onClick={handleAddPerson}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter une personne de confiance
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-directiveplus-600 hover:bg-directiveplus-700"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Enregistrer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrustedPersonsManager;
