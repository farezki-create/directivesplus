
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CloudProviderType, ScalingStrategy, CloudProviderConfig } from "@/utils/cloud/CloudStorageFactory";
import { configureCustomScaling } from "@/utils/cloud/examples/ScalingExample";
import { PDFGenerationService } from "@/utils/PDFGenerationService";
import { SupabaseStorageProvider } from "@/utils/storage/providers/SupabaseProvider";

export type ProviderOption = {
  type: CloudProviderType;
  label: string;
  config: CloudProviderConfig;
  isSelected: boolean;
  configFields?: {
    key: string;
    label: string;
    placeholder: string;
  }[];
};

export function useStorageProvider() {
  const [selectedStrategy, setSelectedStrategy] = useState<ScalingStrategy>(ScalingStrategy.ROUND_ROBIN);
  const [providers, setProviders] = useState<ProviderOption[]>([
    { type: CloudProviderType.SUPABASE, label: "Supabase", config: {}, isSelected: true },
    { type: CloudProviderType.AWS_S3, label: "Amazon S3", config: { awsRegion: "", awsBucket: "" }, isSelected: false },
    { type: CloudProviderType.GOOGLE_CLOUD, label: "Google Cloud", config: { gcpProjectId: "", gcpBucket: "" }, isSelected: false },
    { type: CloudProviderType.AZURE_BLOB, label: "Azure Blob", config: { azureAccountName: "", azureContainer: "" }, isSelected: false },
    { 
      type: CloudProviderType.SCALINGO_HDS, 
      label: "Scalingo HDS", 
      config: { 
        scalingoApiKey: "", 
        scalingoAppId: "",
        scalingoContainer: "documents", 
        scalingoRegion: "osc-fr1" 
      }, 
      isSelected: false,
      configFields: [
        { key: "scalingoApiKey", label: "Clé API", placeholder: "Votre clé API Scalingo" },
        { key: "scalingoAppId", label: "ID Application", placeholder: "ID de votre application" },
        { key: "scalingoContainer", label: "Conteneur", placeholder: "documents" },
        { key: "scalingoRegion", label: "Région", placeholder: "osc-fr1" }
      ]
    }
  ]);

  const applyScalingStrategy = () => {
    const selectedProviders = providers.filter(p => p.isSelected);
    if (selectedProviders.length === 0) {
      toast({
        title: "Erreur de configuration",
        description: "Veuillez sélectionner au moins un fournisseur de stockage.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (selectedProviders.length === 1) {
        const provider = selectedProviders[0];
        const storageProvider = configureCustomScaling(
          selectedStrategy,
          [provider.type],
          [provider.config]
        );
        
        toast({
          title: "Configuration réussie",
          description: `Fournisseur de stockage ${provider.label} configuré.`,
        });
      } else {
        const providerTypes = selectedProviders.map(p => p.type);
        const configs = selectedProviders.map(p => p.config);
        
        configureCustomScaling(selectedStrategy, providerTypes, configs);
        
        toast({
          title: "Configuration réussie",
          description: `Stratégie de scaling configurée avec ${selectedProviders.length} fournisseurs.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de configuration",
        description: "Impossible de configurer la stratégie de scaling. Vérifiez les configurations des fournisseurs.",
        variant: "destructive",
      });
    }
  };

  const resetToDefault = () => {
    PDFGenerationService.setStorageProvider(new SupabaseStorageProvider());
    toast({
      title: "Configuration réussie",
      description: "Retour à la configuration par défaut (Supabase).",
    });
  };

  const toggleProvider = (index: number) => {
    const updatedProviders = [...providers];
    updatedProviders[index].isSelected = !updatedProviders[index].isSelected;
    setProviders(updatedProviders);
  };

  const updateConfigField = (providerIndex: number, fieldKey: string, value: string) => {
    const updatedProviders = [...providers];
    updatedProviders[providerIndex].config = { 
      ...updatedProviders[providerIndex].config, 
      [fieldKey]: value 
    };
    setProviders(updatedProviders);
  };

  return {
    selectedStrategy,
    setSelectedStrategy,
    providers,
    applyScalingStrategy,
    resetToDefault,
    toggleProvider,
    updateConfigField,
  };
}
