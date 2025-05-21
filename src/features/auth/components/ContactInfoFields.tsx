
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "../schemas";

interface ContactInfoFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const ContactInfoFields = ({ form }: ContactInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse*</FormLabel>
            <FormControl>
              <Input placeholder="Adresse complète" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone*</FormLabel>
            <FormControl>
              <Input placeholder="Numéro de téléphone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
