
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
import { useAuth } from "@/hooks/useAuth";
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
  const { isAdmin } = useAuth();
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
                  <p className="text-sm text-gray-600">{institution.structure}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={institution.est_valide ? "default" : "secondary"}>
                    {institution.est_valide ? "Validée" : "En attente"}
                  </Badge>
                  {!institution.est_valide && (
                    <Button
                      size="sm"
                      onClick={() => validateInstitution(institution.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Valider
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionManagement;
