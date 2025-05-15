
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSearch } from "lucide-react";

const AccessDocuments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    accessCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le prénom est requis",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.lastName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom est requis",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.accessCode.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le code d'accès est requis",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const accessDirectives = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Vérifier si le code d'accès existe dans document_access_codes
      const { data: accessData, error: accessError } = await supabase
        .from('document_access_codes')
        .select('user_id')
        .eq('access_code', formData.accessCode.trim());
      
      if (accessError) throw accessError;
      
      if (!accessData || accessData.length === 0) {
        toast({
          title: "Accès refusé",
          description: "Code d'accès invalide",
          variant: "destructive"
        });
        return;
      }
      
      const userId = accessData[0].user_id;
      
      // Vérifier si les informations du profil correspondent
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      if (!profileData || profileData.length === 0) {
        toast({
          title: "Erreur",
          description: "Profil utilisateur introuvable",
          variant: "destructive"
        });
        return;
      }
      
      const profile = profileData[0];
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profile.first_name.toLowerCase() !== formData.firstName.toLowerCase() || 
          profile.last_name.toLowerCase() !== formData.lastName.toLowerCase() ||
          !birthDateMatch) {
        toast({
          title: "Accès refusé",
          description: "Informations personnelles incorrectes",
          variant: "destructive"
        });
        return;
      }
      
      // Access granted - would normally fetch and display directives
      toast({
        title: "Accès autorisé",
        description: "Chargement des directives anticipées...",
      });
      
      // Here we would fetch and display the directives
      // For now, just mock the success
      setTimeout(() => {
        navigate('/mes-directives');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux directives:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de l'accès",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const accessMedicalData = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Vérifier si le code d'accès existe dans profiles (medical_access_code)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('medical_access_code', formData.accessCode.trim());
      
      if (profilesError) throw profilesError;
      
      if (!profilesData || profilesData.length === 0) {
        toast({
          title: "Accès refusé",
          description: "Code d'accès médical invalide",
          variant: "destructive"
        });
        return;
      }
      
      const profile = profilesData[0];
      const birthDateMatch = formData.birthDate ? 
        new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
      
      if (profile.first_name.toLowerCase() !== formData.firstName.toLowerCase() || 
          profile.last_name.toLowerCase() !== formData.lastName.toLowerCase() ||
          !birthDateMatch) {
        toast({
          title: "Accès refusé",
          description: "Informations personnelles incorrectes",
          variant: "destructive"
        });
        return;
      }
      
      // Access granted - would normally fetch and display medical data
      toast({
        title: "Accès autorisé",
        description: "Chargement des données médicales...",
      });
      
      // Here we would fetch and display the medical data
      // For now, just mock the success
      setTimeout(() => {
        navigate('/donnees-medicales');
      }, 1000);
    } catch (error: any) {
      console.error("Erreur d'accès aux données médicales:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification de l'accès",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
            Accès document
          </h1>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Accès sans connexion</CardTitle>
              <CardDescription>
                Accédez aux directives anticipées ou aux données médicales d'un patient à l'aide du code d'accès unique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  placeholder="Nom de famille"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input 
                  id="birthDate" 
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessCode">Code d'accès</Label>
                <Input 
                  id="accessCode" 
                  name="accessCode"
                  placeholder="Code d'accès unique"
                  value={formData.accessCode}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full flex items-center gap-2" 
                onClick={accessDirectives}
                disabled={loading}
              >
                <FileText size={18} />
                Accéder aux directives anticipées
              </Button>
              
              <Button 
                className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700" 
                onClick={accessMedicalData}
                disabled={loading}
              >
                <FileSearch size={18} />
                Accéder aux données médicales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccessDocuments;
