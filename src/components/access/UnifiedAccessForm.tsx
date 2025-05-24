
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Key, User, Calendar as CalendarIconComponent } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useUnifiedAccess, AccessFormData, AccessOptions } from "@/hooks/access/useUnifiedAccess";

interface UnifiedAccessFormProps {
  title?: string;
  description?: string;
  accessOptions?: AccessOptions;
  className?: string;
}

export const UnifiedAccessForm: React.FC<UnifiedAccessFormProps> = ({
  title = "Accès aux données",
  description = "Veuillez entrer vos informations et le code d'accès fourni",
  accessOptions = {},
  className = ""
}) => {
  const [formData, setFormData] = useState<AccessFormData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    accessCode: ""
  });
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  
  const { verifyAccess, loading, error } = useUnifiedAccess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      birthDate: birthDate ? format(birthDate, 'yyyy-MM-dd') : ""
    };
    
    await verifyAccess(submissionData, accessOptions);
  };

  return (
    <div className={`max-w-md mx-auto bg-white p-8 rounded-lg shadow ${className}`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-directiveplus-700 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Prénom
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            className="mt-1"
            placeholder="Votre prénom"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nom de famille
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
            className="mt-1"
            placeholder="Votre nom de famille"
          />
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <CalendarIconComponent className="h-4 w-4" />
            Date de naissance
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !birthDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="accessCode" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Code d'accès
          </Label>
          <Input
            id="accessCode"
            type="text"
            value={formData.accessCode}
            onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value.toUpperCase() }))}
            required
            className="mt-1"
            placeholder="Entrez le code d'accès"
            maxLength={10}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
        >
          {loading ? "Vérification..." : "Accéder"}
        </Button>
      </form>
    </div>
  );
};
