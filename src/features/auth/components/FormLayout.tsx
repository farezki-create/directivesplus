
import React from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface FormLayoutProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  children: React.ReactNode;
  loading?: boolean;
}

export const FormLayout = ({
  form,
  onSubmit,
  children,
  loading = false,
}: FormLayoutProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
      </form>
    </Form>
  );
};
