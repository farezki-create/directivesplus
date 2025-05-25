
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formSchema = z.object({
  institution_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email("Email invalide").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  expires_at: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface InstitutionCodeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  mode: 'create' | 'edit';
}

export const InstitutionCodeForm: React.FC<InstitutionCodeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution_name: initialData?.institution_name || "",
      contact_person: initialData?.contact_person || "",
      contact_email: initialData?.contact_email || "",
      contact_phone: initialData?.contact_phone || "",
      expires_at: initialData?.expires_at ? new Date(initialData.expires_at) : undefined,
    },
  });

  const handleSubmit = async (data: FormData) => {
    const submitData = {
      ...data,
      expires_at: data.expires_at?.toISOString(),
    };
    
    // Nettoyer les champs vides
    Object.keys(submitData).forEach(key => {
      if (submitData[key as keyof typeof submitData] === "") {
        delete submitData[key as keyof typeof submitData];
      }
    });
    
    await onSubmit(submitData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Générer un code d\'accès institution' : 'Modifier le code d\'accès'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="institution_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Hôpital, clinique..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personne de contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la personne de contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@institution.fr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone de contact</FormLabel>
                  <FormControl>
                    <Input placeholder="01 23 45 67 89" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date d'expiration (optionnelle)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span className="text-muted-foreground">
                              Sélectionner une date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Générer le code' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
