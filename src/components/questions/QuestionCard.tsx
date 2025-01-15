import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  question: any;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export function QuestionCard({ question, value, onValueChange, options }: QuestionCardProps) {
  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <p className="text-lg font-medium mb-4">{question.Question || question.question}</p>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex flex-col space-y-3"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={`${question.id}-${option.value}`} 
            />
            <Label 
              htmlFor={`${question.id}-${option.value}`} 
              className="text-base"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}