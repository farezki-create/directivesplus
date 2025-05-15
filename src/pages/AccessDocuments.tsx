
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DocumentCard from "@/components/documents/DocumentCard";

const AccessDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [accessType, setAccessType] = useState<'directive' | 'medical'>('directive');
  const [document, setDocument] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const searchParams = new URLSearchParams(location.search);
  const initialType = searchParams.get('type') as 'directive' | 'medical' || 'directive';

  // Use the URL parameter if available
  useState(() => {
    if (['directive', 'medical'].includes(initialType)) {
      setAccessType(initialType as 'directive' | 'medical');
    }
  });

  const formSchema = z.object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    birthDate: z.string().refine(value => {
      try {
        const date = new Date(value);
        return !isNaN(date.getTime());
      } catch {
        return false;
      }
    }, "La date de naissance est invalide"),
    accessCode: z.string().min(1, "Le code d'accès est requis")
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        birthDate: formData.get('birthDate') as string,
        accessCode: formData.get('accessCode') as string
      };
      
      // Validate the form data
      formSchema.parse(data);
      
      if (accessType === 'directive') {
        // Accès aux directives anticipées
        const { data: result, error } = await supabase
          .from('document_access_codes')
          .select('document_id, is_full_access, user_id')
          .eq('access_code', data.accessCode)
          .single();
        
        if (error || !result) {
          throw new Error("Code d'accès invalide ou expiré");
        }
        
        // Récupérer le profil de l'utilisateur
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', result.user_id)
          .single();
          
        if (profileError || !userProfile) {
          throw new Error("Profil utilisateur non trouvé");
        }
        
        // Vérifier les informations d'identité
        if (userProfile.first_name?.toLowerCase() !== data.firstName.toLowerCase() ||
            userProfile.last_name?.toLowerCase() !== data.lastName.toLowerCase()) {
          throw new Error("Les informations d'identité ne correspondent pas");
        }
        
        const birthDate = new Date(userProfile.birth_date);
        const inputDate = new Date(data.birthDate);
        
        if (birthDate.toISOString().split('T')[0] !== inputDate.toISOString().split('T')[0]) {
          throw new Error("La date de naissance ne correspond pas");
        }
        
        // Récupérer les documents
        if (result.document_id) {
          // Document spécifique
          const { data: doc, error: docError } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('id', result.document_id)
            .single();
            
          if (docError || !doc) {
            throw new Error("Document non trouvé");
          }
          
          setDocument(doc);
        } else {
          // Tous les documents de l'utilisateur
          const { data: docs, error: docsError } = await supabase
            .from('pdf_documents')
            .select('*')
            .eq('user_id', result.user_id)
            .order('created_at', { ascending: false });
            
          if (docsError) {
            throw new Error("Erreur lors de la récupération des documents");
          }
          
          if (docs && docs.length > 0) {
            setDocument(docs[0]); // Afficher le document le plus récent
          } else {
            throw new Error("Aucun document trouvé");
          }
        }
        
        setProfile(userProfile);
        
        toast({
          title: "Accès accordé",
          description: "Vous avez accès aux directives anticipées"
        });
        
      } else {
        // Accès aux données médicales
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('medical_access_code', data.accessCode)
          .single();
          
        if (profileError || !userProfile) {
          throw new Error("Code d'accès médical invalide");
        }
        
        // Vérifier les informations d'identité
        if (userProfile.first_name?.toLowerCase() !== data.firstName.toLowerCase() ||
            userProfile.last_name?.toLowerCase() !== data.lastName.toLowerCase()) {
          throw new Error("Les informations d'identité ne correspondent pas");
        }
        
        const birthDate = new Date(userProfile.birth_date);
        const inputDate = new Date(data.birthDate);
        
        if (birthDate.toISOString().split('T')[0] !== inputDate.toISOString().split('T')[0]) {
          throw new Error("La date de naissance ne correspond pas");
        }
        
        // Récupérer les documents médicaux
        const { data: docs, error: docsError } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false });
          
        if (docsError) {
          throw new Error("Erreur lors de la récupération des documents médicaux");
        }
        
        if (docs && docs.length > 0) {
          setDocument(docs[0]); // Afficher le document le plus récent
        } else {
          throw new Error("Aucun document médical trouvé");
        }
        
        setProfile(userProfile);
        
        toast({
          title: "Accès accordé",
          description: "Vous avez accès aux données médicales"
        });
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        console.error("Erreur d'accès:", error);
        toast({
          title: "Erreur d'accès",
          description: error instanceof Error ? error.message : "Impossible d'accéder aux documents",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (filePath: string) => {
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.focus();
      printWindow.onload = () => {
        try {
          printWindow.print();
        } catch (err) {
          console.error("Erreur lors de l'impression:", err);
        }
      };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              DirectivesPlus - Accès aux documents
            </h1>
            <Button variant="outline" onClick={() => navigate("/")}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          {!document ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Accès {accessType === 'directive' ? 'aux directives anticipées' : 'aux données médicales'}
                </CardTitle>
                <CardDescription>
                  {accessType === 'directive'
                    ? "Saisissez les informations du patient et le code d'accès pour consulter ses directives anticipées."
                    : "Saisissez les informations du patient et le code d'accès médical pour consulter ses données médicales."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4 mb-6">
                  <Button
                    variant={accessType === 'directive' ? 'default' : 'outline'}
                    onClick={() => setAccessType('directive')}
                  >
                    Directives anticipées
                  </Button>
                  <Button
                    variant={accessType === 'medical' ? 'default' : 'outline'}
                    onClick={() => setAccessType('medical')}
                  >
                    Données médicales
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Nom du patient"
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-red-500">{formErrors.lastName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Prénom du patient"
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date de naissance</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      className={formErrors.birthDate ? "border-red-500" : ""}
                    />
                    {formErrors.birthDate && (
                      <p className="text-sm text-red-500">{formErrors.birthDate}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accessCode">
                      Code d'accès {accessType === 'medical' ? 'médical' : ''}
                    </Label>
                    <Input
                      id="accessCode"
                      name="accessCode"
                      placeholder="Code d'accès unique"
                      className={formErrors.accessCode ? "border-red-500" : ""}
                    />
                    {formErrors.accessCode && (
                      <p className="text-sm text-red-500">{formErrors.accessCode}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Vérification..." : "Accéder aux documents"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {accessType === 'directive' ? "Directives anticipées" : "Données médicales"}
                    {" "} de {profile?.first_name} {profile?.last_name}
                  </CardTitle>
                  <CardDescription>
                    {profile?.birth_date && (
                      <>
                        Né(e) le {format(new Date(profile.birth_date), 'dd MMMM yyyy', { locale: fr })}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentCard 
                    document={document}
                    onDownload={handleDownload}
                    onPrint={() => handlePrint(document.file_path)}
                    onShare={() => {}}
                    onView={() => handleDownload(document.file_path, document.file_name)}
                    onDelete={() => {}}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDocument(null);
                      setProfile(null);
                    }}
                  >
                    Saisir un autre code d'accès
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccessDocuments;
