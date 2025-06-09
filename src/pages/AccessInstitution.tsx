
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Building2, Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AccessInstitution = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    institution: "",
    contact_person: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.institution || !formData.contact_person || !formData.email) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le lien mailto avec les informations de la demande
      const subject = encodeURIComponent("Demande d'abonnement institutionnel - DirectivesPlus");
      const body = encodeURIComponent(
        `Institution: ${formData.institution}\n` +
        `Personne de contact: ${formData.contact_person}\n` +
        `Email: ${formData.email}\n` +
        `Téléphone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\nDemande générée automatiquement depuis DirectivesPlus`
      );
      
      const mailtoUrl = `mailto:contact@directivesplus.fr?subject=${subject}&body=${body}`;
      
      // Ouvrir le client email par défaut
      window.location.href = mailtoUrl;
      
      toast({
        title: "Demande préparée",
        description: "Votre client email s'est ouvert avec la demande pré-remplie. Envoyez l'email pour finaliser votre demande.",
      });

      // Réinitialiser le formulaire
      setFormData({
        institution: "",
        contact_person: "",
        email: "",
        phone: "",
        message: ""
      });

    } catch (error) {
      console.error("Erreur lors de l'ouverture de l'email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir votre client email. Veuillez envoyer un email manuellement à contact@directivesplus.fr",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Building2 className="h-6 w-6" />
                Accès Institutionnel
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Demandez un accès pour votre établissement de santé
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="institution">Nom de l'institution *</Label>
                  <Input
                    id="institution"
                    name="institution"
                    type="text"
                    required
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Ex: Hôpital Saint-Joseph"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_person">Personne de contact *</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    type="text"
                    required
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    placeholder="Nom et prénom"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@etablissement.fr"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message complémentaire</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez vos besoins spécifiques..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Préparation..." : "Envoyer la demande"}
                </Button>

                <div className="text-sm text-gray-600 text-center mt-4">
                  <p>
                    * Champs obligatoires<br/>
                    Votre demande sera envoyée à <strong>contact@directivesplus.fr</strong>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessInstitution;
