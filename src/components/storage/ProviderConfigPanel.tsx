
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProviderOption } from "@/hooks/useStorageProvider";

interface ProviderConfigPanelProps {
  provider: ProviderOption;
  providerIndex: number;
  onUpdateConfig: (index: number, key: string, value: string) => void;
}

export function ProviderConfigPanel({ 
  provider,
  providerIndex,
  onUpdateConfig
}: ProviderConfigPanelProps) {
  if (!provider.configFields) return null;

  return (
    <div className="mt-3 pl-6 space-y-2 border-t pt-2">
      {provider.configFields.map(field => (
        <div key={field.key} className="grid grid-cols-1 gap-2">
          <Label htmlFor={`${provider.type}-${field.key}`} className="text-sm">
            {field.label}
          </Label>
          <Input
            id={`${provider.type}-${field.key}`}
            placeholder={field.placeholder}
            value={(provider.config[field.key as keyof typeof provider.config] as string) || ''}
            onChange={(e) => onUpdateConfig(providerIndex, field.key, e.target.value)}
            className="h-8"
          />
        </div>
      ))}
    </div>
  );
}
