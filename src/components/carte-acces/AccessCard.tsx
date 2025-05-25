
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
      className="w-[400px] h-[252px] bg-gradient-to-br from-directiveplus-600 to-directiveplus-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden border border-directiveplus-500"
      style={{ aspectRatio: '85.6/53.98' }}
    >
      {/* Pattern décoratif amélioré */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white opacity-3 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Header amélioré */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-7 w-7 text-white" />
            <span className="text-lg font-bold tracking-wide">DirectivesPlus</span>
          </div>
          <p className="text-sm opacity-90 font-medium">Carte d'Accès aux Directives</p>
        </div>
        <div className="text-right">
          <div className="bg-white bg-opacity-15 rounded-xl p-3 backdrop-blur-sm border border-white border-opacity-20">
            {qrCodeUrl && (
              <QRCodeSVG 
                value={qrCodeUrl}
                size={110}
                level="H"
                fgColor="#ffffff"
                bgColor="transparent"
                includeMargin={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Informations patient améliorées */}
      <div className="mb-6">
        <div className="text-xs opacity-75 mb-2 font-semibold tracking-wider">PATIENT</div>
        <div className="space-y-1">
          <div className="text-lg font-bold tracking-wide">{lastName.toUpperCase()}</div>
          <div className="text-base font-medium">{firstName}</div>
          <div className="text-sm opacity-90 font-medium">{birthDate}</div>
        </div>
      </div>

      {/* Code d'accès amélioré */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <div className="text-xs opacity-75 mb-2 font-semibold tracking-wider">CODE D'ACCÈS</div>
            <div className="text-2xl font-bold tracking-[0.2em] text-white drop-shadow-sm">{codeAcces}</div>
          </div>
          <div className="text-xs opacity-75 text-right font-medium">
            <div className="mb-1">Accès sécurisé</div>
            <div>Usage professionnel</div>
          </div>
        </div>
      </div>

      {/* Bord subtil pour améliorer la définition */}
      <div className="absolute inset-0 rounded-2xl border border-white border-opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default AccessCard;
