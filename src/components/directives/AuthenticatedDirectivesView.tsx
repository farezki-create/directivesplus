
import React from "react";
import { User } from "@supabase/supabase-js";
import AppNavigation from "@/components/AppNavigation";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesQRCodeSection from "@/components/documents/DirectivesQRCodeSection";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import { InstitutionCodeSection } from "@/components/directives/InstitutionCodeSection";
import { Document } from "@/types/documents";

interface AuthenticatedDirectivesViewProps {
  user: User | null;
  profile: any;
  documents: Document[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  documentToDelete: string | null;
  setDocumentToDelete: (id: string | null) => void;
  handleDelete: (id: string) => void;
  previewDocument: Document | null;
  setPreviewDocument: (doc: Document | null) => void;
  handlePreviewDownload: (filePath: string) => void;
  handlePreviewPrint: (filePath: string, fileType?: string) => void;
}

const AuthenticatedDirectivesView: React.FC<AuthenticatedDirectivesViewProps> = ({
  user,
  profile,
  documents,
  showAddOptions,
  setShowAddOptions,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  documentToDelete,
  setDocumentToDelete,
  handleDelete,
  previewDocument,
  setPreviewDocument,
  handlePreviewDownload,
  handlePreviewPrint
}) => {
  console.log("AuthenticatedDirectivesView - previewDocument:", previewDocument);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      <div className="container mx-auto px-4 py-8">
        <DirectivesPageHeader
          onAddDocument={() => setShowAddOptions(true)}
          documentsCount={documents.length}
        />

        <div className="space-y-6">
          <DirectivesQRCodeSection documents={documents} />

          <DirectivesPageContent
            documents={documents}
            userId={user?.id}
            onUploadComplete={onUploadComplete}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={setDocumentToDelete}
            profile={profile}
          />

          <InstitutionCodeSection />
        </div>

        <DirectivesAddDocumentSection
          showAddOptions={showAddOptions}
          setShowAddOptions={setShowAddOptions}
          onUploadComplete={onUploadComplete}
        />

        <DocumentPreviewDialog
          filePath={previewDocument?.file_path || null}
          onOpenChange={(open: boolean) => {
            console.log("DocumentPreviewDialog - onOpenChange:", open);
            if (!open) {
              setPreviewDocument(null);
            }
          }}
          onDownload={(filePath: string) => {
            console.log("DocumentPreviewDialog - onDownload:", filePath);
            handlePreviewDownload(filePath);
          }}
          onPrint={(filePath: string) => {
            console.log("DocumentPreviewDialog - onPrint:", filePath);
            handlePreviewPrint(filePath);
          }}
        />

        <DeleteConfirmationDialog
          isOpen={!!documentToDelete}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={() => {
            if (documentToDelete) {
              handleDelete(documentToDelete);
              setDocumentToDelete(null);
            }
          }}
          documentName={documents.find(d => d.id === documentToDelete)?.file_name || "ce document"}
        />
      </div>
    </div>
  );
};

export default AuthenticatedDirectivesView;
