
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
  // FORCEFUL APPROACH: Permanent fix for all life support questions
  
  // === MANUAL ID LIST OF ALL LIFE SUPPORT QUESTIONS ===
  // This is a comprehensive list of all question IDs that should NOT have explanations
  const lifeSupportQuestionIds = [
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32',
    // Also include string versions with potential prefixes
    'ls-21', 'ls-22', 'ls-23', 'ls-24', 'ls-25', 'ls-26', 'ls-27', 'ls-28', 'ls-29', 'ls-30', 'ls-31', 'ls-32',
    // Include any other known life support question IDs here
  ];
  
  // Direct and explicit check against the manual list
  if (lifeSupportQuestionIds.includes(questionId)) {
    console.log(`Life support question FORCED SUPPRESSION by ID match (${questionId}) - returning empty explanation`);
    return '';
  }
  
  // 1. Check by ID range (21-32)
  if (questionId && !isNaN(parseInt(questionId))) {
    const idNumber = parseInt(questionId);
    if (idNumber >= 21 && idNumber <= 32) {
      console.log(`Life support question detected by ID range (${questionId}) - returning empty explanation`);
      return '';
    }
  }
  
  // 2. Check by question content keywords if text is provided
  if (questionText) {
    const lifeSupportKeywords = language === 'en' 
      ? ['cpr', 'intensive care', 'intubated', 'ventilation', 'dialysis', 'tracheostomy', 'coma', 'artificial feeding',
         'life support', 'life-sustaining', 'resuscitation', 'medical interventions']
      : ['rcp', 'réanimation', 'intubé', 'ventilation', 'dialyse', 'trachéotomie', 'coma', 'alimentation artificielle',
         'maintien en vie', 'survie artificielle', 'interventions médicales', 'soins intensifs'];
    
    const containsLifeSupportKeyword = lifeSupportKeywords.some(keyword => 
      questionText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (containsLifeSupportKeyword) {
      console.log(`Life support question detected by keyword in: "${questionText.substring(0, 30)}..." - returning empty explanation`);
      return '';
    }
  }
  
  // 3. Manually check if this is a question from the life support explanations lists
  const lifeSupportExplanations = language === 'en' ? lifeSupportExplanationsEN : lifeSupportExplanationsFR;
  const isLifeSupportQuestion = lifeSupportExplanations.some(explanation => {
    // Match by ID
    if (explanation.id === questionId) return true;
    
    // Match by question text if both are available
    if (explanation.question && questionText) {
      const normalizedQuestionText = questionText.trim().toLowerCase();
      const normalizedExplanationQuestion = explanation.question.trim().toLowerCase();
      
      // Use a more flexible matching approach to catch variations
      if (normalizedQuestionText === normalizedExplanationQuestion || 
          normalizedQuestionText.includes(normalizedExplanationQuestion) ||
          normalizedExplanationQuestion.includes(normalizedQuestionText) ||
          // Check for significant word overlap
          normalizedQuestionText.split(' ').filter(word => 
            word.length > 3 && normalizedExplanationQuestion.includes(word)
          ).length >= 3) {
        return true;
      }
    }
    
    return false;
  });
  
  if (isLifeSupportQuestion) {
    console.log(`Life support question detected by matching question lists - returning empty explanation`);
    return '';
  }
  
  // For non-life support questions, continue with normal logic
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
  
  // Special check: if we somehow got a life support explanation despite all checks, return empty string
  if (explanation && lifeSupportExplanations.some(lsExp => lsExp.id === explanation?.id)) {
    console.log(`FINAL SAFETY CHECK: Caught life support explanation (ID: ${explanation.id}) - returning empty string`);
    return '';
  }
  
  // Return empty string if explanation is not found or the explanation text is empty
  return (explanation && explanation.explanation && explanation.explanation.trim() !== '') 
    ? explanation.explanation 
    : '';
};

/**
 * Helper function to check if a question is a life support question based on its content
 */
function checkIfLifeSupportQuestion(questionText: string, language: 'en' | 'fr'): boolean {
  const lifeSupport = language === 'en' ? lifeSupportExplanationsEN : lifeSupportExplanationsFR;
  
  // Check against life support questions list
  for (const question of lifeSupport) {
    if (question.question) {
      const normalizedQuestionText = questionText.trim().toLowerCase();
      const normalizedLifeSupportQuestion = question.question.trim().toLowerCase();
      
      // Exact match or one contains the other
      if (normalizedQuestionText === normalizedLifeSupportQuestion ||
          normalizedQuestionText.includes(normalizedLifeSupportQuestion) ||
          normalizedLifeSupportQuestion.includes(normalizedQuestionText)) {
        return true;
      }
    }
  }
  
  // Check against keywords specific to life support questions
  const lifeSupportKeywords = language === 'en' 
    ? ['cpr', 'intensive care', 'intubated', 'ventilation', 'dialysis', 'tracheostomy', 'coma', 'artificial feeding']
    : ['rcp', 'réanimation', 'intubé', 'ventilation', 'dialyse', 'trachéotomie', 'coma', 'alimentation artificielle'];
  
  const normalizedText = questionText.trim().toLowerCase();
  return lifeSupportKeywords.some(keyword => normalizedText.includes(keyword));
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
