import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MedicalDirectivesStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Directives médicales</h2>
      <div className="space-y-2">
        <Label htmlFor="medical">Vos souhaits concernant les soins médicaux</Label>
        <Textarea 
          id="medical" 
          placeholder="Décrivez vos souhaits concernant les traitements médicaux..."
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}