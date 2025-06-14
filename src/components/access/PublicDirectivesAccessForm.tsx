
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DatePickerField from "./calendar/DatePickerField";
import AccessFormHeader from "./form-fields/AccessFormHeader";
import PersonalInfoFields from "./form-fields/PersonalInfoFields";

// Schéma de validation du formulaire
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.date({
    required_error: "La date de naissance est requise",
  }),
  accessCode: z.string().min(1, "Le code d'accès est requis"),
});

type FormValues = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  accessCode: string;
};

interface PublicDirectivesAccessFormProps {
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
}

const PublicDirectivesAccessForm: React.FC<PublicDirectivesAccessFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(1980, 0, 1));

  // defaultValues must be strictly typed!
  const defaultValues: FormValues = {
    firstName: "",
    lastName: "",
    birthDate: new Date(1980, 0, 1),
    accessCode: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues, // strictly typed to FormValues
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="shadow-md">
      <AccessFormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <PersonalInfoFields control={form.control} loading={loading} />
            <DatePickerField
              control={form.control}
              loading={loading}
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Vérification..." : "Accéder aux directives"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PublicDirectivesAccessForm;
