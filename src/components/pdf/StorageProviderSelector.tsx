
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

type ProviderOption = {
  type: CloudProviderType;
  label: string;
  config: CloudProviderConfig;
  isSelected: boolean;
};

export function StorageProviderSelector() {
  const [selectedStrategy, setSelectedStrategy] = useState<ScalingStrategy>(ScalingStrategy.ROUND_ROBIN);
  const [providers, setProviders] = useState<ProviderOption[]>([
    { type: CloudProviderType.SUPABASE, label: "Supabase", config: {}, isSelected: true },
    { type: CloudProviderType.AWS_S3, label: "Amazon S3", config: { awsRegion: "", awsBucket: "" }, isSelected: false },
    { type: CloudProviderType.GOOGLE_CLOUD, label: "Google Cloud", config: { gcpProjectId: "", gcpBucket: "" }, isSelected: false },
    { type: CloudProviderType.AZURE_BLOB, label: "Azure Blob", config: { azureAccountName: "", azureContainer: "" }, isSelected: false }
  ]);
  
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
              <div key={provider.type} className="flex items-center space-x-2 border p-3 rounded-md">
                <Checkbox
                  id={`provider-${index}`}
                  checked={provider.isSelected}
                  onCheckedChange={() => toggleProvider(index)}
                />
                <Label htmlFor={`provider-${index}`} className="font-medium">{provider.label}</Label>
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
