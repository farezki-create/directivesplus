
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, File } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Document {
  id: string;
  title: string;
  type: "directive" | "medical";
  path: string;
}

interface DocumentsLinkSectionProps {
  documents: Document[];
  dossierId: string;
}

const DocumentsLinkSection: React.FC<DocumentsLinkSectionProps> = ({ documents, dossierId }) => {
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
                  <FileText className="mr-2 h-4 w-4" />
                ) : (
                  <File className="mr-2 h-4 w-4" />
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
