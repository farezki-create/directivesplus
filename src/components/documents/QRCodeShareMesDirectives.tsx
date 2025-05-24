
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Printer, QrCode, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQRCodeGeneration } from "@/hooks/useQRCodeGeneration";

interface QRCodeShareMesDirectivesProps {
  documentId: string;
  documentName: string;
  onClose?: () => void;
}

export function QRCodeShareMesDirectives({ 
  documentId, 
  documentName, 
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
      generateQRCode(documentId, documentName);
    }
  }, [documentId, documentName, generateQRCode]);

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
          Partage direct - {qrCodeData.documentName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-center">
        {/* QR Code avec validation */}
        <div className="flex justify-center">
          {qrCodeData.qrCodeValue ? (
            <QRCodeSVG 
              value={qrCodeData.qrCodeValue} 
              size={160}
              level="M"
              includeMargin={true}
            />
          ) : (
            <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* URL de partage */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Lien d'accès direct :</label>
          <div className="flex items-center gap-2">
            <Input 
              value={qrCodeData.shareUrl} 
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
            onClick={handlePrint} 
            variant="outline" 
            size="sm"
            disabled={!printReady}
          >
            <Printer className="w-4 h-4 mr-2" /> 
            Imprimer QR Code
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="default" size="sm">
              Fermer
            </Button>
          )}
        </div>

        {/* Statut de préparation */}
        {printReady && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              QR Code prêt pour l'impression et le partage
            </AlertDescription>
          </Alert>
        )}

        {/* Informations d'usage */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-1">
            🔓 Accès direct simplifié
          </p>
          <p className="text-xs text-blue-700">
            Scanner le QR code ou cliquer sur le lien ouvre directement le document.
            Aucun code à saisir - idéal pour les urgences médicales.
          </p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-medium mb-1">
            ⚡ Usage recommandé
          </p>
          <p className="text-xs text-green-700">
            • Gardez ce QR code dans votre portefeuille<br/>
            • Collez-le sur votre frigo ou tableau de bord<br/>
            • Partagez le lien avec vos proches et médecins
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
