
import { QRCodeSVG } from "qrcode.react";
import { CreditCard, AlertCircle, ExternalLink } from "lucide-react";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  codeAcces: string;
  qrCodeUrl: string;
}

const AccessCard = ({ firstName, lastName, birthDate, codeAcces, qrCodeUrl }: AccessCardProps) => {
  console.log("AccessCard - Rendering with:", {
    firstName,
    lastName,
    birthDate,
    codeAcces,
    qrCodeUrl,
    qrCodeUrlLength: qrCodeUrl?.length || 0
  });

  // Validation simple de l'URL
  const isQrCodeValid = qrCodeUrl && 
                       qrCodeUrl.trim() !== '' && 
                       (qrCodeUrl.startsWith('http://') || qrCodeUrl.startsWith('https://'));
  
  if (!isQrCodeValid) {
    console.warn("AccessCard - QR code URL is empty or invalid:", qrCodeUrl);
  }

  const handleQrCodeClick = () => {
    if (isQrCodeValid) {
      console.log("AccessCard - Opening QR URL:", qrCodeUrl);
      try {
        // Ouvrir dans un nouvel onglet
        window.open(qrCodeUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error("AccessCard - Error opening URL:", error);
      }
    } else {
      console.error("AccessCard - Cannot open invalid QR URL:", qrCodeUrl);
    }
  };

  return (
    <div 
      id="access-card"
      className="w-[400px] h-[252px] bg-gradient-to-br from-directiveplus-600 to-directiveplus-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
      style={{ aspectRatio: '85.6/53.98' }}
    >
      {/* Pattern décoratif */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Header avec logo en haut */}
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="h-4 w-4" />
        <span className="text-xs font-bold">DirectivesPlus</span>
        <span className="text-xs opacity-90 ml-2">Carte d'Accès aux Directives</span>
      </div>
      
      {/* Section des coordonnées patient */}
      <div className="mt-1 mb-12">
        <div className="bg-white bg-opacity-15 rounded-lg p-3">
          <div className="text-xs opacity-90 mb-2 tracking-wide uppercase font-medium">PATIENT</div>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-lg font-bold tracking-wide mb-1">{lastName.toUpperCase()}</div>
              <div className="text-sm font-medium mb-1">{firstName}</div>
              <div className="text-xs opacity-90 font-medium">{birthDate}</div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div 
                className={`bg-white bg-opacity-20 rounded-lg p-2 transition-all ${
                  isQrCodeValid ? 'cursor-pointer hover:bg-opacity-30' : 'cursor-not-allowed'
                }`}
                onClick={handleQrCodeClick}
                title={isQrCodeValid ? "Cliquer pour ouvrir les directives" : "QR Code non disponible"}
              >
                {isQrCodeValid ? (
                  <QRCodeSVG 
                    value={qrCodeUrl}
                    size={70}
                    level="M"
                    fgColor="#ffffff"
                    bgColor="transparent"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[70px] h-[70px] bg-white bg-opacity-30 rounded flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white opacity-70" />
                  </div>
                )}
              </div>
              <div className="text-xs text-center mt-1 opacity-75">
                {isQrCodeValid ? (
                  <div className="flex items-center justify-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Scanner</span>
                  </div>
                ) : (
                  "Non disponible"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code d'accès */}
      <div className="absolute bottom-4 left-6 right-6">
        <div className="bg-white bg-opacity-15 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="text-xs opacity-90 mb-1 tracking-wide uppercase font-medium">CODE D'ACCÈS</div>
              <div className="bg-white bg-opacity-25 rounded-lg px-3 py-2 inline-block border border-white border-opacity-30">
                <div className="text-sm font-bold tracking-[0.2em] text-white font-mono">{codeAcces}</div>
              </div>
            </div>
            <div className="text-xs opacity-90 text-right leading-relaxed ml-4">
              <div className="font-medium">Accès sécurisé</div>
              <div>Usage professionnel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
