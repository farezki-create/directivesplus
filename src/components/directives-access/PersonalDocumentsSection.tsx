
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import { Document } from "@/hooks/useDirectivesDocuments";

interface PersonalDocumentsSectionProps {
  isAuthenticated: boolean;
  user: any;
  showDocuments: boolean;
  documents: Document[];
  onShowDocuments: () => void;
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
}

const PersonalDocumentsSection: React.FC<PersonalDocumentsSectionProps> = ({
  isAuthenticated,
  user,
  showDocuments,
  documents,
  onShowDocuments,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
}) => {
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Documents Personnels</CardTitle>
        <p className="text-sm text-gray-600">
          Vous êtes connecté. Vous pouvez également consulter vos propres documents.
        </p>
      </CardHeader>
      <CardContent>
        {!showDocuments ? (
          <Button onClick={onShowDocuments} variant="outline" className="w-full">
            Afficher mes documents personnels
          </Button>
        ) : (
          <DirectivesPageContent
            documents={documents}
            showAddOptions={false}
            setShowAddOptions={() => {}}
            userId={user.id}
            onUploadComplete={onUploadComplete}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalDocumentsSection;
