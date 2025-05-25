
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Printer, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const CarteAcces = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [codeAcces, setCodeAcces] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/carte-acces" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && user && profile) {
      // Générer un code d'accès institution basé sur l'ID utilisateur
      const generatedCode = `DA${user.id.substring(0, 8).toUpperCase()}`;
      setCodeAcces(generatedCode);
      
      // Créer l'URL pour le QR code qui pointe vers les directives
      const qrUrl = `${window.location.origin}/mes-directives?access=${generatedCode}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isAuthenticated, user, profile]);

  const handlePrint = () => {
    const cardElement = document.getElementById('access-card');
    if (cardElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Carte d'Accès - DirectivesPlus</title>
              <style>
                body { margin: 0; font-family: Arial, sans-serif; }
                .card { width: 85.6mm; height: 53.98mm; padding: 8px; box-sizing: border-box; }
                @media print {
                  .card { width: 85.6mm; height: 53.98mm; page-break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <div class="card">${cardElement.innerHTML}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        
        toast({
          title: "Impression lancée",
          description: "La carte d'accès va être imprimée"
        });
      }
    }
  };

  const handleDownload = () => {
    const cardElement = document.getElementById('access-card');
    if (cardElement) {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Format carte bancaire
      });
      
      pdf.html(cardElement, {
        callback: function (doc) {
          doc.save('carte-acces-directivesplus.pdf');
          toast({
            title: "Téléchargement réussi",
            description: "La carte d'accès a été téléchargée en PDF"
          });
        },
        x: 0,
        y: 0,
        width: 85.6,
        windowWidth: 400
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const birthDate = profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/rediger")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              Carte d'Accès Professionnelle
            </h1>
            <p className="text-lg text-gray-600">
              Votre carte d'accès aux directives anticipées pour les professionnels de santé
            </p>
          </div>

          {/* Actions d'impression et téléchargement */}
          <div className="flex justify-center gap-4 mb-8 print:hidden">
            <Button 
              onClick={handlePrint} 
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white"
            >
              <Printer size={16} />
              Imprimer
            </Button>
            <Button 
              onClick={handleDownload} 
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white"
            >
              <Download size={16} />
              Télécharger PDF
            </Button>
          </div>

          {/* Carte d'accès format bancaire */}
          <div className="flex justify-center">
            <div 
              id="access-card"
              className="w-[342px] h-[216px] bg-gradient-to-br from-directiveplus-600 to-directiveplus-800 rounded-2xl p-4 text-white shadow-2xl relative overflow-hidden"
              style={{ aspectRatio: '85.6/53.98' }}
            >
              {/* Pattern décoratif */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
              
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm font-bold">DirectivesPlus</span>
                  </div>
                  <p className="text-xs opacity-90">Carte d'Accès Professionnel</p>
                </div>
                <div className="text-right">
                  <div className="bg-white bg-opacity-20 rounded p-1">
                    {qrCodeUrl && (
                      <QRCodeSVG 
                        value={qrCodeUrl}
                        size={40}
                        level="M"
                        fgColor="#ffffff"
                        bgColor="transparent"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Informations patient */}
              <div className="mb-4">
                <div className="text-xs opacity-75 mb-1">PATIENT</div>
                <div className="text-sm font-semibold">{lastName.toUpperCase()}</div>
                <div className="text-sm">{firstName}</div>
                <div className="text-xs opacity-90">{birthDate}</div>
              </div>

              {/* Code d'accès */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-75 mb-1">CODE D'ACCÈS</div>
                    <div className="text-lg font-bold tracking-widest">{codeAcces}</div>
                  </div>
                  <div className="text-xs opacity-75 text-right">
                    <div>Accès sécurisé</div>
                    <div>Usage professionnel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions d'utilisation */}
          <div className="mt-8 max-w-2xl mx-auto print:hidden">
            <Card>
              <CardHeader>
                <CardTitle>Instructions d'utilisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Pour les professionnels de santé :</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Utilisez le code d'accès institution : <strong>{codeAcces}</strong></li>
                    <li>Scannez le QR code pour un accès direct aux directives</li>
                    <li>Vérifiez l'identité du patient avec les informations de la carte</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Recommandations :</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>Imprimez cette carte au format carte de crédit pour la porter facilement</li>
                    <li>Conservez une copie dans votre portefeuille</li>
                    <li>Informez vos proches de l'existence de cette carte</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t print:hidden">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarteAcces;
