
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRegisterForm } from "./hooks/useRegisterForm";
import { RegisterFields } from "./components/RegisterFields";
import { PasswordFields } from "./components/PasswordFields";

interface RegisterFormProps {
  onVerificationSent: (email: string) => void;
}

export const RegisterForm = ({ onVerificationSent }: RegisterFormProps) => {
  const { form, loading, handleSignUp } = useRegisterForm(onVerificationSent);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <RegisterFields />
        <PasswordFields />
        
        <Button disabled={loading} type="submit" className="w-full flex items-center justify-center">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Inscription..." : "S'inscrire"}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          * Champs obligatoires
        </p>
      </form>
    </Form>
  );
};
