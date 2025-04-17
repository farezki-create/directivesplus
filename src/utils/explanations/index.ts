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
 * Uses multiple methods to identify life support questions to ensure they have no explanations
 */
export const getQuestionExplanation = (questionId: string, language: 'en' | 'fr', questionText?: string): string => {
  console.log(`Getting explanation for question ID: ${questionId}, language: ${language}`);
  
  // Check if this is a life support question (which should not have explanations)
  const isLifeSupportQuestion = checkIfLifeSupportQuestion(questionId, questionText, language);
  
  if (isLifeSupportQuestion) {
    console.log(`Life support question detected (ID: ${questionId}) - returning empty explanation`);
    return '';
  }
  
  // For other question types including advanced illness, continue with normal logic
  const explanations = language === 'en' ? questionExplanationsEN : questionExplanationsFR;
  
  // Try to find explanation by exact ID match first
  let explanation = explanations.find(exp => exp.id === questionId);
  
  // If no direct match by ID, try to find by text content if question text is provided
  if (!explanation && questionText) {
    // First try exact match - but only check if the explanation has a question property
    explanation = explanations.find(exp => 
      exp.question && exp.question.trim().toLowerCase() === questionText.trim().toLowerCase()
    );
    
    // If still no match, try partial match (question contains explanation question or vice versa)
    if (!explanation) {
      explanation = explanations.find(exp => 
        exp.question && (
          exp.question.trim().toLowerCase().includes(questionText.trim().toLowerCase()) ||
          questionText.trim().toLowerCase().includes(exp.question.trim().toLowerCase())
        )
      );
    }
  }
  
  // Return empty string if explanation is not found or the explanation text is empty
  if (explanation && explanation.explanation && explanation.explanation.trim() !== '') {
    console.log(`Found explanation for question ID ${questionId}: "${explanation.explanation.substring(0, 30)}..."`);
    return explanation.explanation;
  } else {
    console.log(`No explanation found for question ID ${questionId}`);
    return '';
  }
};

/**
 * Helper function to check if a question is a life support question based on ID or content
 */
function checkIfLifeSupportQuestion(questionId: string, questionText?: string, language?: 'en' | 'fr'): boolean {
  // Manual ID list of all life support questions
  const lifeSupportQuestionIds = [
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
    'ls-21', 'ls-22', 'ls-23', 'ls-24', 'ls-25', 'ls-26', 'ls-27', 'ls-28', 'ls-29', 'ls-30', 'ls-31', 'ls-32',
  ];
  
  // Direct check against the manual list
  if (lifeSupportQuestionIds.includes(questionId)) {
    return true;
  }
  
  // Check by ID range (21-32) which are reserved for life support questions
  if (questionId && !isNaN(parseInt(questionId))) {
    const idNumber = parseInt(questionId);
    if (idNumber >= 21 && idNumber <= 32) {
      return true;
    }
  }
  
  // Check by question content keywords if text is provided
  if (questionText && language) {
    const lifeSupportKeywords = language === 'en' 
      ? ['cpr', 'intensive care', 'intubated', 'ventilation', 'dialysis', 'tracheostomy', 'coma', 'artificial feeding',
         'life support', 'life-sustaining', 'resuscitation']
      : ['rcp', 'réanimation', 'intubé', 'ventilation', 'dialyse', 'trachéotomie', 'coma', 'alimentation artificielle',
         'maintien en vie', 'survie artificielle'];
    
    const containsLifeSupportKeyword = lifeSupportKeywords.some(keyword => 
      questionText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (containsLifeSupportKeyword) {
      return true;
    }
  }
  
  return false;
}

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
