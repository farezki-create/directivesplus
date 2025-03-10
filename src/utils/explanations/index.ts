
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
  const explanation = explanations.find(exp => exp.id === questionId);
  
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
