
import React from "react";
import { useSharedDocument } from "@/hooks/useSharedDocument";
import { useSharedDocumentActions } from "@/hooks/useSharedDocumentActions";
import { SharedDocumentCard } from "@/components/documents/shared/SharedDocumentCard";
import { SharedDocumentError } from "@/components/documents/shared/SharedDocumentError";
import { SharedDocumentLoading } from "@/components/documents/shared/SharedDocumentLoading";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";

const Partage = () => {
  const { sharedDocument, loading, error, shareCode } = useSharedDocument();
  const { 
    previewDocument, 
    setPreviewDocument, 
    handleDownload, 
    handleView, 
    handlePrint 
  } = useSharedDocumentActions();

  if (loading) {
    return <SharedDocumentLoading />;
  }

  if (error || !sharedDocument) {
    return <SharedDocumentError error={error || "Document non trouvé"} shareCode={shareCode} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Partagé</h1>
          <p className="text-gray-600">Accès direct au document (mode sans sécurité)</p>
        </div>

        <SharedDocumentCard
          document={sharedDocument}
          onView={handleView}
          onDownload={handleDownload}
        />
      </div>

      <DocumentPreviewDialog 
        filePath={previewDocument} 
        onOpenChange={(open) => {
          if (!open) setPreviewDocument(null);
        }}
        onDownload={() => {
          if (previewDocument && sharedDocument) {
            handleDownload(previewDocument, sharedDocument.document_data.file_name);
          }
        }}
        onPrint={() => {
          if (previewDocument) {
            handlePrint(previewDocument);
          }
        }}
      />
    </div>
  );
};

export default Partage;
