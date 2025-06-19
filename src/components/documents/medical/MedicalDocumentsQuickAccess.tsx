
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import DocumentUploader from "../DocumentUploader";

const MedicalDocumentsQuickAccess: React.FC = () => {
  const { user } = useAuth();
  const [showUploader, setShowUploader] = useState(false);

  const handleUploadComplete = () => {
    setShowUploader(false);
    toast({
      title: "Document médical ajouté",
      description: "Votre document médical a été ajouté avec succès",
    });
  };

  if (!user) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileText className="h-5 w-5" />
          Documents Médicaux
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-700">
          Ajoutez vos documents médicaux (radiologies, analyses, ordonnances, etc.) 
          pour compléter votre dossier médical.
        </p>
        
        <Button 
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un document médical
        </Button>

        {showUploader && (
          <div className="mt-4 p-4 border rounded-lg bg-white">
            <DocumentUploader
              userId={user.id}
              onUploadComplete={handleUploadComplete}
              documentType="medical"
              saveToDirectives={true}
            />
            <Button 
              variant="outline" 
              onClick={() => setShowUploader(false)}
              className="mt-2"
            >
              Annuler
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalDocumentsQuickAccess;
