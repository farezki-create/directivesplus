
import AccessCard from "@/components/card/AccessCard";
import LoadingState from "@/components/questionnaire/LoadingState";

interface AccessCardSectionProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
  directiveCode: string | null;
  medicalCode: string | null;
  isCodesLoading: boolean;
}

const AccessCardSection = ({ 
  firstName, 
  lastName, 
  birthDate,
  directiveCode,
  medicalCode,
  isCodesLoading
}: AccessCardSectionProps) => {
  return (
    <div className="mb-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Votre carte d'accès personnelle</h2>
      <p className="text-gray-600 mb-6">
        Cette carte contient vos codes d'accès pour vos directives anticipées et données médicales. 
        Vous pouvez la télécharger ou l'imprimer pour l'avoir toujours avec vous.
      </p>
      
      {isCodesLoading ? (
        <div className="py-8 text-center">
          <LoadingState loading={true} message="Génération de votre carte d'accès..." />
        </div>
      ) : (
        <AccessCard 
          firstName={firstName} 
          lastName={lastName} 
          birthDate={birthDate}
          directiveCode={directiveCode}
          medicalCode={medicalCode}
        />
      )}
    </div>
  );
};

export default AccessCardSection;
