import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  console.log('Processing error:', error);
  
  if (error instanceof AuthApiError) {
    switch (error.message) {
      case "Invalid login credentials":
        return "Email ou mot de passe incorrect";
      case "Email not confirmed":
        return "Veuillez vérifier votre email pour confirmer votre compte";
      case "User already registered":
        return "Un compte existe déjà avec cet email";
      case "Password should be at least 6 characters":
        return "Le mot de passe doit contenir au moins 6 caractères";
      default:
        console.log('Unhandled API error:', error.message);
        return "Une erreur s'est produite. Veuillez réessayer.";
    }
  }
  
  console.log('Non-API error:', error.message);
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};