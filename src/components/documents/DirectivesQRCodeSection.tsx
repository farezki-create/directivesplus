
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Share2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QRCodeModal from "./QRCodeModal";
import { useQRCodeModal } from "@/hooks/useQRCodeModal";
import { Document } from "@/types/documents";

interface DirectivesQRCodeSectionProps {
  documents: Document[];
}

const DirectivesQRCodeSection: React.FC<DirectivesQRCodeSectionProps> = ({
  documents
}) => {
  const { 
    qrCodeModalState, 
    isQRCodeModalOpen, 
    openQRCodeModal, 
    closeQRCodeModal 
  } = useQRCodeModal();

  // Validation des documents
  const validDocuments = documents.filter(doc => 
    doc && 
    doc.id && 
    doc.id.trim() !== '' && 
    doc.file_name && 
    doc.file_name.trim() !== ''
  );

  if (validDocuments.length === 0) {
    return null;
  }

  const handleGenerateQRCode = (document: Document) => {
    if (!document.id) {
      console.error("DirectivesQRCodeSection: Document sans ID", document);
      return;
    }

    try {
      // Passer aussi le file_path pour permettre l'accès direct
      openQRCodeModal(document.id, document.file_name, document.file_path);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du modal QR code:", error);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partage direct par QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Générez un QR code qui ouvre directement le PDF de vos directives. Plus besoin de code d'accès !
          </p>
          
          {/* Vérification des documents valides */}
          {documents.length > validDocuments.length && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Certains documents ne peuvent pas générer de QR code car ils manquent d'informations nécessaires.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            {validDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{doc.file_name}</p>
                  <p className="text-sm text-gray-500">
                    Créé le {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateQRCode(doc)}
                  className="flex items-center gap-2"
                  disabled={!doc.id}
                >
                  <QrCode size={16} />
                  QR Code Direct
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ <strong>Nouvelle approche :</strong> Le QR code pointe directement vers le PDF. 
              Scanner = ouverture immédiate du document !
            </p>
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

export default DirectivesQRCodeSection;
