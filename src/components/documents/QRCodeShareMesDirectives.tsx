
import { useState } from "react";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, PrinterIcon, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeShareMesDirectivesProps {
  sharedCode: string;
  onClose?: () => void;
}

export function QRCodeShareMesDirectives({ sharedCode, onClose }: QRCodeShareMesDirectivesProps) {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/mes-directives?shared_code=${sharedCode}`;
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
          Lien d'accès à mes directives
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-center">
        <div className="flex justify-center">
          <QRCode value={url} size={160} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Lien de partage :</label>
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
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <PrinterIcon className="w-4 h-4 mr-2" /> 
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
            🔒 Accès sécurisé
          </p>
          <p className="text-xs text-blue-700">
            Ce lien est protégé par le nom, prénom et la date de naissance du patient.
            L'accès expirera automatiquement dans 30 jours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
