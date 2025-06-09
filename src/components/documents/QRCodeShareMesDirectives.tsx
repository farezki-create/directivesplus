
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, Download, Printer, QrCode } from "lucide-react";
import { useQRCodeGeneration } from "@/hooks/useQRCodeGeneration";

interface QRCodeShareMesDirectivesProps {
  documentId: string;
  documentName: string;
  filePath?: string;
  onClose?: () => void;
}

export const QRCodeShareMesDirectives: React.FC<QRCodeShareMesDirectivesProps> = ({
  documentId,
  documentName,
  filePath,
  onClose
}) => {
  const { qrCodeData, isGenerating, error, generateQRCode, copyShareUrl } = useQRCodeGeneration();
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string>("");

  useEffect(() => {
    if (documentId) {
      generateQRCode(documentId, documentName, filePath);
    }
  }, [documentId, documentName, filePath, generateQRCode]);

  useEffect(() => {
    if (qrCodeData?.qrCodeValue) {
      // Générer l'image QR code avec une API externe
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData.qrCodeValue)}`;
      setQrCodeImageUrl(qrUrl);
    }
  }, [qrCodeData]);

  const handlePrintQRCode = () => {
    if (!qrCodeImageUrl) return;

    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${documentName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
                margin: 0;
              }
              .container {
                max-width: 400px;
                margin: 0 auto;
              }
              h1 { 
                font-size: 18px; 
                margin-bottom: 10px; 
                color: #333;
              }
              .qr-code { 
                margin: 20px 0;
              }
              .qr-code img {
                max-width: 250px;
                height: auto;
                border: 1px solid #ddd;
                padding: 10px;
                background: white;
              }
              .instructions {
                font-size: 12px;
                color: #666;
                margin-top: 15px;
                line-height: 1.4;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>QR Code d'accès direct</h1>
              <h2 style="font-size: 14px; color: #666; margin-bottom: 20px;">${documentName}</h2>
              <div class="qr-code">
                <img src="${qrCodeImageUrl}" alt="QR Code" onload="window.print();" />
              </div>
              <div class="instructions">
                Scanner ce QR code pour accéder directement au document.<br>
                Aucun code d'accès supplémentaire requis.
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadQRCode = async () => {
    if (!qrCodeImageUrl) return;

    try {
      const response = await fetch(qrCodeImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "QR Code téléchargé",
        description: "L'image du QR code a été téléchargée",
      });
    } catch (error) {
      console.error('Erreur téléchargement QR code:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le QR code",
        variant: "destructive"
      });
    }
  };

  if (isGenerating) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Génération du QR Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erreur : {error}</p>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    );
  }

  if (!qrCodeData || !qrCodeImageUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Impossible de générer le QR code</p>
        <Button variant="outline" onClick={onClose} className="mt-4">
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="p-4 bg-white rounded-lg border">
        <img 
          src={qrCodeImageUrl} 
          alt={`QR Code pour ${documentName}`}
          className="mx-auto max-w-[250px] h-auto"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">QR Code d'accès direct</h3>
        <p className="text-sm text-gray-600">
          Scanner ce code ouvre directement le PDF sans code d'accès supplémentaire
        </p>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button onClick={copyShareUrl} variant="outline" className="w-full">
          <Copy className="w-4 h-4 mr-2" />
          Copier le lien
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleDownloadQRCode} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          
          <Button onClick={handlePrintQRCode} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          ✅ <strong>Accès direct :</strong> Le QR code pointe directement vers le PDF.
          Scanner = ouverture immédiate !
        </p>
      </div>
    </div>
  );
};
