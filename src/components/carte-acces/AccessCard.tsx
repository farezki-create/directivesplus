
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
      className="w-[400px] h-[252px] bg-gradient-to-br from-directiveplus-600 to-directiveplus-800 rounded-2xl p-5 text-white shadow-2xl relative overflow-hidden"
      style={{ aspectRatio: '85.6/53.98' }}
    >
      {/* Pattern décoratif */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Header avec logo et coordonnées patient en haut */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-6 w-6" />
            <span className="text-base font-bold">DirectivesPlus</span>
          </div>
          <p className="text-sm opacity-90 mb-4">Carte d'Accès aux Directives</p>
          
          {/* Informations patient - déplacées en haut */}
          <div>
            <div className="text-xs opacity-75 mb-2 tracking-wide uppercase">PATIENT</div>
            <div className="space-y-1">
              <div className="text-lg font-bold tracking-wide">{lastName.toUpperCase()}</div>
              <div className="text-base font-medium">{firstName}</div>
              <div className="text-sm opacity-90 font-medium">{birthDate}</div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            {qrCodeUrl && (
              <QRCodeSVG 
                value={qrCodeUrl}
                size={120}
                level="M"
                fgColor="#ffffff"
                bgColor="transparent"
              />
            )}
          </div>
        </div>
      </div>

      {/* Code d'accès - déplacé en bas */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <div className="text-xs opacity-75 mb-2 tracking-wide uppercase">CODE D'ACCÈS</div>
            <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2 inline-block">
              <div className="text-lg font-bold tracking-[0.2em] text-white">{codeAcces}</div>
            </div>
          </div>
          <div className="text-xs opacity-75 text-right leading-relaxed">
            <div>Accès sécurisé</div>
            <div>Usage professionnel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
