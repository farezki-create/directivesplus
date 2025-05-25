
import Header from "@/components/Header";
import { BackButton } from "../components/BackButton";
import { EmailVerificationForm } from "../EmailVerificationForm";

interface EmailVerificationViewProps {
  email: string;
  onVerificationComplete: () => void;
  onBackToRegister: () => void;
}

export const EmailVerificationView = ({
  email,
  onVerificationComplete,
  onBackToRegister,
}: EmailVerificationViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          <EmailVerificationForm
            email={email}
            onVerificationComplete={onVerificationComplete}
            onBackToRegister={onBackToRegister}
          />
        </div>
      </main>
    </div>
  );
};
