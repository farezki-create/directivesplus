
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, QrCode, Trash2, Download, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QRCodeModal from "@/components/documents/QRCodeModal";
import { useQRCodeModal } from "@/hooks/useQRCodeModal";

interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  extracted_content?: string;
  description?: string;
}

interface MedicalDocumentCompilerProps {
  documents: MedicalDocument[];
  userId: string;
  onDocumentDelete: (documentId: string) => void;
}

const MedicalDocumentCompiler: React.FC<MedicalDocumentCompilerProps> = ({
  documents,
  userId,
  onDocumentDelete
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { 
    qrCodeModalState, 
    openQRCodeModal, 
    closeQRCodeModal 
  } = useQRCodeModal();

  // Sélectionner/désélectionner un document
  const toggleDocumentSelection = (documentId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(documentId)) {
      newSelection.delete(documentId);
    } else {
      newSelection.add(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  // Sélectionner tous les documents
  const selectAllDocuments = () => {
    setSelectedDocuments(new Set(documents.map(doc => doc.id)));
  };

  // Désélectionner tous les documents
  const deselectAllDocuments = () => {
    setSelectedDocuments(new Set());
  };

  // Supprimer un document
  const handleDeleteDocument = async (documentId: string) => {
    setIsDeleting(documentId);
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      // Retirer de la sélection si sélectionné
      const newSelection = new Set(selectedDocuments);
      newSelection.delete(documentId);
      setSelectedDocuments(newSelection);

      onDocumentDelete(documentId);
      
      toast({
        title: "Document supprimé",
        description: "Le document médical a été supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Compiler les documents sélectionnés en PDF
  const handleCompileDocuments = async () => {
    if (selectedDocuments.size === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document à compiler",
        variant: "destructive"
      });
      return;
    }

    setIsCompiling(true);
    try {
      // Importer la fonction de génération PDF
      const { generateMedicalCompilationPDF } = await import("@/utils/pdf/medicalCompilation");
      
      const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.id));
      const pdfOutput = await generateMedicalCompilationPDF(selectedDocs, userId);
      
      // Sauvegarder le PDF compilé
      const compilationName = `Documents_Medicaux_Compilation_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
      
      const { data: savedDoc, error } = await supabase
        .from('pdf_documents')
        .insert({
          file_name: compilationName,
          file_path: pdfOutput,
          description: `Compilation de ${selectedDocuments.size} document(s) médical(aux)`,
          user_id: userId,
          content_type: 'application/pdf'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Compilation réussie",
        description: `${selectedDocuments.size} document(s) compilé(s) en PDF avec succès`
      });

      // Ouvrir le modal QR code pour le document compilé
      openQRCodeModal(savedDoc.id, compilationName, savedDoc.file_path);
      
    } catch (error) {
      console.error("Erreur lors de la compilation:", error);
      toast({
        title: "Erreur de compilation",
        description: "Impossible de compiler les documents en PDF",
        variant: "destructive"
      });
    } finally {
      setIsCompiling(false);
    }
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compilation de documents médicaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <QrCode className="h-4 w-4" />
            <AlertDescription>
              Sélectionnez les documents à compiler en un seul PDF accessible par QR code. 
              Vous pouvez également supprimer des documents avant la compilation.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Boutons de sélection */}
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllDocuments}
                disabled={isCompiling}
              >
                Tout sélectionner
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={deselectAllDocuments}
                disabled={isCompiling}
              >
                Tout désélectionner
              </Button>
            </div>

            {/* Liste des documents */}
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    checked={selectedDocuments.has(doc.id)}
                    onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    disabled={isCompiling}
                  />
                  
                  <div className="flex-1">
                    <p className="font-medium">{doc.file_name}</p>
                    <p className="text-sm text-gray-500">
                      Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {doc.extracted_content && (
                      <p className="text-xs text-green-600">
                        ✓ Contenu extrait disponible
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id)}
                    disabled={isCompiling || isDeleting === doc.id}
                    className="text-red-600 hover:bg-red-50"
                  >
                    {isDeleting === doc.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Bouton de compilation */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleCompileDocuments}
                disabled={isCompiling || selectedDocuments.size === 0}
                className="w-full"
              >
                {isCompiling ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Compilation en cours...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Compiler {selectedDocuments.size} document(s) en PDF
                  </>
                )}
              </Button>
              
              {selectedDocuments.size > 0 && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Le PDF compilé sera automatiquement sauvegardé et un QR code sera généré
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <QRCodeModal
        documentId={qrCodeModalState.documentId}
        documentName={qrCodeModalState.documentName}
        filePath={qrCodeModalState.filePath}
        onOpenChange={(open) => {
          if (!open) {
            closeQRCodeModal();
          }
        }}
      />
    </>
  );
};

export default MedicalDocumentCompiler;
