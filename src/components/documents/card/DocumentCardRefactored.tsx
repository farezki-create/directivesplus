
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, Download, Printer, Trash2, FolderPlus, FileText, QrCode } from "lucide-react";
import { Document } from "@/types/documents";
import QRCodeModal from "@/components/documents/QRCodeModal";
import { useQRCodeModal } from "@/hooks/useQRCodeModal";

interface DocumentCardRefactoredProps {
  document: Document;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  showShare?: boolean;
  isAddingToShared?: boolean;
}

export const DocumentCardRefactored: React.FC<DocumentCardRefactoredProps> = ({
  document,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  onAddToSharedFolder,
  showPrint = true,
  showShare = false,
  isAddingToShared = false
}) => {
  const { 
    qrCodeModalState, 
    isQRCodeModalOpen, 
    openQRCodeModal, 
    closeQRCodeModal 
  } = useQRCodeModal();

  const getDocumentIcon = () => {
    switch (document.file_type) {
      case 'directive':
        return <FileText className="h-8 w-8 text-blue-600" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'medical':
        return <FileText className="h-8 w-8 text-green-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const handleGenerateQRCode = () => {
    if (!document.id) {
      console.error("DocumentCardRefactored: Document sans ID", document);
      return;
    }

    try {
      // Passer le file_path pour permettre l'accès direct au PDF
      openQRCodeModal(document.id, document.file_name, document.file_path);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du modal QR code:", error);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            {getDocumentIcon()}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{document.file_name}</h3>
              {document.description && (
                <p className="text-sm text-gray-600 mt-1">{document.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>Créé le {new Date(document.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(document.file_path, document.content_type)}
              className="flex items-center gap-1"
            >
              <Eye size={16} />
              Voir
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document.file_path, document.file_name)}
              className="flex items-center gap-1"
            >
              <Download size={16} />
              Télécharger
            </Button>

            {showPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrint(document.file_path, document.content_type)}
                className="flex items-center gap-1"
              >
                <Printer size={16} />
                Imprimer
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateQRCode}
              className="flex items-center gap-1"
              disabled={!document.id}
            >
              <QrCode size={16} />
              QR Direct
            </Button>

            {onAddToSharedFolder && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddToSharedFolder}
                disabled={isAddingToShared}
                className="flex items-center gap-1"
              >
                <FolderPlus size={16} />
                {isAddingToShared ? "Ajout..." : "Ajouter"}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(document.id)}
              className="flex items-center gap-1 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Supprimer
            </Button>
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
