
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  CloudProviderType, 
  ScalingStrategy,
  CloudProviderConfig 
} from "@/utils/cloud/CloudStorageFactory";
import { configureCustomScaling } from "@/utils/cloud/examples/ScalingExample";
import { PDFGenerationService } from "@/utils/PDFGenerationService";
import { toast } from "@/hooks/use-toast";
import { SupabaseStorageProvider } from "@/utils/PDFGenerationService";
import { Input } from "@/components/ui/input";

type ProviderOption = {
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

export function StorageProviderSelector() {
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
  
  const [showConfig, setShowConfig] = useState<number | null>(null);
  
  const toggleProvider = (index: number) => {
    const updatedProviders = [...providers];
    updatedProviders[index].isSelected = !updatedProviders[index].isSelected;
    setProviders(updatedProviders);
  };
  
  const updateProviderConfig = (index: number, config: CloudProviderConfig) => {
    const updatedProviders = [...providers];
    updatedProviders[index].config = { ...updatedProviders[index].config, ...config };
    setProviders(updatedProviders);
  };
  
  const toggleConfigPanel = (index: number) => {
    setShowConfig(showConfig === index ? null : index);
  };
  
  const updateConfigField = (providerIndex: number, fieldKey: string, value: string) => {
    const updatedProviders = [...providers];
    updatedProviders[providerIndex].config = { 
      ...updatedProviders[providerIndex].config, 
      [fieldKey]: value 
    };
    setProviders(updatedProviders);
  };
  
  const applyScalingStrategy = () => {
    // Vérifier qu'au moins un fournisseur est sélectionné
    const selectedProviders = providers.filter(p => p.isSelected);
    if (selectedProviders.length === 0) {
      toast({
        title: "Erreur de configuration",
        description: "Veuillez sélectionner au moins un fournisseur de stockage.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedProviders.length === 1) {
      // Si un seul fournisseur, pas besoin de scaling
      const provider = selectedProviders[0];
      try {
        const storageProvider = configureCustomScaling(
          selectedStrategy,
          [provider.type],
          [provider.config]
        );
        
        toast({
          title: "Configuration réussie",
          description: `Fournisseur de stockage ${provider.label} configuré.`,
        });
      } catch (error) {
        toast({
          title: "Erreur de configuration",
          description: `Configuration incomplète pour ${provider.label}`,
          variant: "destructive",
        });
      }
    } else {
      // Configuration pour multiple fournisseurs
      try {
        const providerTypes = selectedProviders.map(p => p.type);
        const configs = selectedProviders.map(p => p.config);
        
        const storageProvider = configureCustomScaling(
          selectedStrategy,
          providerTypes,
          configs
        );
        
        toast({
          title: "Configuration réussie",
          description: `Stratégie de scaling configurée avec ${selectedProviders.length} fournisseurs.`,
        });
      } catch (error) {
        toast({
          title: "Erreur de configuration",
          description: "Impossible de configurer la stratégie de scaling. Vérifiez les configurations des fournisseurs.",
          variant: "destructive",
        });
      }
    }
  };
  
  const resetToDefault = () => {
    PDFGenerationService.setStorageProvider(new SupabaseStorageProvider());
    toast({
      title: "Configuration réussie",
      description: "Retour à la configuration par défaut (Supabase).",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration du stockage cloud</CardTitle>
        <CardDescription>
          Sélectionnez et configurez les fournisseurs de stockage cloud pour vos documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="scaling-strategy">Stratégie de scaling</Label>
            <Select 
              value={selectedStrategy} 
              onValueChange={(val) => setSelectedStrategy(val as ScalingStrategy)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une stratégie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ScalingStrategy.ROUND_ROBIN}>Tour de rôle (Round Robin)</SelectItem>
                <SelectItem value={ScalingStrategy.FILE_SIZE}>Selon la taille du fichier</SelectItem>
                <SelectItem value={ScalingStrategy.RANDOM}>Aléatoire</SelectItem>
                <SelectItem value={ScalingStrategy.AVAILABILITY}>Selon la disponibilité</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              La stratégie détermine comment les fichiers sont répartis entre les différents fournisseurs.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Fournisseurs de stockage</Label>
            {providers.map((provider, index) => (
              <div key={provider.type} className="flex flex-col border p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`provider-${index}`}
                      checked={provider.isSelected}
                      onCheckedChange={() => toggleProvider(index)}
                    />
                    <Label htmlFor={`provider-${index}`} className="font-medium">
                      {provider.label}
                      {provider.label === "Scalingo HDS" && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Hébergement de Données de Santé
                        </span>
                      )}
                    </Label>
                  </div>
                  
                  {provider.configFields && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleConfigPanel(index)}
                    >
                      {showConfig === index ? "Masquer" : "Configurer"}
                    </Button>
                  )}
                </div>
                
                {showConfig === index && provider.configFields && (
                  <div className="mt-3 pl-6 space-y-2 border-t pt-2">
                    {provider.configFields.map(field => (
                      <div key={field.key} className="grid grid-cols-1 gap-2">
                        <Label htmlFor={`${provider.type}-${field.key}`} className="text-sm">
                          {field.label}
                        </Label>
                        <Input
                          id={`${provider.type}-${field.key}`}
                          placeholder={field.placeholder}
                          value={(provider.config[field.key as keyof CloudProviderConfig] as string) || ''}
                          onChange={(e) => updateConfigField(index, field.key, e.target.value)}
                          className="h-8"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-4 space-x-4">
            <Button onClick={applyScalingStrategy}>
              Appliquer la configuration
            </Button>
            <Button variant="outline" onClick={resetToDefault}>
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
