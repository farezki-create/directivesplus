import { AuthForm } from "@/components/AuthForm";
import { HealthcareHeader } from "@/components/healthcare/HealthcareHeader";
import { useHealthcareAuth } from "@/hooks/useHealthcareAuth";

const Healthcare = () => {
  const { isSignUp, setIsSignUp, handleSubmit } = useHealthcareAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <HealthcareHeader isSignUp={isSignUp} />
      
      <div className="w-full max-w-md space-y-8">
        <AuthForm
          isSignUp={isSignUp}
          onSubmit={handleSubmit}
          onToggleMode={() => setIsSignUp(!isSignUp)}
          isHealthcareProfessional={true}
        />
      </div>
    </div>
  );
};

export default Healthcare;