import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  console.log('Processing error:', error);
  
  if (error instanceof AuthApiError) {
    try {
      // First try to parse the error message as JSON
      const errorBody = JSON.parse(error.message);
      console.log('Parsed error body:', errorBody);
      
      switch (errorBody.code) {
        case "user_already_exists":
          return "Un compte existe déjà avec cet email";
        case "invalid_credentials":
          return "Email ou mot de passe incorrect";
        case "email_not_confirmed":
          return "Veuillez vérifier votre email pour confirmer votre compte";
        case "over_email_send_rate_limit":
          return "Pour des raisons de sécurité, veuillez patienter une minute avant de réessayer";
        default:
          console.log('Unhandled API error code:', errorBody.code);
          return "Une erreur s'est produite. Veuillez réessayer.";
      }
    } catch (e) {
      // If parsing fails, handle the error message directly
      console.log('Error message is not JSON, handling as string:', error.message);
      
      if (error.message.includes("Invalid login credentials")) {
        return "Email ou mot de passe incorrect";
      }
      if (error.message.includes("Email not confirmed")) {
        return "Veuillez vérifier votre email pour confirmer votre compte";
      }
      if (error.message.includes("Password should be at least")) {
        return "Le mot de passe doit contenir au moins 6 caractères";
      }
      if (error.message.includes("User already registered")) {
        return "Un compte existe déjà avec cet email";
      }
      
      console.log('Unhandled string error message:', error.message);
      return "Une erreur s'est produite. Veuillez réessayer.";
    }
  }
  
  console.log('Non-AuthApiError:', error);
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};