
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Print, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    window.print();
  };

  const handleDownload = () => {
    // Implémenter le téléchargement de la carte en PDF
    toast({
      title: "Téléchargement",
      description: "Fonctionnalité de téléchargement en cours de développement",
    });
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
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Print size={16} />
              Imprimer
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Télécharger PDF
            </Button>
          </div>

          {/* Carte d'accès */}
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-directiveplus-200 shadow-lg bg-gradient-to-br from-white to-directiveplus-50">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <CreditCard className="h-6 w-6 text-directiveplus-600" />
                  <span className="text-xl font-bold text-directiveplus-600">DirectivesPlus</span>
                </div>
                <CardTitle className="text-lg text-gray-800">
                  Carte d'Accès Professionnel
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informations personnelles */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-800 mb-3">Informations Patient</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Nom :</span>
                      <span className="ml-2 font-semibold">{lastName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Prénom :</span>
                      <span className="ml-2 font-semibold">{firstName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date de naissance :</span>
                      <span className="ml-2 font-semibold">{birthDate}</span>
                    </div>
                  </div>
                </div>

                {/* Code d'accès institution */}
                <div className="bg-directiveplus-50 p-4 rounded-lg border border-directiveplus-200">
                  <h3 className="font-semibold text-directiveplus-800 mb-2">Code d'Accès Institution</h3>
                  <div className="text-center">
                    <span className="text-2xl font-mono font-bold text-directiveplus-600">
                      {codeAcces}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg border text-center">
                  <h3 className="font-semibold text-gray-800 mb-3">Accès Rapide aux Directives</h3>
                  {qrCodeUrl && (
                    <div className="flex justify-center">
                      <QRCodeSVG 
                        value={qrCodeUrl}
                        size={120}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Scanner ce QR code pour accéder aux directives
                  </p>
                </div>

                {/* Informations légales */}
                <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
                  <p>Document officiel - Usage professionnel uniquement</p>
                  <p>Accès tracé et sécurisé conforme à la réglementation</p>
                </div>
              </CardContent>
            </Card>
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

      {/* Styles d'impression */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          .max-w-md { max-width: 85mm; }
          .mx-auto { margin: 0 auto; }
          .shadow-lg { box-shadow: none; }
          .border-2 { border-width: 1px; }
        }
      `}</style>
    </div>
  );
};

export default CarteAcces;
