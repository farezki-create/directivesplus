
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
      
      {/* Header avec logo et coordonnées patient en haut */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5" />
            <span className="text-sm font-bold">DirectivesPlus</span>
          </div>
          <p className="text-xs opacity-90 mb-6">Carte d'Accès aux Directives</p>
          
          {/* Informations patient - mieux espacées */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="text-xs opacity-80 mb-2 tracking-wide uppercase font-medium">PATIENT</div>
            <div className="space-y-1">
              <div className="text-base font-bold tracking-wide">{lastName.toUpperCase()}</div>
              <div className="text-sm font-medium">{firstName}</div>
              <div className="text-xs opacity-90 font-medium">{birthDate}</div>
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div className="bg-white bg-opacity-15 rounded-lg p-2">
            {qrCodeUrl && (
              <QRCodeSVG 
                value={qrCodeUrl}
                size={100}
                level="M"
                fgColor="#ffffff"
                bgColor="transparent"
              />
            )}
          </div>
        </div>
      </div>

      {/* Code d'accès - bien séparé en bas */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <div className="text-xs opacity-80 mb-2 tracking-wide uppercase font-medium">CODE D'ACCÈS</div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-3 inline-block border border-white border-opacity-20">
              <div className="text-xl font-bold tracking-[0.3em] text-white font-mono">{codeAcces}</div>
            </div>
          </div>
          <div className="text-xs opacity-80 text-right leading-relaxed ml-4">
            <div className="font-medium">Accès sécurisé</div>
            <div>Usage professionnel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
