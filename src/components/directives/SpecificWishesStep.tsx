import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SpecificWishesStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Souhaits particuliers</h2>
      <div className="space-y-2">
        <Label htmlFor="specific">Précisions supplémentaires</Label>
        <Textarea 
          id="specific" 
          placeholder="Ajoutez des précisions sur vos souhaits..."
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}