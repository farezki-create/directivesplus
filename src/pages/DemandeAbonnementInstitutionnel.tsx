
import React, { useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, CheckCircle, Mail, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ChatAssistant from "@/components/ChatAssistant";

const DemandeAbonnementInstitutionnel = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    structure: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('abonnes_institutions')
        .insert([{
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          structure: formData.structure
        }]);

      if (error) {
        console.error('Erreur lors de la soumission:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
          variant: "destructive"
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Demande envoyée",
          description: "Votre demande d'abonnement a été envoyée avec succès.",
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavigation hideEditingFeatures={true} />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                  alt="DirectivesPlus" 
                  className="h-24 w-auto"
                />
              </div>
            </div>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Demande envoyée avec succès</CardTitle>
                <CardDescription className="text-green-700">
                  Votre demande d'abonnement institutionnel a bien été reçue
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-green-700">
                  Un administrateur va examiner votre demande et vous contactera 
                  dans les plus brefs délais pour finaliser votre abonnement.
                </p>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Prochaines étapes :</h4>
                  <ul className="text-sm text-green-700 space-y-1 text-left">
                    <li>• Vérification de votre demande par notre équipe</li>
                    <li>• Contact téléphonique pour validation</li>
                    <li>• Configuration de votre accès institutionnel</li>
                    <li>• Formation à l'utilisation de la plateforme</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="mt-4"
                >
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
        
        <ChatAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                alt="DirectivesPlus" 
                className="h-24 w-auto"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Demande d'Abonnement Institutionnel
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Accès privilégié pour les professionnels et établissements de santé
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations de l'institution</CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour demander un accès institutionnel à DirectivesPlus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="structure" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Nom de la structure *
                  </Label>
                  <Input
                    id="structure"
                    name="structure"
                    value={formData.structure}
                    onChange={handleChange}
                    placeholder="Hôpital, Clinique, EHPAD, etc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom du référent *
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom et prénom du responsable"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email professionnel *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@etablissement.fr"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone *
                  </Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="01 23 45 67 89"
                    required
                  />
                </div>

                <Alert>
                  <Building2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important :</strong> Cette demande sera examinée par notre équipe. 
                    Un accès institutionnel permet de consulter les directives anticipées des patients 
                    selon les droits accordés par l'administration.
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
      
      <ChatAssistant />
    </div>
  );
};

export default DemandeAbonnementInstitutionnel;
