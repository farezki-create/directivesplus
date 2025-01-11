import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface GeneralOpinionProps {
  form: UseFormReturn<any>;
}

export const GeneralOpinion = ({ form }: GeneralOpinionProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Mes valeurs</h3>
        
        <p className="text-muted-foreground">
          Imaginez que vous ne puissiez pas communiquer avec votre équipe soignante. 
          Que souhaitez-vous qu'elle sache sur ce qui compte le plus pour vous ?
        </p>

        <FormField
          control={form.control}
          name="doNotWishToAnswer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Je ne souhaite pas répondre pour le moment
              </FormLabel>
            </FormItem>
          )}
        />

        <p className="text-sm text-muted-foreground mt-4">
          Sélectionnez-en autant que vous le souhaitez.
        </p>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="values.noLifeSupport"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Ne pas utiliser de machines de sauvetage pour le reste de ma vie
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="values.communicateWithOthers"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Être capable de reconnaître et de communiquer avec les gens qui m'entourent
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="values.selfCare"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Être capable de me nourrir, de me laver et de prendre soin de moi
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="values.noPain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Être sans douleur
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="values.withFamily"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Être en famille ou entre amis
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="values.notABurden"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Ne pas être un fardeau physique ou financier pour ma famille
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="values.additionalComments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autres choses qui comptent pour moi :</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Écrivez ici..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};