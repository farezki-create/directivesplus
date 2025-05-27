
import { QRCodeSVG } from "qrcode.react";
import { CreditCard, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  codeAcces: string;
  qrCodeUrl: string;
  isGenerating?: boolean;
  isQrCodeValid?: boolean;
}

const AccessCard = ({
  firstName,
  lastName,
  birthDate,
  codeAcces,
  qrCodeUrl,
  isGenerating = false,
  isQrCodeValid = false
}: AccessCardProps) => {
  console.log("AccessCard - Rendering with enhanced props:", {
    firstName,
    lastName,
    birthDate,
    codeAcces,
    qrCodeUrl: qrCodeUrl?.substring(0, 100) + (qrCodeUrl?.length > 100 ? '...' : ''),
    qrCodeUrlLength: qrCodeUrl?.length || 0,
    isGenerating,
    isQrCodeValid,
    urlType: qrCodeUrl?.includes('/pdf-viewer') ? 'viewer' : 
             qrCodeUrl?.startsWith('http') && qrCodeUrl?.includes('.pdf') ? 'direct_pdf' : 'other'
  });

  const handleQrCodeClick = () => {
    if (isQrCodeValid && !isGenerating) {
      console.log("AccessCard - Opening URL:", qrCodeUrl);
      try {
        window.open(qrCodeUrl, '_blank');
      } catch (error) {
        console.error("AccessCard - Error opening URL:", error);
      }
    }
  };

  const handleRefreshQrCode = () => {
    console.log("AccessCard - Refreshing page to regenerate QR code");
    window.location.reload();
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
      <div className="mt-1 mb-10">
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
                className={`bg-white rounded-lg p-3 transition-all ${
                  isQrCodeValid && !isGenerating ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                }`} 
                onClick={handleQrCodeClick}
              >
                {isGenerating ? (
                  <div className="w-[85px] h-[85px] bg-white bg-opacity-30 rounded flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-directiveplus-600 animate-spin mb-2" />
                    <div className="text-xs text-directiveplus-600 font-medium">Génération...</div>
                  </div>
                ) : isQrCodeValid ? (
                  <QRCodeSVG 
                    value={qrCodeUrl} 
                    size={85} 
                    level="M" 
                    fgColor="#000000" 
                    bgColor="#ffffff" 
                    includeMargin={false} 
                  />
                ) : (
                  <div className="w-[85px] h-[85px] bg-white bg-opacity-30 rounded flex flex-col items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white opacity-70 mb-1" />
                    <div onClick={handleRefreshQrCode} className="cursor-pointer hover:opacity-100">
                      <RefreshCw className="w-4 h-4 text-white opacity-70" />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-center mt-1 opacity-75">
                {isGenerating ? (
                  <span>Génération...</span>
                ) : isQrCodeValid ? (
                  <span>Scanner pour PDF</span>
                ) : (
                  <span>Code non disponible</span>
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
              <div className="font-medium">
                {isGenerating ? "Préparation..." : isQrCodeValid ? "Accès direct PDF" : "En attente"}
              </div>
              <div>{isQrCodeValid ? "Scanner le QR code" : "QR code en cours"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
