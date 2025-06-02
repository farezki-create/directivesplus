
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Building2, Users, Plus, Trash2, CheckCircle, XCircle, Settings } from "lucide-react";

interface Institution {
  id: string;
  nom: string;
  email: string;
  structure: string;
  telephone: string;
  est_valide: boolean;
  date_validation: string | null;
  created_at: string;
  structure_autorisee: string | null;
}

interface Structure {
  id: string;
  nom: string;
  type_structure: string;
  adresse: string;
  ville: string;
  code_postal: string;
  telephone: string;
  email: string;
}

interface StructureAccess {
  id: string;
  institution_id: string;
  structure_id: string;
  date_autorisation: string;
  notes: string;
  structure: Structure;
}

const InstitutionManagement: React.FC = () => {
  const { isAdmin } = useSecureAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [structureAccesses, setStructureAccesses] = useState<StructureAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedStructure, setSelectedStructure] = useState<string>('');
  const [accessNotes, setAccessNotes] = useState<string>('');

  // États pour créer une nouvelle structure
  const [newStructure, setNewStructure] = useState({
    nom: '',
    type_structure: '',
    adresse: '',
    ville: '',
    code_postal: '',
    telephone: '',
    email: ''
  });
  const [showNewStructureForm, setShowNewStructureForm] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    await Promise.all([
      loadInstitutions(),
      loadStructures(),
      loadStructureAccesses()
    ]);
    setLoading(false);
  };

  const loadInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('abonnes_institutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstitutions(data || []);
    } catch (error) {
      console.error('Error loading institutions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les institutions",
        variant: "destructive"
      });
    }
  };

  const loadStructures = async () => {
    try {
      const { data, error } = await supabase
        .from('structures_soins')
        .select('*')
        .order('nom');

      if (error) throw error;
      setStructures(data || []);
    } catch (error) {
      console.error('Error loading structures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les structures",
        variant: "destructive"
      });
    }
  };

  const loadStructureAccesses = async () => {
    try {
      const { data, error } = await supabase
        .from('institution_structure_access')
        .select(`
          *,
          structure:structure_id (*)
        `)
        .order('date_autorisation', { ascending: false });

      if (error) throw error;
      setStructureAccesses(data || []);
    } catch (error) {
      console.error('Error loading structure accesses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les accès structures",
        variant: "destructive"
      });
    }
  };

  const validateInstitution = async (institutionId: string) => {
    try {
      const { error } = await supabase
        .from('abonnes_institutions')
        .update({
          est_valide: true,
          date_validation: new Date().toISOString()
        })
        .eq('id', institutionId);

      if (error) throw error;
      
      await loadInstitutions();
      toast({
        title: "Succès",
        description: "Institution validée avec succès"
      });
    } catch (error) {
      console.error('Error validating institution:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider l'institution",
        variant: "destructive"
      });
    }
  };

  const revokeInstitution = async (institutionId: string) => {
    try {
      const { error } = await supabase
        .from('abonnes_institutions')
        .update({
          est_valide: false,
          date_validation: null
        })
        .eq('id', institutionId);

      if (error) throw error;
      
      await loadInstitutions();
      toast({
        title: "Succès",
        description: "Institution révoquée"
      });
    } catch (error) {
      console.error('Error revoking institution:', error);
      toast({
        title: "Erreur",
        description: "Impossible de révoquer l'institution",
        variant: "destructive"
      });
    }
  };

  const createStructure = async () => {
    try {
      if (!newStructure.nom || !newStructure.type_structure) {
        toast({
          title: "Erreur",
          description: "Nom et type de structure sont requis",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('structures_soins')
        .insert(newStructure);

      if (error) throw error;

      setNewStructure({
        nom: '',
        type_structure: '',
        adresse: '',
        ville: '',
        code_postal: '',
        telephone: '',
        email: ''
      });
      setShowNewStructureForm(false);
      await loadStructures();
      
      toast({
        title: "Succès",
        description: "Structure créée avec succès"
      });
    } catch (error) {
      console.error('Error creating structure:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la structure",
        variant: "destructive"
      });
    }
  };

  const grantStructureAccess = async () => {
    try {
      if (!selectedInstitution || !selectedStructure) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une institution et une structure",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('institution_structure_access')
        .insert({
          institution_id: selectedInstitution,
          structure_id: selectedStructure,
          notes: accessNotes
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Erreur",
            description: "Cette institution a déjà accès à cette structure",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      setSelectedInstitution('');
      setSelectedStructure('');
      setAccessNotes('');
      await loadStructureAccesses();
      
      toast({
        title: "Succès",
        description: "Accès accordé avec succès"
      });
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accorder l'accès",
        variant: "destructive"
      });
    }
  };

  const revokeStructureAccess = async (accessId: string) => {
    try {
      const { error } = await supabase
        .from('institution_structure_access')
        .delete()
        .eq('id', accessId);

      if (error) throw error;

      await loadStructureAccesses();
      toast({
        title: "Succès",
        description: "Accès révoqué avec succès"
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: "Erreur",
        description: "Impossible de révoquer l'accès",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gestion des Structures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Gestion des Structures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span>Structures disponibles ({structures.length})</span>
            <Button 
              onClick={() => setShowNewStructureForm(!showNewStructureForm)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Structure
            </Button>
          </div>

          {showNewStructureForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">Créer une nouvelle structure</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom de la structure</Label>
                  <Input
                    id="nom"
                    value={newStructure.nom}
                    onChange={(e) => setNewStructure({...newStructure, nom: e.target.value})}
                    placeholder="Ex: EHPAD Les Tilleuls"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type de structure</Label>
                  <Select value={newStructure.type_structure} onValueChange={(value) => setNewStructure({...newStructure, type_structure: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EHPAD">EHPAD</SelectItem>
                      <SelectItem value="CHU">CHU</SelectItem>
                      <SelectItem value="IDEL">IDEL</SelectItem>
                      <SelectItem value="SSIAD">SSIAD</SelectItem>
                      <SelectItem value="HAD">HAD</SelectItem>
                      <SelectItem value="Clinique">Clinique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={newStructure.ville}
                    onChange={(e) => setNewStructure({...newStructure, ville: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStructure.email}
                    onChange={(e) => setNewStructure({...newStructure, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={createStructure}>Créer</Button>
                <Button variant="outline" onClick={() => setShowNewStructureForm(false)}>Annuler</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {structures.map(structure => (
              <div key={structure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{structure.nom}</p>
                  <p className="text-sm text-gray-600">{structure.type_structure} - {structure.ville}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attribution des Accès */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Attribution des Accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Institution</Label>
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.filter(i => i.est_valide).map(institution => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Structure</Label>
                <Select value={selectedStructure} onValueChange={setSelectedStructure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {structures.map(structure => (
                      <SelectItem key={structure.id} value={structure.id}>
                        {structure.nom} ({structure.type_structure})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea
                value={accessNotes}
                onChange={(e) => setAccessNotes(e.target.value)}
                placeholder="Notes sur cet accès..."
              />
            </div>
            <Button onClick={grantStructureAccess}>
              Accorder l'Accès
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des Institutions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Institutions ({institutions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {institutions.map(institution => (
              <div key={institution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{institution.nom}</p>
                  <p className="text-sm text-gray-600">{institution.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {institution.est_valide ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Validée
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!institution.est_valide ? (
                    <Button 
                      size="sm" 
                      onClick={() => validateInstitution(institution.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Valider
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => revokeInstitution(institution.id)}
                    >
                      Révoquer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accès Accordés */}
      <Card>
        <CardHeader>
          <CardTitle>Accès aux Structures Accordés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {structureAccesses.map(access => {
              const institution = institutions.find(i => i.id === access.institution_id);
              return (
                <div key={access.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium">{institution?.nom}</p>
                    <p className="text-sm text-blue-700">
                      Accès à: {access.structure.nom} ({access.structure.type_structure})
                    </p>
                    {access.notes && (
                      <p className="text-xs text-gray-600 mt-1">{access.notes}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => revokeStructureAccess(access.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionManagement;
