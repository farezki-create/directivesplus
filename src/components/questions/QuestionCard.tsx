
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
  // Handle different question object structures from different tables
  const displayOrder = question.display_order || question.question_order || '';
  const questionText = question.question || question.question_text || '';

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <div className="grid grid-cols-[48px_1fr] gap-4">
        <div className="text-center font-medium text-lg text-muted-foreground border-r pr-4">
          {displayOrder}
        </div>
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
                    // Pass the boolean state of the checkbox to the handler
                    onValueChange(option.value, checked as boolean);
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
    </div>
  );
}
