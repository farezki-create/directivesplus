
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
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span className="text-base font-bold">DirectivesPlus</span>
          </div>
          <p className="text-sm opacity-90">Carte d'Accès aux Directives</p>
        </div>
        <div className="text-right">
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            {qrCodeUrl && (
              <QRCodeSVG 
                value={qrCodeUrl}
                size={80}
                level="M"
                fgColor="#ffffff"
                bgColor="transparent"
              />
            )}
          </div>
        </div>
      </div>

      {/* Informations patient */}
      <div className="mb-6">
        <div className="text-sm opacity-75 mb-1">PATIENT</div>
        <div className="text-base font-semibold">{lastName.toUpperCase()}</div>
        <div className="text-base">{firstName}</div>
        <div className="text-sm opacity-90">{birthDate}</div>
      </div>

      {/* Code d'accès */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm opacity-75 mb-1">CODE D'ACCÈS</div>
            <div className="text-xl font-bold tracking-widest">{codeAcces}</div>
          </div>
          <div className="text-sm opacity-75 text-right">
            <div>Accès sécurisé</div>
            <div>Usage professionnel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
