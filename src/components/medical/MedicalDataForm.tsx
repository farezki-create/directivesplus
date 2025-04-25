
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { X, Plus } from "lucide-react";

const formSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Le nom est requis"),
      dosage: z.string().optional(),
      frequency: z.string().optional()
    })
  ).default([]),
  otherInfo: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface MedicalDataFormProps {
  onDataSaved?: () => void;
}

export function MedicalDataForm({ onDataSaved }: MedicalDataFormProps) {
  const { user } = useAuth();
  const { saveMedicalData } = useMedicalData(user?.id || "");
  const { toast } = useToast();
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodType: "",
      allergies: [],
      conditions: [],
      medications: [{ name: "", dosage: "", frequency: "" }],
      otherInfo: ""
    }
  });
  
  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = form.useFieldArray({
    name: "medications"
  });

  const addAllergy = () => {
    if (newAllergy.trim() !== "") {
      form.setValue("allergies", [...form.getValues().allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const currentAllergies = form.getValues().allergies;
    currentAllergies.splice(index, 1);
    form.setValue("allergies", [...currentAllergies]);
  };

  const addCondition = () => {
    if (newCondition.trim() !== "") {
      form.setValue("conditions", [...form.getValues().conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const currentConditions = form.getValues().conditions;
    currentConditions.splice(index, 1);
    form.setValue("conditions", [...currentConditions]);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder vos données médicales",
        variant: "destructive"
      });
      return;
    }

    try {
      const accessCode = await saveMedicalData(data);
      
      if (accessCode) {
        toast({
          title: "Données enregistrées",
          description: `Vos données médicales ont été sauvegardées avec le code d'accès: ${accessCode}`,
        });
        
        form.reset();
        
        if (onDataSaved) {
          onDataSaved();
        }
      }
    } catch (error) {
      console.error("Error saving medical data:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde des données",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter des données médicales</CardTitle>
        <CardDescription>
          Enregistrez vos informations médicales importantes pour les partager avec les professionnels de santé.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groupe sanguin</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre groupe sanguin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Allergies</FormLabel>
              <div className="flex mt-2 mb-1">
                <Input 
                  value={newAllergy} 
                  onChange={(e) => setNewAllergy(e.target.value)} 
                  placeholder="Ajouter une allergie"
                  className="mr-2"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addAllergy}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("allergies").map((allergy, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-100 px-2 py-1 rounded-md flex items-center text-sm"
                  >
                    {allergy}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => removeAllergy(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <FormLabel>Conditions médicales</FormLabel>
              <div className="flex mt-2 mb-1">
                <Input 
                  value={newCondition} 
                  onChange={(e) => setNewCondition(e.target.value)} 
                  placeholder="Ajouter une condition médicale"
                  className="mr-2"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("conditions").map((condition, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-100 px-2 py-1 rounded-md flex items-center text-sm"
                  >
                    {condition}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => removeCondition(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <FormLabel>Médicaments</FormLabel>
              <div className="space-y-3 mt-2">
                {medicationFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col md:flex-row gap-2">
                    <FormField
                      control={form.control}
                      name={`medications.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Nom du médicament" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`medications.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Dosage" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`medications.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Fréquence" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 mt-0"
                      onClick={() => {
                        if (medicationFields.length > 1) {
                          removeMedication(index);
                        }
                      }}
                      disabled={medicationFields.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendMedication({ name: "", dosage: "", frequency: "" })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un médicament
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="otherInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autres informations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Toute autre information médicale importante..." 
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <Separator />
          
          <CardFooter className="pt-4">
            <Button type="submit" className="ml-auto">
              Enregistrer les données
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
