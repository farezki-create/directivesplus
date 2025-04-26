
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScalingStrategy } from "@/utils/cloud/CloudStorageFactory";
import { ProviderList } from "../storage/ProviderList";
import { useStorageProvider } from "@/hooks/useStorageProvider";

export function StorageProviderSelector() {
  const {
    selectedStrategy,
    setSelectedStrategy,
    providers,
    applyScalingStrategy,
    resetToDefault,
    toggleProvider,
    updateConfigField,
  } = useStorageProvider();
  
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
            <ProviderList
              providers={providers}
              onToggleProvider={toggleProvider}
              onUpdateConfig={updateConfigField}
            />
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
