
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Share2 } from "lucide-react";
import QRCodeModal from "./QRCodeModal";
import { Document } from "@/types/documents";

interface DirectivesQRCodeSectionProps {
  documents: Document[];
}

const DirectivesQRCodeSection: React.FC<DirectivesQRCodeSectionProps> = ({
  documents
}) => {
  const [selectedDocumentForQR, setSelectedDocumentForQR] = useState<string | null>(null);

  if (documents.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partage d'urgence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Générez un QR code pour permettre l'accès direct à vos directives en cas d'urgence médicale.
          </p>
          
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{doc.file_name}</p>
                  <p className="text-sm text-gray-500">
                    Créé le {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDocumentForQR(doc.id)}
                  className="flex items-center gap-2"
                >
                  <QrCode size={16} />
                  QR Code
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Conseil :</strong> Imprimez le QR code et gardez-le dans votre portefeuille 
              pour un accès rapide en cas d'urgence.
            </p>
          </div>
        </CardContent>
      </Card>

      <QRCodeModal
        documentId={selectedDocumentForQR}
        onOpenChange={(open) => !open && setSelectedDocumentForQR(null)}
        documentName={documents.find(d => d.id === selectedDocumentForQR)?.file_name || "Document"}
      />
    </>
  );
};

export default DirectivesQRCodeSection;
