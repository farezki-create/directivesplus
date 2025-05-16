
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Import form components
import { BreachTypeField } from "./breach-form/BreachTypeField";
import { RiskLevelField } from "./breach-form/RiskLevelField";
import { DescriptionField } from "./breach-form/DescriptionField";
import { AffectedDataField } from "./breach-form/AffectedDataField";
import { UsersCountField } from "./breach-form/UsersCountField";
import { DetectionDateField } from "./breach-form/DetectionDateField";
import { RemediationField } from "./breach-form/RemediationField";
import { EncryptionField } from "./breach-form/EncryptionField";
import { NotificationFields } from "./breach-form/NotificationFields";
import { ReporterFields } from "./breach-form/ReporterFields";
import { RecommendationsAlert } from "./breach-form/RecommendationsAlert";

// Import hooks and types
import { formSchema, FormSchema } from "./breach-form/types";
import { useBreachFormRecommendations } from "./breach-form/useBreachFormRecommendations";
import { useBreachFormSubmit } from "./breach-form/useBreachFormSubmit";

const DataBreachForm = () => {
  const form = useForm<FormSchema>({
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
  const watchRiskLevel = form.watch("risk_level") as "low" | "medium" | "high" | "critical";
  const watchDataTypes = form.watch("affected_data_types");
  const watchIsEncrypted = form.watch("is_data_encrypted");
  
  // Get recommendations based on form values
  const { recommendations, updateRecommendations } = useBreachFormRecommendations(
    watchRiskLevel,
    watchDataTypes,
    watchIsEncrypted
  );
  
  // Handle form submission
  const { isSubmitting, handleSubmit } = useBreachFormSubmit(() => {
    form.reset();
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Signaler une violation de données</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BreachTypeField 
              form={form} 
              onValueChange={updateRecommendations} 
            />
            <RiskLevelField 
              form={form} 
              onValueChange={updateRecommendations} 
            />
          </div>
          
          <DescriptionField form={form} />
          <AffectedDataField form={form} onValueChange={updateRecommendations} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UsersCountField form={form} />
            <DetectionDateField form={form} />
          </div>
          
          <RemediationField form={form} />
          <EncryptionField form={form} onValueChange={updateRecommendations} />
          <NotificationFields form={form} />
          <ReporterFields form={form} />
          
          {recommendations && (
            <RecommendationsAlert 
              notifyAuthorities={recommendations.notifyAuthorities}
              notifyUsers={recommendations.notifyUsers}
              urgency={recommendations.urgency}
            />
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
