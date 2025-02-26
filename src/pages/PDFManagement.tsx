
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PDFUploader } from '@/components/pdf/PDFUploader';
import { PDFDocumentsList } from '@/components/pdf/PDFDocumentsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';

export default function PDFManagement() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/auth');
          return;
        }
        
        setUserId(session.user.id);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Mes documents PDF
          </h2>
          <PDFUploader userId={userId} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestionnaire de documents</CardTitle>
            <CardDescription>
              Téléchargez, consultez et gérez vos documents PDF en toute simplicité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PDFDocumentsList userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
