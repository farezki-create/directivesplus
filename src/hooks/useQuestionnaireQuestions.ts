import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Question = Database['public']['Tables']['questionnaire_questions']['Row'];

const fetchQuestions = async (category: string) => {
  console.log(`Fetching ${category} questions...`);
  const { data, error } = await supabase
    .from('questionnaire_questions')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error(`Error fetching ${category} questions:`, error);
    throw error;
  }
  
  const validQuestions = data?.filter(q => q.question_text?.trim()) || [];
  console.log(`Fetched ${category} questions:`, validQuestions);
  return validQuestions as Question[];
};

export const useQuestionnaireQuestions = (category: string) => {
  return useQuery({
    queryKey: [`${category}Questions`],
    queryFn: () => fetchQuestions(category),
  });
};