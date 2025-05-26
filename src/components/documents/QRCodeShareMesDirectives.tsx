
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Printer, QrCode, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQRCodeGeneration } from "@/hooks/useQRCodeGeneration";

interface QRCodeShareMesDirectivesProps {
  documentId: string;
  documentName: string;
  filePath?: string;
  onClose?: () => void;
}

export function QRCodeShareMesDirectives({ 
  documentId, 
  documentName,
  filePath,
  onClose 
}: QRCodeShareMesDirectivesProps) {
  const { 
    qrCodeData, 
    isGenerating, 
    error, 
    generateQRCode, 
    copyShareUrl 
  } = useQRCodeGeneration();
  
  const [printReady, setPrintReady] = useState(false);

  // Générer le QR code au montage du composant
  useEffect(() => {
    if (documentId && documentName) {
      console.log("Génération QR code pour:", { documentId, documentName, filePath });
      generateQRCode(documentId, documentName, filePath);
    }
  }, [documentId, documentName, filePath, generateQRCode]);

  // Préparer l'impression
  useEffect(() => {
    if (qrCodeData && !isGenerating) {
      setPrintReady(true);
    }
  }, [qrCodeData, isGenerating]);

  const handlePrint = () => {
    if (!printReady) {
      console.warn("QR code pas encore prêt pour l'impression");
      return;
    }

    try {
      window.print();
    } catch (err) {
      console.error("Erreur lors de l'impression:", err);
    }
  };

  const handleTestLink = () => {
    if (qrCodeData?.qrCodeValue) {
      console.log("Test du lien QR code:", qrCodeData.qrCodeValue);
      window.open(qrCodeData.qrCodeValue, '_blank');
    }
  };

  // Affichage d'erreur
  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Erreur de génération
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          {onClose && (
            <Button onClick={onClose} className="mt-4 w-full">
              Fermer
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Affichage de chargement
  if (isGenerating || !qrCodeData) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 animate-spin" />
            Génération du QR Code...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation du code QR...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="printable max-w-md mx-auto print:border-none print:shadow-none">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          {qrCodeData.documentName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-center">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border">
            <QRCodeSVG 
              value={qrCodeData.qrCodeValue} 
              size={160}
              level="M"
              includeMargin={true}
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* URL de partage */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Lien d'accès :</label>
          <div className="flex items-center gap-2">
            <Input 
              value={qrCodeData.qrCodeValue} 
              readOnly 
              className="text-xs bg-gray-50" 
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={copyShareUrl}
              className="flex-shrink-0"
              title="Copier le lien"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-center print:hidden">
          <Button 
            onClick={handleTestLink} 
            variant="default" 
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" /> 
            Tester
          </Button>
          
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            size="sm"
            disabled={!printReady}
          >
            <Printer className="w-4 h-4 mr-2" /> 
            Imprimer
          </Button>
          
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              Fermer
            </Button>
          )}
        </div>

        {/* Statut */}
        {printReady && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ QR Code prêt - Scanner pour accéder au document
            </AlertDescription>
          </Alert>
        )}

        {/* Informations d'usage */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-1">
            📱 Scanner avec votre téléphone
          </p>
          <p className="text-xs text-blue-700">
            Ce QR code ouvre directement le document dans n'importe quel navigateur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
