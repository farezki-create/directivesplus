
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

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ value = [], onValueChange, children, className }, ref) => {
  const groupContext = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange]
  );
  
  return (
    <CheckboxGroupContext.Provider value={groupContext}>
      <div ref={ref} className={cn("flex flex-col space-y-2", className)}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";

// Create context for checkbox group
type CheckboxGroupContextType = {
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

const CheckboxGroupContext = React.createContext<CheckboxGroupContextType>({});

export const useCheckboxGroup = () => React.useContext(CheckboxGroupContext);

export interface CheckboxGroupItemProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  value: string;
}

export const CheckboxGroupItem = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxGroupItemProps
>(({ className, value, ...props }, ref) => {
  
  // Access parent context
  const { value: groupValue = [], onValueChange } = useCheckboxGroup();
  
  const isChecked = groupValue.includes(value);
  
  const handleCheckedChange = (checked: boolean) => {
    if (!onValueChange) return;
    
    if (checked) {
      onValueChange([...groupValue, value]);
    } else {
      onValueChange(groupValue.filter(v => v !== value));
    }
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
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
