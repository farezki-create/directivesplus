
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ExamplePhrase = {
  id: string;
  title: string;
  content: string;
  category: string;
};

const ExamplesSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examples, setExamples] = useState<ExamplePhrase[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch example phrases when component mounts
  useEffect(() => {
    fetchExamples();
  }, []);
  
  const fetchExamples = async () => {
    try {
      setLoading(true);
      
      // We assume the examples are stored in the articles table and filtered by specific categories
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('language', 'fr') // Assuming we want French examples
        .order('category', { ascending: true });
      
      if (error) throw error;
      
      console.log("Example phrases data:", data);
      
      if (data) {
        setExamples(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        
        // Set default selected category if available
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching example phrases:', error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exemples de phrases.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredExamples = selectedCategory
    ? examples.filter(example => example.category === selectedCategory)
    : examples;
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la rédaction
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">
        Exemples de Phrases
      </h1>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2"
                >
                  {category}
                </Button>
              ))}
              {selectedCategory && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500"
                >
                  Voir tout
                </Button>
              )}
            </div>
          )}
          
          {filteredExamples.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p>Aucun exemple de phrase n'a été trouvé.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredExamples.map(example => (
                <Card key={example.id}>
                  <CardHeader>
                    <CardTitle>{example.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: example.content }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamplesSection;
