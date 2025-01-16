import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  progress: number;
}

export function FormProgress({ progress }: FormProgressProps) {
  return <Progress value={progress} className="mb-6" />;
}