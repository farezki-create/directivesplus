
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { reportDataBreach, evaluateAuthorityNotificationNeeded, evaluateUserNotificationNeeded } from "@/utils/dataBreachUtils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema for form validation
const formSchema = z.object({
  breach_type: z.enum(["confidentiality", "integrity", "availability", "multiple"], {
    required_error: "Veuillez sélectionner un type de violation",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  affected_data_types: z.array(z.string()).min(1, {
    message: "Veuillez sélectionner au moins un type de données affecté",
  }),
  affected_users_count: z.string().optional(),
  detection_date: z.string().min(1, {
    message: "Veuillez indiquer la date de détection",
  }),
  remediation_measures: z.string().min(10, {
    message: "Veuillez décrire les mesures prises",
  }),
  is_notified_to_authorities: z.boolean().default(false),
  is_notified_to_users: z.boolean().default(false),
  reporter_name: z.string().min(3, {
    message: "Veuillez indiquer votre nom",
  }),
  reporter_email: z.string().email({
    message: "Veuillez indiquer une adresse email valide",
  }),
  risk_level: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Veuillez sélectionner un niveau de risque",
  }),
  is_data_encrypted: z.boolean().default(false)
});

const dataTypeOptions = [
  { id: "personal_data", label: "Données d'identification" },
  { id: "contact_info", label: "Coordonnées" },
  { id: "health_data", label: "Données de santé" },
  { id: "advance_directives", label: "Directives anticipées" },
  { id: "medical_documents", label: "Documents médicaux" },
  { id: "trusted_persons", label: "Personnes de confiance" },
  { id: "authentication", label: "Données d'authentification" },
  { id: "access_logs", label: "Journaux d'accès" }
];

const DataBreachForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    notifyAuthorities: boolean;
    notifyUsers: boolean;
    urgency: "normal" | "urgent" | "critical";
  } | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breach_type: "confidentiality",
      description: "",
      affected_data_types: [],
      affected_users_count: "",
      detection_date: new Date().toISOString().split('T')[0],
      remediation_measures: "",
      is_notified_to_authorities: false,
      is_notified_to_users: false,
      reporter_name: "",
      reporter_email: "",
      risk_level: "medium",
      is_data_encrypted: false
    }
  });
  
  // Watch values for real-time recommendations
  const watchRiskLevel = form.watch("risk_level");
  const watchDataTypes = form.watch("affected_data_types");
  const watchIsEncrypted = form.watch("is_data_encrypted");
  
  // Update recommendations when relevant fields change
  const updateRecommendations = () => {
    if (watchDataTypes.length > 0 && watchRiskLevel) {
      const notifyAuthorities = evaluateAuthorityNotificationNeeded(
        watchRiskLevel as "low" | "medium" | "high" | "critical",
        watchDataTypes
      );
      
      const notifyUsers = evaluateUserNotificationNeeded(
        watchRiskLevel as "low" | "medium" | "high" | "critical",
        watchDataTypes,
        watchIsEncrypted
      );
      
      let urgency: "normal" | "urgent" | "critical" = "normal";
      if (watchRiskLevel === "high") urgency = "urgent";
      if (watchRiskLevel === "critical") urgency = "critical";
      
      setRecommendations({
        notifyAuthorities,
        notifyUsers,
        urgency
      });
    }
  };
  
  // Call updateRecommendations whenever watched values change
  useState(() => {
    updateRecommendations();
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Convert affected_users_count to number if provided
      const affectedUsersCount = values.affected_users_count ? 
        parseInt(values.affected_users_count, 10) : undefined;
      
      const notificationData = {
        ...values,
        affected_users_count: affectedUsersCount
      };
      
      const success = await reportDataBreach(notificationData);
      
      if (success) {
        toast({
          title: "Signalement enregistré",
          description: "La violation de données a été correctement signalée et sera traitée par l'équipe de sécurité.",
          duration: 5000,
        });
        form.reset();
        setRecommendations(null);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du signalement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du signalement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Signaler une violation de données</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="breach_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de violation</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    onOpenChange={() => updateRecommendations()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de violation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="confidentiality">Confidentialité (divulgation non autorisée)</SelectItem>
                      <SelectItem value="integrity">Intégrité (altération non autorisée)</SelectItem>
                      <SelectItem value="availability">Disponibilité (perte d'accès, destruction)</SelectItem>
                      <SelectItem value="multiple">Multiple (plusieurs types)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="risk_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau de risque</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTimeout(() => updateRecommendations(), 0);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un niveau de risque" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="high">Élevé</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description de la violation</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez la violation, ses circonstances et les éléments connus..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affected_data_types"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Types de données concernées</FormLabel>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dataTypeOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="affected_data_types"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...field.value, option.id]
                                    : field.value?.filter(
                                        (value) => value !== option.id
                                      );
                                  field.onChange(updatedValue);
                                  setTimeout(() => updateRecommendations(), 0);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="affected_users_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre approximatif de personnes concernées</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 100" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="detection_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de détection</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="remediation_measures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mesures de remédiation prises ou prévues</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez les mesures prises pour limiter l'impact de la violation..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_data_encrypted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setTimeout(() => updateRecommendations(), 0);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Les données concernées étaient correctement chiffrées
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="is_notified_to_authorities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      La violation a déjà été notifiée à la CNIL
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_notified_to_users"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Les personnes concernées ont déjà été informées
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="reporter_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre nom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Prénom et nom" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reporter_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@exemple.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {recommendations && (
            <Alert className={`
              ${recommendations.urgency === 'normal' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''} 
              ${recommendations.urgency === 'urgent' ? 'bg-amber-50 text-amber-800 border-amber-200' : ''} 
              ${recommendations.urgency === 'critical' ? 'bg-red-50 text-red-800 border-red-200' : ''}
            `}>
              <AlertCircle className={`
                h-4 w-4 
                ${recommendations.urgency === 'normal' ? 'text-blue-600' : ''} 
                ${recommendations.urgency === 'urgent' ? 'text-amber-600' : ''} 
                ${recommendations.urgency === 'critical' ? 'text-red-600' : ''}
              `} />
              <AlertTitle>Recommandations</AlertTitle>
              <AlertDescription className="mt-2">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    {recommendations.notifyAuthorities 
                      ? <strong>Notification à la CNIL requise dans les 72 heures.</strong>
                      : "Notification à la CNIL probablement non nécessaire."}
                  </li>
                  <li>
                    {recommendations.notifyUsers 
                      ? <strong>Information des personnes concernées requise dans les meilleurs délais.</strong>
                      : "Information des personnes concernées probablement non nécessaire."}
                  </li>
                  <li>
                    Niveau d'urgence: <strong>{
                      recommendations.urgency === 'normal' ? 'Normal' : 
                      recommendations.urgency === 'urgent' ? 'Urgent' : 'Critique'
                    }</strong>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Soumettre le signalement"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DataBreachForm;
