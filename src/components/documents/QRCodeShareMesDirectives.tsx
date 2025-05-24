
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Printer, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeShareMesDirectivesProps {
  sharedCode: string;
  onClose?: () => void;
}

export function QRCodeShareMesDirectives({ sharedCode, onClose }: QRCodeShareMesDirectivesProps) {
  const baseUrl = window.location.origin;
  // Utiliser un lien direct sans nécessiter de saisie manuelle
  const url = `${baseUrl}/partage/${sharedCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Lien copié",
        description: "Lien de partage copié dans le presse-papiers."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="printable max-w-md mx-auto print:border-none print:shadow-none">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Accès direct aux directives
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-center">
        <div className="flex justify-center">
          <QRCodeSVG value={url} size={160} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Lien d'accès direct :</label>
          <div className="flex items-center gap-2">
            <Input 
              value={url} 
              readOnly 
              className="text-xs bg-gray-50" 
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" /> 
            Imprimer
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="default" size="sm">
              Fermer
            </Button>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-1">
            🔒 Accès direct sécurisé
          </p>
          <p className="text-xs text-blue-700">
            Scanner le QR code ou cliquer sur le lien donne un accès immédiat aux directives.
            Idéal pour les situations d'urgence médicale.
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
