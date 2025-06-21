
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SymptomInputsProps {
  symptoms: {
    douleur: number;
    dyspnee: number;
    anxiete: number;
    fatigue: number;
    sommeil: number;
  };
  onSymptomChange: (symptom: string, value: number[]) => void;
}

const symptomLabels = {
  douleur: "Douleur",
  dyspnee: "Dyspnée (essoufflement)",
  anxiete: "Anxiété/Angoisse",
  fatigue: "Fatigue/État général",
  sommeil: "Sommeil/Confort global"
};

export default function SymptomInputs({ symptoms, onSymptomChange }: SymptomInputsProps) {
  return (
    <div className="grid gap-6">
      {Object.entries(symptoms).map(([symptom, value]) => (
        <div key={symptom} className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="font-medium">
              {symptomLabels[symptom as keyof typeof symptomLabels]}
            </Label>
            <span className={`text-sm font-bold ${value >= 7 ? 'text-red-600' : 'text-gray-600'}`}>
              {value}/10
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={(newValue) => onSymptomChange(symptom, newValue)}
            max={10}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>2.5</span>
            <span>5</span>
            <span>7.5</span>
            <span>10</span>
          </div>
        </div>
      ))}
    </div>
  );
}
