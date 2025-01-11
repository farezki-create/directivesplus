import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface EndOfLifeWishesProps {
  form: UseFormReturn<any>;
}

export const EndOfLifeWishes = ({ form }: EndOfLifeWishesProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="endOfLifeWishes.resuscitation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Réanimation cardio-pulmonaire</FormLabel>
              <FormDescription>
                Je souhaite bénéficier d'une réanimation cardio-pulmonaire en cas d'arrêt cardiaque
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endOfLifeWishes.artificialNutrition"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Nutrition artificielle</FormLabel>
              <FormDescription>
                Je souhaite bénéficier d'une nutrition artificielle si nécessaire
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endOfLifeWishes.painManagement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gestion de la douleur</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Précisez vos souhaits concernant la gestion de la douleur"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endOfLifeWishes.organDonation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Don d'organes</FormLabel>
              <FormDescription>
                J'accepte de faire don de mes organes après mon décès
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};