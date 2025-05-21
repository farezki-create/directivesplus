
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, FileHeart, Stethoscope } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  documentType?: "directive" | "medical";
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentType = "medical" }) => {
  const { dossierActif } = useDossierStore();
  const { dossierId } = useParams<{ dossierId: string }>();
  const navigate = useNavigate();
  
  // Vérifier que l'utilisateur a accès à ce document
  useEffect(() => {
    if (!dossierActif) {
      toast({
        title: "Accès refusé",
        description: "Vous devez accéder à un dossier médical pour visualiser ce document",
        variant: "destructive"
      });
      navigate('/acces-document');
    }
  }, [dossierActif, navigate]);

  const handleBack = () => {
    navigate('/affichage-dossier');
  };

  if (!dossierActif) {
    return null;
  }

  // Déterminer le titre et l'icône en fonction du type de document
  const documentTitle = documentType === "directive" ? "Directives anticipées" : "Données médicales";
  const DocumentIcon = documentType === "directive" ? FileHeart : Stethoscope;
  const iconColor = documentType === "directive" ? "text-rose-500" : "text-blue-500";

  // Récupérer le contenu approprié du dossier en fonction du type de document
  const getDocumentContent = () => {
    if (!dossierActif || !dossierActif.contenu) {
      return <p className="text-center text-gray-500">Contenu du document non disponible</p>;
    }

    if (documentType === "directive") {
      if (dossierActif.contenu.directives_anticipees) {
        return (
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(dossierActif.contenu.directives_anticipees, null, 2)}</pre>
          </div>
        );
      }
      return <p className="text-center text-gray-500">Aucune directive anticipée n'est disponible pour ce dossier</p>;
    } else {
      // Afficher les données médicales générales
      const patientInfo = dossierActif.contenu.patient || {};
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Information patient</h3>
            <p><strong>Nom:</strong> {patientInfo.nom || 'Non renseigné'}</p>
            <p><strong>Prénom:</strong> {patientInfo.prenom || 'Non renseigné'}</p>
            <p><strong>Date de naissance:</strong> {patientInfo.date_naissance || 'Non renseigné'}</p>
          </div>
          
          {dossierActif.contenu.donnees_medicales && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-2">Données médicales</h3>
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(dossierActif.contenu.donnees_medicales, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <div className="mb-6">
          <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Retour au dossier
          </Button>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DocumentIcon size={24} className={iconColor} />
              {documentTitle}
            </CardTitle>
            <CardDescription>
              Document du dossier {dossierActif.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-100 rounded-md">
              {getDocumentContent()}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DocumentViewer;
