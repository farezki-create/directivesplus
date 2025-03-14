
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QuestionCardProps {
  question: any;
  value: string[];
  onValueChange: (value: string, checked?: boolean) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  multiple?: boolean;
}

export function QuestionCard({ 
  question, 
  value, 
  onValueChange, 
  options,
  multiple = false 
}: QuestionCardProps) {
  const questionText = question.question || question.question_text || '';

  console.log(`Rendering question card: "${questionText}" with value:`, value);
  console.log(`Available options:`, options);

  const handleValueChange = (optionValue: string, checked: boolean) => {
    console.log(`Option ${optionValue} changed to ${checked}`);
    if (multiple) {
      if (checked) {
        onValueChange(optionValue, checked);
      } else {
        onValueChange(optionValue, checked);
      }
    } else {
      // For radio-button-like behavior
      if (checked) {
        onValueChange(optionValue);
      }
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <div>
        <p className="text-lg font-medium mb-4">
          {questionText}
        </p>
        <div className="flex flex-col space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option.value}`}
                checked={value.includes(option.value)}
                onCheckedChange={(checked) => {
                  handleValueChange(option.value, checked as boolean);
                }}
              />
              <Label 
                htmlFor={`${question.id}-${option.value}`}
                className="text-base"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
