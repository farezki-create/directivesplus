
import { updateGeneralOpinionQuestions } from "./updateGeneralOpinionQuestions";

// This exposes functions that can be called from the browser console
// for development and admin purposes

// Always make available regardless of environment
window.devTools = {
  updateGeneralOpinionQuestions,
};

// Output a message to the console to indicate the tools are available
console.log("Dev Tools initialized! You can use window.devTools.updateGeneralOpinionQuestions() to update the questions.");

// Add TypeScript declaration
declare global {
  interface Window {
    devTools: {
      updateGeneralOpinionQuestions: typeof updateGeneralOpinionQuestions;
    };
  }
}
