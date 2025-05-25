
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InstructionsCardProps {
  codeAcces: string;
}

const InstructionsCard = ({ codeAcces }: InstructionsCardProps) => {
  return (
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
  );
};

export default InstructionsCard;
