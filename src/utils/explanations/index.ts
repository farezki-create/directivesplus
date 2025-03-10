
import { generalExplanationsEN, generalExplanationsFR } from './generalExplanations';
import { lifeSupportExplanationsEN, lifeSupportExplanationsFR } from './lifeSupportExplanations';
import { advancedIllnessExplanationsEN, advancedIllnessExplanationsFR } from './advancedIllnessExplanations';

// Combine all explanations
const questionExplanationsEN = [
  ...generalExplanationsEN,
  ...lifeSupportExplanationsEN,
  ...advancedIllnessExplanationsEN
];

const questionExplanationsFR = [
  ...generalExplanationsFR,
  ...lifeSupportExplanationsFR,
  ...advancedIllnessExplanationsFR
];

/**
 * Gets the explanation for a question with the given ID in the specified language
 */
export const getQuestionExplanation = (questionId: string, language: 'en' | 'fr'): string => {
  // Log for debugging
  console.log(`Getting explanation for question ID: ${questionId} in language: ${language}`);
  
  const explanations = language === 'en' ? questionExplanationsEN : questionExplanationsFR;
  
  // Try to find explanation by exact ID match first
  let explanation = explanations.find(exp => exp.id === questionId);
  
  if (!explanation) {
    // If no direct match, and it looks like a UUID, try to find by position for advanced illness
    // by checking if the question's display_order_str matches an explanation's numeric ID
    if (questionId.includes('-')) {
      // This is for logging only - explanations should be found by display_order_str
      console.log("No direct match found for UUID, will check other methods");
    }
  }
  
  // Log the result
  console.log(`Found explanation:`, explanation);
  
  return explanation ? explanation.explanation : '';
};

// Export everything for potential direct access
export {
  generalExplanationsEN,
  generalExplanationsFR,
  lifeSupportExplanationsEN,
  lifeSupportExplanationsFR,
  advancedIllnessExplanationsEN,
  advancedIllnessExplanationsFR,
  questionExplanationsEN,
  questionExplanationsFR
};
