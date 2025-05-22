
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatDateForDisplay, parseManualDate } from "@/utils/dateFormatters";

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <FormItem className="space-y-2">
      <FormLabel>Date de naissance</FormLabel>
      
      <FormControl>
        <Input
          placeholder="JJ/MM/AAAA"
          value={formatDateForDisplay(value)}
          onChange={(e) => {
            const formattedDate = parseManualDate(e.target.value);
            onChange(formattedDate);
          }}
          disabled={disabled}
          className="focus:ring-2 focus:ring-directiveplus-500"
        />
      </FormControl>
      
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerField;
