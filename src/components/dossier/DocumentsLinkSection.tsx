
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, File, Stethoscope, FileHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDossierStore } from "@/store/dossierStore";

interface Document {
  id: string;
  title: string;
  type: "directive" | "medical";
  path: string;
}

interface DocumentsLinkSectionProps {
  dossierId: string;
}

const DocumentsLinkSection: React.FC<DocumentsLinkSectionProps> = ({ dossierId }) => {
  const { dossierActif } = useDossierStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  
  useEffect(() => {
    if (dossierActif && dossierActif.id) {
      // Création des liens dynamiques basés sur le contenu réel du dossier
      const docsToDisplay: Document[] = [];
      
      // Si le dossier contient des directives anticipées, ajouter le lien
      if (dossierActif.contenu && dossierActif.contenu.directives_anticipees) {
        docsToDisplay.push({
          id: `directive-${dossierActif.id}`,
          title: "Directives anticipées",
          type: "directive",
          path: `/directives-viewer/${dossierActif.id}`
        });
      }
      
      // Ajouter toujours le lien vers les données médicales
      docsToDisplay.push({
        id: `medical-${dossierActif.id}`,
        title: "Données médicales",
        type: "medical",
        path: `/medical-viewer/${dossierActif.id}`
      });
      
      // Si le dossier a d'autres documents spécifiques (comme des PDF stockés), on pourrait les ajouter ici
      
      setDocuments(docsToDisplay);
      console.log("Documents links generated:", docsToDisplay);
    }
  }, [dossierActif]);

  if (!documents || documents.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Documents associés</CardTitle>
          <CardDescription>Aucun document disponible pour ce dossier</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Documents associés</CardTitle>
        <CardDescription>Documents liés au dossier {dossierId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc) => (
            <Link to={doc.path} key={doc.id} className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                {doc.type === "directive" ? (
                  <FileHeart className="mr-2 h-4 w-4 text-rose-500" />
                ) : (
                  <Stethoscope className="mr-2 h-4 w-4 text-blue-500" />
                )}
                {doc.title}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsLinkSection;
