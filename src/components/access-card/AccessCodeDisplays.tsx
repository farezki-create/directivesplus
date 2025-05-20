
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";

interface AccessCodeDisplaysProps {
  directiveCode: string | null;
  medicalCode: string | null;
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCodeDisplays = ({
  directiveCode,
  medicalCode,
  firstName,
  lastName,
  birthDate
}: AccessCodeDisplaysProps) => {
  return (
    <>
      {directiveCode && (
        <AccessCodeDisplay 
          accessCode={directiveCode}
          firstName={firstName}
          lastName={lastName}
          birthDate={birthDate || ""}
          type="directive"
        />
      )}
      
      {medicalCode && (
        <AccessCodeDisplay 
          accessCode={medicalCode}
          firstName={firstName}
          lastName={lastName}
          birthDate={birthDate || ""}
          type="medical"
        />
      )}
    </>
  );
};

export default AccessCodeDisplays;
