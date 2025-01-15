import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/auth-errors";
import { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === "SIGNED_IN" && session) {
        console.log('User signed in, redirecting to home page');
        // Store a flag in sessionStorage to indicate that we should show the dialog
        sessionStorage.setItem('showExplanationDialog', 'true');
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, navigate]);

  const handleError = (error: AuthError) => {
    console.error('Auth error:', error);
    const message = getErrorMessage(error);
    
    // Check if the error is about existing user
    if (error.message.includes('user_already_exists')) {
      toast.error("Un compte existe déjà avec cet email. Veuillez vous connecter.");
      return true;
    }
    
    toast.error(message);
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <AuthForm 
          isSignUp={false} 
          onSubmit={() => {}} 
          onToggleMode={() => {}}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default Auth;