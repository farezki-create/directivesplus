
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { PDFImporter } from "@/components/import/PDFImporter";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, FileUp } from "lucide-react";

const ModifyDirectives = () => {
  const { t } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    
    checkAuth();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {t('modifyDirectivesPage')}
          </h1>
          
          <div className="grid gap-8">
            {userId ? (
              <>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h2 className="text-xl font-semibold mb-4">{t('importExistingDirectives')}</h2>
                  <PDFImporter userId={userId} />
                </div>
                
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h2 className="text-xl font-semibold mb-4">{t('myDirectives')}</h2>
                  <p className="mb-4 text-muted-foreground">
                    {t('directivesSavedSecurely')}
                  </p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => navigate("/free-text")}
                    >
                      <FileText size={18} />
                      {t('summary')}
                    </Button>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => navigate("/dashboard?tab=persons")}
                    >
                      <FileText size={18} />
                      {t('trustedPerson')}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p className="mb-4">
                  {t('authDescription')}
                </p>
                <Button onClick={() => navigate("/auth")}>
                  {t('login')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModifyDirectives;
