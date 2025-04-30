
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxGroupProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  children: React.ReactNode
  className?: string
}

export const CheckboxGroup = ({ 
  value = [], 
  onValueChange,
  children,
  className
}: CheckboxGroupProps) => {
  const handleValueChange = (itemValue: string, checked: boolean) => {
    if (!onValueChange) return;
    
    if (checked) {
      onValueChange([...value, itemValue]);
    } else {
      onValueChange(value.filter(v => v !== itemValue));
    }
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export interface CheckboxGroupItemProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  value: string;
}

export const CheckboxGroupItem = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxGroupItemProps
>(({ className, value, ...props }, ref) => {
  
  // Access parent context if needed
  const parent = React.useContext(
    React.createContext<{ value?: string[] }>({ value: [] })
  );
  
  const isChecked = parent.value?.includes(value);

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      checked={isChecked}
      value={value}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <Check className="h-3 w-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

CheckboxGroupItem.displayName = "CheckboxGroupItem";
