import { supabase } from "@/integrations/supabase/client";

export async function importQuestions(file: File, type: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const { data: { functionUrl } } = await supabase.functions.invoke('import-questions', {
    body: formData,
  });

  return functionUrl;
}