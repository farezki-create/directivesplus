
import { updateGeneralOpinionQuestions } from "./updateGeneralOpinionQuestions";

// This exposes functions that can be called from the browser console
// for development and admin purposes

// Make sure this is only available in development
if (process.env.NODE_ENV === "development") {
  window.devTools = {
    updateGeneralOpinionQuestions,
  };
}

// Add TypeScript declaration
declare global {
  interface Window {
    devTools?: {
      updateGeneralOpinionQuestions: typeof updateGeneralOpinionQuestions;
    };
  }
}
