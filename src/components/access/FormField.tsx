
import { Input } from "@/components/ui/input";
import { 
  FormControl, 
  FormField as HookFormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Control } from "react-hook-form";

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  control: Control<any>;
  disabled?: boolean;
};

const FormField = ({ 
  id, 
  label, 
  type = "text", 
  placeholder = "",
  control,
  disabled = false
}: FormFieldProps) => {
  return (
    <HookFormField
      control={control}
      name={id}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type={type}
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              className="focus:ring-2 focus:ring-directiveplus-500"
            />
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default FormField;
