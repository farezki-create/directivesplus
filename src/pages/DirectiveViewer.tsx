import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DirectiveViewer = () => {
  const { directiveId } = useParams<{ directiveId: string }>();
  const navigate = useNavigate();
  const [directive, setDirective] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (directiveId) loadDirective();
  }, [directiveId]);

  const loadDirective = async () => {
    try {
      const { data, error } = await supabase.from('directives').select('*').eq('id', directiveId).single();
      if (error) throw error;
      setDirective(data);
    } catch (err: any) {
      console.error("DirectiveViewer - Error:", err);
      setError(err.message || "Erreur lors du chargement de la directive");
      toast({ title: "Erreur", description: "Impossible de charger la directive", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => { window.print(); };

  const handleDownload = () => {
    const content = JSON.stringify(directive.content, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'directives-anticipees.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Téléchargement commencé", description: "Les directives anticipées sont en cours de téléchargement" });
  };

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div></div>);
  }
  if (error || !directive) {
    return (<div className="min-h-screen flex items-center justify-center"><Card className="max-w-md"><CardHeader><CardTitle>Erreur</CardTitle></CardHeader><CardContent><p className="text-gray-600 mb-4">{error || "Directive non trouvée"}</p><Button onClick={() => navigate(-1)} className="w-full"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button></CardContent></Card></div>);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4 print:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button>
            <h1 className="text-lg font-semibold">Directives Anticipées</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Télécharger</Button>
            <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" />Imprimer</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Directives Anticipées</h2>
          {directive.content && (
            <div className="space-y-6">
              {Object.entries(directive.content).map(([key, value]: [string, any]) => (
                <div key={key} className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2 capitalize">{key.replace(/_/g, ' ')}</h3>
                  {typeof value === 'string' ? (<p className="text-gray-700 whitespace-pre-wrap">{value}</p>) : Array.isArray(value) ? (<ul className="list-disc list-inside space-y-1">{value.map((item, index) => (<li key={index} className="text-gray-700">{item}</li>))}</ul>) : typeof value === 'object' && value !== null ? (<pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{JSON.stringify(value, null, 2)}</pre>) : (<p className="text-gray-700">{String(value)}</p>)}
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>Document créé le {new Date(directive.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectiveViewer;
