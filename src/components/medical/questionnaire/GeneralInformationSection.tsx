
import React from "react";
import { Control } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface GeneralInformationSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function GeneralInformationSection({ control }: GeneralInformationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        1. Informations générales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Entrez votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="prenom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Entrez votre prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="date_naissance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="sexe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Choisir --" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="H">Homme</SelectItem>
                  <SelectItem value="F">Femme</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="secu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de sécurité sociale</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de sécurité sociale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Adresse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personne_prevenir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personne à prévenir</FormLabel>
              <FormControl>
                <Input placeholder="Nom et téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Separator />
    </div>
  );
}
