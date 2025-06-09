
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDirectivesStore } from "@/store/directivesStore";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const TrustedPersonForm = () => {
  const { trustedPersons, addTrustedPerson, removeTrustedPerson } = useDirectivesStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    phone: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.relationship || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const newPerson = {
      id: Date.now().toString(),
      ...formData
    };

    addTrustedPerson(newPerson);
    setFormData({
      firstName: "",
      lastName: "",
      relationship: "",
      phone: "",
      email: ""
    });

    toast({
      title: "Personne de confiance ajoutée",
      description: "La personne a été ajoutée avec succès"
    });
  };

  const relationshipOptions = [
    { value: "conjoint", label: "Conjoint(e)" },
    { value: "enfant", label: "Enfant" },
    { value: "parent", label: "Parent" },
    { value: "fratrie", label: "Frère/Sœur" },
    { value: "ami", label: "Ami(e)" },
    { value: "autre", label: "Autre" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter une personne de confiance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="relationship">Relation *</Label>
              <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la relation" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter cette personne
            </Button>
          </form>
        </CardContent>
      </Card>

      {trustedPersons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Personnes de confiance ajoutées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trustedPersons.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{person.firstName} {person.lastName}</h4>
                    <p className="text-sm text-gray-600">{person.relationship}</p>
                    <p className="text-sm text-gray-600">{person.phone}</p>
                    {person.email && <p className="text-sm text-gray-600">{person.email}</p>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTrustedPerson(person.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrustedPersonForm;
