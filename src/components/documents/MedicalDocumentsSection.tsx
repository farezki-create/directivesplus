
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, FileText, Eye, Download, Trash2, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DocumentUploader from "./DocumentUploader";

interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description: string;
  created_at: string;
  user_id: string;
  extracted_content?: string;
}

interface MedicalDocumentsSectionProps {
  userId: string;
}

const MedicalDocumentsSection: React.FC<MedicalDocumentsSectionProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const loadMedicalDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading medical documents:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents médicaux",
          variant: "destructive"
        });
        return;
      }

      // Transform data to match MedicalDocument interface
      const transformedData: MedicalDocument[] = (data || []).map(doc => ({
        id: doc.id,
        file_name: doc.file_name,
        file_path: doc.file_path,
        file_type: doc.file_type,
        file_size: doc.file_size,
        description: doc.description,
        created_at: doc.created_at,
        user_id: doc.user_id,
        extracted_content: doc.extracted_content
      }));

      setDocuments(transformedData);
    } catch (error) {
      console.error('Error loading medical documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadMedicalDocuments();
    }
  }, [userId]);

  const handleUploadComplete = () => {
    loadMedicalDocuments();
    setShowUploader(false);
    toast({
      title: "Document médical ajouté",
      description: "Votre document médical a été ajouté avec succès",
    });
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le document",
          variant: "destructive"
        });
        return;
      }

      await loadMedicalDocuments();
      toast({
        title: "Document supprimé",
        description: "Le document médical a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents Médicaux
          </CardTitle>
          <p className="text-sm text-gray-600">
            Ajoutez vos documents médicaux (radiologies, analyses, ordonnances, etc.)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {documents.length} document{documents.length !== 1 ? 's' : ''} médical{documents.length !== 1 ? 'aux' : ''}
            </div>
            <Button 
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Ajouter un document médical
            </Button>
          </div>

          {showUploader && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <DocumentUploader
                userId={userId}
                onUploadComplete={handleUploadComplete}
                documentType="medical"
                saveToDirectives={false}
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

          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun document médical ajouté</p>
              <p className="text-sm">Cliquez sur "Ajouter un document médical" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <h3 className="font-medium truncate">{doc.file_name}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            médical
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          {doc.file_size && (
                            <div>
                              {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc.file_path)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Consulter
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.file_path, doc.file_name)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le document médical</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer "{doc.file_name}" ? 
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(doc.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalDocumentsSection;
