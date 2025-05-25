
import { QRCodeSVG } from "qrcode.react";
import { CreditCard } from "lucide-react";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  codeAcces: string;
  qrCodeUrl: string;
}

const AccessCard = ({ firstName, lastName, birthDate, codeAcces, qrCodeUrl }: AccessCardProps) => {
  return (
    <div 
      id="access-card"
      className="w-[400px] h-[252px] bg-gradient-to-br from-directiveplus-600 to-directiveplus-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
      style={{ aspectRatio: '85.6/53.98' }}
    >
      {/* Pattern décoratif - réduit l'opacité pour moins de distraction */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Header avec logo en haut */}
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="h-4 w-4" />
        <span className="text-xs font-bold">DirectivesPlus</span>
        <span className="text-xs opacity-90 ml-2">Carte d'Accès aux Directives</span>
      </div>
      
      {/* Section des coordonnées patient - remontée encore plus haut */}
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
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                {qrCodeUrl && (
                  <QRCodeSVG 
                    value={qrCodeUrl}
                    size={70}
                    level="M"
                    fgColor="#ffffff"
                    bgColor="transparent"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code d'accès - taille très réduite, tout en bas */}
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
