import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  step: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationButtons({ 
  step, 
  onPrevious, 
  onNext 
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={step === 1}
      >
        Précédent
      </Button>
      <Button
        onClick={onNext}
        disabled={step === 3}
      >
        Suivant
      </Button>
    </div>
  );
}