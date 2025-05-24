
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Schéma de validation du formulaire
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.date({
    required_error: "La date de naissance est requise",
  }),
  accessCode: z.string().min(1, "Le code d'accès est requis"),
});

type FormValues = z.infer<typeof formSchema>;

interface PublicDirectivesAccessFormProps {
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
}

const PublicDirectivesAccessForm: React.FC<PublicDirectivesAccessFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(1980, 0, 1));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      accessCode: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  // Générer la liste des années (de 1900 à année actuelle)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  // Liste des mois
  const months = [
    { value: 0, label: "Janvier" },
    { value: 1, label: "Février" },
    { value: 2, label: "Mars" },
    { value: 3, label: "Avril" },
    { value: 4, label: "Mai" },
    { value: 5, label: "Juin" },
    { value: 6, label: "Juillet" },
    { value: 7, label: "Août" },
    { value: 8, label: "Septembre" },
    { value: 9, label: "Octobre" },
    { value: 10, label: "Novembre" },
    { value: 11, label: "Décembre" }
  ];

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(Number(monthIndex));
    setCalendarDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(Number(year));
    setCalendarDate(newDate);
  };

  const decrementMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarDate(newDate);
  };

  const incrementMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarDate(newDate);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-center text-directiveplus-700">
          Accès aux directives anticipées
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
              Pour accéder aux directives, veuillez saisir les informations du patient et le code d'accès fourni.
            </div>
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom du patient</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du patient</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de naissance</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={loading}
                        >
                          {field.value ? (
                            format(field.value, "P", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex items-center justify-between px-2 py-2 bg-muted/20 border-b">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={decrementMonth}
                          disabled={loading}
                          type="button"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Select
                            value={calendarDate.getMonth().toString()}
                            onValueChange={handleMonthChange}
                            disabled={loading}
                          >
                            <SelectTrigger className="h-7 w-[110px]">
                              <SelectValue placeholder="Mois" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value.toString()}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={calendarDate.getFullYear().toString()}
                            onValueChange={handleYearChange}
                            disabled={loading}
                          >
                            <SelectTrigger className="h-7 w-[75px]">
                              <SelectValue placeholder="Année" />
                            </SelectTrigger>
                            <SelectContent className="h-56 overflow-y-auto bg-white z-50">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={incrementMonth}
                          disabled={loading}
                          type="button"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={loading || (date => date > new Date())}
                        initialFocus
                        month={calendarDate}
                        onMonthChange={setCalendarDate}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code d'accès</FormLabel>
                  <FormControl>
                    <Input placeholder="Code d'accès" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
