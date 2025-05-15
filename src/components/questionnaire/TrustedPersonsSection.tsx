
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

type TrustedPerson = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relation?: string;
  address?: string;
  city?: string;
  postal_code?: string;
};

const TrustedPersonsSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [newPerson, setNewPerson] = useState<Omit<TrustedPerson, 'id'>>({
    name: '',
    phone: '',
    email: '',
    relation: '',
    address: '',
    city: '',
    postal_code: '',
  });

  // Fetch trusted persons when component mounts
  useEffect(() => {
    fetchTrustedPersons();
  }, [user]);

  const fetchTrustedPersons = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trusted_persons')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      console.log("Trusted persons data:", data);
      setTrustedPersons(data || []);
    } catch (error: any) {
      console.error('Error fetching trusted persons:', error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les personnes de confiance.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPerson(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!newPerson.name) {
      toast({
        title: "Champ requis",
        description: "Le nom de la personne de confiance est requis.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const personToAdd = {
        ...newPerson,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('trusted_persons')
        .insert(personToAdd)
        .select();
      
      if (error) throw error;
      
      setTrustedPersons(prev => [...prev, data[0]]);
      setNewPerson({
        name: '',
        phone: '',
        email: '',
        relation: '',
        address: '',
        city: '',
        postal_code: '',
      });
      
      toast({
        title: "Personne ajoutée",
        description: "La personne de confiance a été ajoutée avec succès."
      });
    } catch (error: any) {
      console.error('Error adding trusted person:', error.message);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la personne de confiance.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePerson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trusted_persons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTrustedPersons(prev => prev.filter(person => person.id !== id));
      
      toast({
        title: "Personne supprimée",
        description: "La personne de confiance a été supprimée avec succès."
      });
    } catch (error: any) {
      console.error('Error removing trusted person:', error.message);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la personne de confiance.",
        variant: "destructive"
      });
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
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Mes personnes de confiance désignées</h2>
            
            {trustedPersons.length === 0 ? (
              <p className="text-gray-500 italic">Aucune personne de confiance n'a été désignée.</p>
            ) : (
              <ul className="space-y-4">
                {trustedPersons.map((person) => (
                  <li key={person.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{person.name}</h3>
                        {person.relation && <p className="text-sm text-gray-600">Relation: {person.relation}</p>}
                        {person.phone && <p className="text-sm">Tél: {person.phone}</p>}
                        {person.email && <p className="text-sm">{person.email}</p>}
                        {person.address && (
                          <p className="text-sm text-gray-600">
                            {person.address}
                            {person.city && person.postal_code && `, ${person.postal_code} ${person.city}`}
                            {!person.city && person.postal_code && `, ${person.postal_code}`}
                            {person.city && !person.postal_code && `, ${person.city}`}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemovePerson(person.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Ajouter une personne de confiance</h2>
            
            <form onSubmit={handleAddPerson} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom et prénom *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newPerson.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relation">Relation</Label>
                <Input 
                  id="relation" 
                  name="relation" 
                  value={newPerson.relation || ''} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Conjoint, Ami, Enfant..." 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={newPerson.phone || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={newPerson.email || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={newPerson.address || ''} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input 
                    id="postal_code" 
                    name="postal_code" 
                    value={newPerson.postal_code || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={newPerson.city || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-directiveplus-600 hover:bg-directiveplus-700" 
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Ajouter la personne'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustedPersonsSection;
