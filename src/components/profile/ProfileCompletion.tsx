
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Calendar, MapPin, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  adresse?: string;
  telephone?: string;
}

const ProfileCompletion = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          navigate('/auth');
          return;
        }

        // Chercher le profil existant
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error('Erreur lors de la récupération du profil:', profileError);
        }

        // Initialiser le profil avec les données existantes ou vides
        setProfile({
          id: user.id,
          email: user.email || '',
          nom: profileData?.nom || '',
          prenom: profileData?.prenom || '',
          date_naissance: profileData?.date_naissance || '',
          adresse: profileData?.adresse || '',
          telephone: profileData?.telephone || ''
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    const { nom, prenom, date_naissance } = profile;
    if (!nom || !prenom || !date_naissance) {
      setError('Les champs Nom, Prénom et Date de naissance sont obligatoires');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: profile.id,
          email: profile.email,
          nom: profile.nom,
          prenom: profile.prenom,
          date_naissance: profile.date_naissance,
          adresse: profile.adresse,
          telephone: profile.telephone
        }, { 
          onConflict: 'id' 
        });

      if (upsertError) {
        throw upsertError;
      }

      toast({
        title: "Profil enregistré",
        description: "Vos informations ont été sauvegardées avec succès",
      });

      // Rediriger vers l'accueil de l'application
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du profil');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Erreur lors du chargement du profil</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              Complétez votre profil
            </CardTitle>
            <CardDescription>
              Merci de renseigner vos informations pour finaliser votre inscription
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Votre nom"
                    value={profile.nom}
                    onChange={(e) => updateProfile('nom', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenom" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={profile.prenom}
                    onChange={(e) => updateProfile('prenom', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_naissance" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de naissance *
                </Label>
                <Input
                  id="date_naissance"
                  type="date"
                  value={profile.date_naissance}
                  onChange={(e) => updateProfile('date_naissance', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresse
                </Label>
                <Input
                  id="adresse"
                  type="text"
                  placeholder="Votre adresse complète"
                  value={profile.adresse}
                  onChange={(e) => updateProfile('adresse', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Numéro de téléphone
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  value={profile.telephone}
                  onChange={(e) => updateProfile('telephone', e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Valider et accéder à l'application
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                * Champs obligatoires
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletion;
