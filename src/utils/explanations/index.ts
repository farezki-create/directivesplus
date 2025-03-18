
import { generalExplanationsEN, generalExplanationsFR } from './generalExplanations';
import { lifeSupportExplanationsEN, lifeSupportExplanationsFR } from './lifeSupportExplanations';
import { advancedIllnessExplanationsEN, advancedIllnessExplanationsFR } from './advancedIllnessExplanations';

// Define the explanation type
interface QuestionExplanation {
  id: string;
  explanation: string;
  question?: string; // Make question property optional
}

// Combine all explanations
const questionExplanationsEN: QuestionExplanation[] = [
  ...generalExplanationsEN,
  ...lifeSupportExplanationsEN,
  ...advancedIllnessExplanationsEN
];

const questionExplanationsFR: QuestionExplanation[] = [
  ...generalExplanationsFR,
  ...lifeSupportExplanationsFR,
  ...advancedIllnessExplanationsFR
];

/**
 * Gets the explanation for a question with the given ID in the specified language
 * Now also attempts to match by question content if ID matching fails
 */
export const getQuestionExplanation = (questionId: string, language: 'en' | 'fr', questionText?: string): string => {
  // Log for debugging
  console.log(`Getting explanation for question ID: ${questionId} in language: ${language}`);
  if (questionText) {
    console.log(`Question text: "${questionText}"`);
  }
  
  const explanations = language === 'en' ? questionExplanationsEN : questionExplanationsFR;
  
  // Try to find explanation by exact ID match first
  let explanation = explanations.find(exp => exp.id === questionId);
  
  // If no direct match by ID, try to find by text content if question text is provided
  if (!explanation && questionText) {
    console.log("No direct ID match, attempting to match by question content");
    
    // First try exact match - but only check if the explanation has a question property
    explanation = explanations.find(exp => 
      exp.question && exp.question.trim().toLowerCase() === questionText.trim().toLowerCase()
    );
    
    // If still no match, try partial match (question contains explanation question or vice versa)
    if (!explanation) {
      console.log("No exact content match, trying partial match");
      explanation = explanations.find(exp => 
        exp.question && (
          exp.question.trim().toLowerCase().includes(questionText.trim().toLowerCase()) ||
          questionText.trim().toLowerCase().includes(exp.question.trim().toLowerCase())
        )
      );
    }
    
    if (explanation) {
      console.log(`Found match by question content: "${explanation.question}"`);
    }
  }
  
  // Debug logs to see what's happening
  console.log(`Found explanation for ID ${questionId}:`, explanation);
  if (explanation) {
    console.log(`Explanation text is: "${explanation.explanation}"`);
    console.log(`Explanation text is empty:`, !explanation.explanation || explanation.explanation.trim() === '');
  }
  
  // Return empty string if explanation is not found or the explanation text is empty
  return (explanation && explanation.explanation && explanation.explanation.trim() !== '') 
    ? explanation.explanation 
    : '';
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
