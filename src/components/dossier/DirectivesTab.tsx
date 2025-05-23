import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDossierStore } from "@/store/dossierStore";
import { logDirectiveDebugInfo, extractDirectives } from "@/components/dossier/utils/directives";
import { checkDirectivesExistence, getDirectivesFromContent, extractPatientInfo } from "@/utils/directives";
import { toast } from "@/hooks/use-toast";

/**
 * Composant pour afficher les directives anticipées
 */
const DirectivesTab: React.FC = () => {
  const dossierActif = useDossierStore((state) => state.dossierActif);
  const decryptedContent = useDossierStore((state) => state.decryptedContent);
  const [hasDirectives, setHasDirectives] = useState(false);
  const [directives, setDirectives] = useState<any>(null);
  const [source, setSource] = useState<string>("non définie");
  const [loading, setLoading] = useState(true);
  
  // Extract patient info
  const patientInfo = extractPatientInfo(decryptedContent, dossierActif);
  
  // Méthode pour récupérer les directives (Mon Espace Santé)
  const getDirectives = useCallback(() => {
    if (!decryptedContent || !dossierActif) return null;
    return getDirectivesFromContent(decryptedContent, dossierActif);
  }, [decryptedContent, dossierActif]);
  
  useEffect(() => {
    setLoading(true);
    
    // Vérifier si decryptedContent est null ou undefined
    if (!decryptedContent) {
      console.warn("DirectivesTab - decryptedContent est null ou undefined");
      setHasDirectives(false);
      setDirectives(null);
      setSource("non définie");
      setLoading(false);
      return;
    }
    
    // Vérifier l'existence des directives
    const directivesExist = checkDirectivesExistence(decryptedContent, dossierActif);
    setHasDirectives(directivesExist);
    
    // Extraction des directives
    if (directivesExist) {
      const { directives: extractedDirectives, source: extractionSource } = extractDirectives(
        decryptedContent,
        directivesExist,
        getDirectives
      );
      
      setDirectives(extractedDirectives);
      setSource(extractionSource);
    } else {
      setDirectives(null);
      setSource("non définie");
    }
    
    setLoading(false);
  }, [decryptedContent, dossierActif, getDirectives]);
  
  // Debug info
  useEffect(() => {
    logDirectiveDebugInfo(decryptedContent, hasDirectives, getDirectives);
  }, [decryptedContent, hasDirectives, getDirectives]);
  
  // Gestion des erreurs
  useEffect(() => {
    if (!dossierActif) {
      toast({
        title: "Erreur",
        description: "Aucun dossier actif trouvé",
        variant: "destructive",
      });
    }
    if (!decryptedContent) {
      console.warn("DirectivesTab - Le contenu déchiffré est vide.");
    }
  }, [dossierActif, decryptedContent]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Directives Anticipées</CardTitle>
        <CardDescription>
          Informations relatives aux directives anticipées du patient.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          <>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[220px]" />
          </>
        ) : (
          <>
            {hasDirectives && directives ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    <span className="font-bold">Nom:</span> {patientInfo.firstName} {patientInfo.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Source:</span> {source}
                  </p>
                </div>
                <div className="mt-2">
                  <pre className="whitespace-pre-wrap text-sm">
                    {typeof directives === 'string' ? (
                      directives
                    ) : (
                      JSON.stringify(directives, null, 2)
                    )}
                  </pre>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Aucune directive anticipée trouvée pour ce patient.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectivesTab;
