
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProviderConfigPanel } from "./ProviderConfigPanel";
import { ProviderOption } from "@/hooks/useStorageProvider";
import { useState } from "react";

interface ProviderListProps {
  providers: ProviderOption[];
  onToggleProvider: (index: number) => void;
  onUpdateConfig: (index: number, key: string, value: string) => void;
}

export function ProviderList({
  providers,
  onToggleProvider,
  onUpdateConfig
}: ProviderListProps) {
  const [showConfig, setShowConfig] = useState<number | null>(null);

  const toggleConfigPanel = (index: number) => {
    setShowConfig(showConfig === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {providers.map((provider, index) => (
        <div key={provider.type} className="flex flex-col border p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`provider-${index}`}
                checked={provider.isSelected}
                onCheckedChange={() => onToggleProvider(index)}
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
          
          {showConfig === index && (
            <ProviderConfigPanel
              provider={provider}
              providerIndex={index}
              onUpdateConfig={onUpdateConfig}
            />
          )}
        </div>
      ))}
    </div>
  );
}
