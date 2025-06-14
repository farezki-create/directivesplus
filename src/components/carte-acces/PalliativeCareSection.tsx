
import { PalliativeCareAccessCard } from "./PalliativeCareAccessCard";

interface PalliativeCareSectionProps {
  userId?: string;
  firstName: string;
  lastName: string;
}

const PalliativeCareSection = ({ userId, firstName, lastName }: PalliativeCareSectionProps) => {
  return (
    <div className="space-y-6 border-t pt-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-pink-800 mb-2">
          Carte d'Accès Suivi Palliatif
        </h2>
        <p className="text-gray-600">
          Pour le partage sécurisé du suivi des symptômes avec les professionnels
        </p>
      </div>

      <PalliativeCareAccessCard 
        patientId={userId}
        patientName={firstName && lastName ? `${firstName} ${lastName}` : undefined}
      />
    </div>
  );
};

export default PalliativeCareSection;
