
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  const previousValueRef = useRef(value);
  
  useEffect(() => {
    // Ensure we update the reference when the value prop changes
    previousValueRef.current = value;
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue !== previousValueRef.current) {
      onChange(newValue);
      previousValueRef.current = newValue;
    }
  };

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="min-h-[200px]"
    />
  );
}
