import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { DocumentScanner } from "@/components/DocumentScanner";

export const Documents = () => {
  const { userId } = useParams();
  const [showScanner, setShowScanner] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    loadProfile();
  }, [userId]);

  if (!profile) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="p-6 max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center">Documents disponibles</h1>
          
          <div className="space-y-4">
            <PDFGenerator userId={userId || ""} isCardFormat={false} />
            <PDFGenerator userId={userId || ""} isCardFormat={true} />
            
            <DocumentScanner 
              open={showScanner} 
              onClose={() => setShowScanner(false)} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Documents;