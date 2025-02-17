
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  console.log('Traitement erreur:', error);
  
  if (error instanceof AuthApiError) {
    try {
      const errorBody = JSON.parse(error.message);
      console.log('Corps erreur JSON:', errorBody);
      
      switch (errorBody.code) {
        case "invalid_credentials":
          return "Email ou mot de passe incorrect. Si vous venez de créer votre compte, vérifiez que vous avez validé votre email.";
        case "user_already_exists":
          return "Un compte existe déjà avec cet email";
        case "email_not_confirmed":
          return "Veuillez vérifier votre email pour confirmer votre compte";
        case "password_too_short":
          return "Le mot de passe doit contenir au moins 6 caractères";
        case "weak_password":
          return "Le mot de passe est trop faible. Utilisez au moins une majuscule, une minuscule et un chiffre.";
        default:
          console.log('Code erreur non géré:', errorBody.code);
          return "Une erreur s'est produite. Veuillez réessayer.";
      }
    } catch (e) {
      console.log('Message erreur non JSON:', error.message);
      
      if (error.message.includes("Invalid login credentials")) {
        return "Email ou mot de passe incorrect. Si vous venez de créer votre compte, vérifiez que vous avez validé votre email.";
      }
      if (error.message.includes("Email not confirmed")) {
        return "Veuillez vérifier votre email pour confirmer votre compte";
      }
      if (error.message.includes("Password should be at least 6 characters")) {
        return "Le mot de passe doit contenir au moins 6 caractères";
      }
      
      console.log('Message erreur non géré:', error.message);
      return "Une erreur s'est produite. Veuillez réessayer.";
    }
  }
  
  console.log('Erreur non-AuthApi:', error);
  return "Une erreur inattendue s'est produite. Veuillez réessayer.";
};
