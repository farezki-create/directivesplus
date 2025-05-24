
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

interface UrlAccessParams {
  code: string | null;
  nom: string | null;
  prenom: string | null;
  naissance: string | null;
  hasAllParams: boolean;
}

export const useUrlAccessParams = (): UrlAccessParams => {
  const [searchParams] = useSearchParams();
  
  const params = useMemo(() => {
    const code = searchParams.get("code");
    const nom = searchParams.get("nom");
    const prenom = searchParams.get("prenom");
    const naissance = searchParams.get("naissance");
    
    return {
      code,
      nom,
      prenom,
      naissance,
      hasAllParams: !!(code && nom && prenom && naissance)
    };
  }, [searchParams]);
  
  console.log("URL params extracted:", params);
  return params;
};
