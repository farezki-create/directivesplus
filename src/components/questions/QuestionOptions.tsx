import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionOption {
  value: string;
  label: string;
}

interface QuestionOptionsProps {
  options: QuestionOption[];
  value: string;
  questionId: string;
  onValueChange: (value: string) => void;
}

export function QuestionOptions({
  options,
  value,
  questionId,
  onValueChange
}: QuestionOptionsProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col space-y-3"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem 
            value={option.value} 
            id={`${questionId}-${option.value}`} 
          />
          <Label 
            htmlFor={`${questionId}-${option.value}`} 
            className="text-base"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}