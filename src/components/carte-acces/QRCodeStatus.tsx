
interface QRCodeStatusProps {
  isGenerating: boolean;
  isQrCodeValid: boolean;
}

const QRCodeStatus = ({ isGenerating, isQrCodeValid }: QRCodeStatusProps) => {
  if (isGenerating) {
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">🔄 Génération du QR Code en cours</h3>
        <p className="text-sm text-blue-700">
          Nous préparons votre carte d'accès avec le QR code pointant vers vos directives. 
          Cela peut prendre quelques secondes...
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="font-medium text-green-800 mb-2">
        {isQrCodeValid ? "✅ QR Code généré avec succès" : "⚠️ QR Code en préparation"}
      </h3>
      <p className="text-sm text-green-700">
        {isQrCodeValid 
          ? "Votre carte d'accès est prête avec un QR code fonctionnel."
          : "Le QR code sera généré automatiquement. Actualisation en cours..."
        }
      </p>
    </div>
  );
};

export default QRCodeStatus;
