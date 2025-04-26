
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BloodTypeSelect } from "./components/BloodTypeSelect";
import { AllergiesList } from "./components/AllergiesList";
import { ConditionsList } from "./components/ConditionsList";
import { MedicationsList } from "./components/MedicationsList";
import { useMedicalForm } from "./hooks/useMedicalForm";

interface MedicalDataFormProps {
  onDataSaved?: () => void;
}

export function MedicalDataForm({ onDataSaved }: MedicalDataFormProps) {
  const {
    form,
    medicationFields,
    appendMedication,
    removeMedication,
    newAllergy,
    setNewAllergy,
    addAllergy,
    removeAllergy,
    newCondition,
    setNewCondition,
    addCondition,
    removeCondition,
    onSubmit
  } = useMedicalForm(onDataSaved);

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
            <BloodTypeSelect form={form} />
            
            <AllergiesList
              allergies={form.watch("allergies")}
              newAllergy={newAllergy}
              onNewAllergyChange={setNewAllergy}
              onAdd={addAllergy}
              onRemove={removeAllergy}
            />
            
            <ConditionsList
              conditions={form.watch("conditions")}
              newCondition={newCondition}
              onNewConditionChange={setNewCondition}
              onAdd={addCondition}
              onRemove={removeCondition}
            />
            
            <MedicationsList
              form={form}
              fields={medicationFields}
              onAdd={() => appendMedication({ name: "", dosage: "", frequency: "" })}
              onRemove={removeMedication}
            />
            
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
