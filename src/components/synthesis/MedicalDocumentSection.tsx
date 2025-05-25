
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentUploader from "@/components/documents/DocumentUploader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MedicalDocumentSectionProps {
  userId?: string;
  onUploadComplete: () => void;
  onDocumentAdd: (documentInfo: any) => void;
}

const MedicalDocumentSection = ({ userId, onUploadComplete, onDocumentAdd }: MedicalDocumentSectionProps) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  // Récupérer les documents médicaux existants depuis les questionnaires
  useEffect(() => {
    const fetchMedicalDocuments = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', userId)
          .eq('questionnaire_type', 'medical-documents');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const documents = data.map(item => ({
            id: item.question_id,
            name: item.question_text,
            description: item.response,
            created_at: item.created_at
          }));
          setUploadedDocuments(documents);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des documents médicaux:', error);
      }
    };
    
    fetchMedicalDocuments();
  }, [userId]);

  const handleDocumentUpload = async (file: File) => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un document",
        variant: "destructive"
      });
      return;
    }

    try {
      // Créer un UUID pour le document
      const documentId = crypto.randomUUID();
      
      // Ajouter le document aux questionnaires
      const { error } = await supabase
        .from('questionnaire_responses')
        .insert({
          user_id: userId,
          questionnaire_type: 'medical-documents',
          question_id: documentId,
          question_text: file.name,
          response: `Document médical de synthèse: ${file.name}. Taille: ${(file.size / 1024).toFixed(1)} KB. Type: ${file.type}.`
        });

      if (error) throw error;

      const newDocument = {
        id: documentId,
        name: file.name,
        description: `Document médical de synthèse: ${file.name}`,
        created_at: new Date().toISOString()
      };

      setUploadedDocuments(prev => [...prev, newDocument]);
      onDocumentAdd(newDocument);
      onUploadComplete();

      toast({
        title: "Document ajouté",
        description: "Le document médical a été ajouté à vos questionnaires et sera inclus dans votre PDF de directives anticipées"
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document médical",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Document médical de synthèse</CardTitle>
        <p className="text-sm text-gray-600">
          Ajoutez un document médical de synthèse des maladies pour compléter vos directives anticipées. 
          Ce document sera intégré dans votre PDF final.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleDocumentUpload(file);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {uploadedDocuments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Documents ajoutés :</h4>
              <ul className="space-y-2">
                {uploadedDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalDocumentSection;
