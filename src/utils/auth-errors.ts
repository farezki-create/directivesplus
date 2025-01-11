import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  console.log('Processing error:', error);
  
  if (error instanceof AuthApiError) {
    switch (error.code) {
      case "invalid_credentials":
        return "Email ou mot de passe incorrect.";
      case "email_not_confirmed":
        return "Veuillez vérifier votre email pour confirmer votre compte.";
      case "invalid_grant":
        return "Email ou mot de passe incorrect.";
      case "user_already_exists":
        return "Un compte existe déjà avec cet email. Veuillez vous connecter.";
      case "password_too_short":
        return "Le mot de passe doit contenir au moins 8 caractères.";
      case "weak_password":
        return "Le mot de passe est trop faible. Il doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
      case "passwords_mismatch":
        return "Les mots de passe ne correspondent pas.";
      default:
        console.log('Unhandled API error:', error.code, error.message);
        return "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
    }
  }
  
  console.log('Non-API error:', error.message);
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};