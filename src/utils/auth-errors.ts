import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  console.log('Processing error:', error);
  
  if (error instanceof AuthApiError) {
    try {
      const errorBody = JSON.parse(error.message);
      switch (errorBody.code) {
        case "user_already_exists":
          return "Un compte existe déjà avec cet email";
        case "invalid_credentials":
          return "Email ou mot de passe incorrect";
        case "email_not_confirmed":
          return "Veuillez vérifier votre email pour confirmer votre compte";
        default:
          console.log('Unhandled API error:', errorBody);
          return "Une erreur s'est produite. Veuillez réessayer.";
      }
    } catch (e) {
      // If error.message is not JSON
      switch (error.message) {
        case "Invalid login credentials":
          return "Email ou mot de passe incorrect";
        case "Email not confirmed":
          return "Veuillez vérifier votre email pour confirmer votre compte";
        case "Password should be at least 6 characters":
          return "Le mot de passe doit contenir au moins 6 caractères";
        default:
          console.log('Non-JSON API error:', error.message);
          return "Une erreur s'est produite. Veuillez réessayer.";
      }
    }
  }
  
  console.log('Non-API error:', error.message);
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};