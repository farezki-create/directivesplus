import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { directiveEncryption } from "@/utils/directives/directiveEncryption";

export interface AdvanceDirective {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  access_code?: string;
}

export function useAdvanceDirectives(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [directives, setDirectives] = useState<AdvanceDirective[]>([]);
  const { toast } = useToast();

  const fetchUserDirectives = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('advance_directives')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setDirectives(data || []);
    } catch (error) {
      console.error("Error fetching directives:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos directives anticipées",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveDirective = async (content: string): Promise<string | null> => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder vos directives",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      const accessCode = await directiveEncryption.storeDirective(userId, content);
      
      if (accessCode) {
        toast({
          title: "Succès",
          description: "Vos directives anticipées ont été sauvegardées",
        });
        
        await fetchUserDirectives();
        return accessCode;
      }
      return null;
    } catch (error) {
      console.error("Error saving directive:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos directives",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const requestAccess = async (
    directiveId: string, 
    name: string, 
    birthdate: string, 
    accessCode: string
  ) => {
    try {
      const result = await directiveEncryption.verifyAccess(
        directiveId,
        name,
        birthdate,
        accessCode
      );
      
      if (!result || result.length === 0 || !result[0].is_valid) {
        throw new Error("Accès refusé");
      }
      
      return result[0].directive_content;
    } catch (error) {
      console.error("Access request failed:", error);
      toast({
        title: "Erreur d'accès",
        description: "Les informations fournies ne permettent pas d'accéder à ce document",
        variant: "destructive"
      });
      return null;
    }
  };
  
  return {
    directives,
    isLoading,
    fetchUserDirectives,
    saveDirective,
    requestAccess
  };
}
