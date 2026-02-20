import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ExamplePhraseCard from "./ExamplePhraseCard";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

type ExamplePhrase = {
  id: string;
  title: string;
  content: string;
  category: string;
};

// Exemples de phrases prédéfinis
const predefinedExamples = [
  "Si je perds définitivement ma capacité à communiquer et à reconnaître mes proches à cause de ma maladie d'Alzheimer, je demande l'arrêt de toute nutrition ou hydratation artificielle.",
  "En cas d'échec des thérapies ciblées et de progression tumorale symptomatique, je refuse toute chimiothérapie palliative à visée uniquement de gain de survie limité, privilégiant un traitement antalgique maximal associé à une sédation intermittente si nécessaire.",
  "En cas de décompensation aiguë de ma pathologie cardiaque avec pronostic fonctionnel réservé, je refuse toute hospitalisation en service de soins intensifs, autorisant uniquement les soins de confort prodigués à mon domicile ou en EHPAD.",
  "Lorsque j'aurai perdu de façon irréversible ma capacité à m'alimenter oralement du fait de troubles neurodégénératifs, je refuse toute gastrostomie ou hydratation parentérale, autorisant uniquement des soins de bouche réguliers.",
  "En accord avec mes convictions religieuses, je refuse catégoriquement toute transfusion sanguine quelle que soit la situation clinique, y compris en contexte vital, autorisant uniquement les alternatives thérapeutiques non hémiques.",
  "En cas de dégradation respiratoire nécessitant une assistance mécanique invasive (trachéotomie), je refuse ce geste au profit d'une ventilation non invasive et d'une sédation palliative en phase terminale, conformément aux recommandations de la SFAP sur les maladies neurodégénératives. J'autorise uniquement les soins de confort visant à prévenir les souffrances liées à l'encombrement bronchique.",
  "En cas de rejet aigu irréversible malgré un second traitement immunosuppresseur, je refuse toute retransplantation ou assistance ventriculaire prolongée. Je souhaite une limitation thérapeutique axée sur le contrôle symptomatique, incluant si nécessaire une sédation profonde continue selon l'article R. 4127-37 du Code de Santé Public.",
  "En cas de coma acidocétosique résistant à 72h de réanimation, complété d'un état végétatif persistant, je refuse toute nutrition parentérale au profit de soins palliatifs. Cette directive s'applique uniquement si deux neurologues indépendants confirment l'absence de potentiel de récupération.",
  "Lors d'une crise myasthénique avec insuffisance respiratoire aiguë, j'accepte une intubation de courte durée (<7 jours) mais refuse toute trachéotomie définitive. Au-delà de 15 jours de ventilation mécanique sans amélioration, je demande l'orientation vers une unité de soins palliatifs.",
  "En cas de découverte d'un adénocarcinome colique métastatique, je refuse toute colectomie ou chimiothérapie adjuvante au profit d'une colostomie palliative si nécessaire. J'exige une concertation oncogériatrique préalable validant mon choix selon les critères de la Société Internationale d'Oncologie Gériatrique."
];

// Catégories pour les exemples
const exampleCategories = [
  "Maladie neuro-dégénérative",
  "Cancer",
  "Pathologie cardiaque",
  "Soins de confort",
  "Convictions personnelles"
];

type CustomPhraseFormValues = {
  content: string;
};

const ExamplesSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examples, setExamples] = useState<ExamplePhrase[]>([]);
  const [categories, setCategories] = useState<string[]>(exampleCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedPhrases, setAddedPhrases] = useState<string[]>([]);
  const [customPhrases, setCustomPhrases] = useState<string[]>([]);
  const [editingPhrase, setEditingPhrase] = useState<{index: number, content: string} | null>(null);
  
  const form = useForm<CustomPhraseFormValues>({
    defaultValues: {
      content: "",
    },
  });
  
  // Fetch example phrases from database or use predefined ones
  useEffect(() => {
    fetchExamples();
  }, []);
  
  const fetchExamples = async () => {
    try {
      setLoading(true);
      
      // We try to fetch from database first
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('language', 'fr') // Assuming we want French examples
        .order('category', { ascending: true });
      
      if (error) {
        console.error('Error fetching examples:', error);
        // If there's an error, we use our predefined examples
        createExamplesFromPredefined();
      } else if (data && data.length > 0) {
        setExamples(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        
        // Set default selected category if available
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } else {
        // If no data returned, use predefined examples
        createExamplesFromPredefined();
      }
    } catch (error: any) {
      console.error('Error in fetchExamples:', error.message);
      createExamplesFromPredefined();
    } finally {
      setLoading(false);
    }
  };

  // Create examples from predefined list if database fetch fails
  const createExamplesFromPredefined = () => {
    const formattedExamples = predefinedExamples.map((content, index) => {
      // Assign a category based on index (just for demonstration)
      const categoryIndex = index % exampleCategories.length;
      return {
        id: `example-${index}`,
        title: `Exemple ${index + 1}`,
        content: content,
        category: exampleCategories[categoryIndex]
      };
    });
    
    setExamples(formattedExamples);
    setCategories(exampleCategories);
    
    if (exampleCategories.length > 0) {
      setSelectedCategory(exampleCategories[0]);
    }
  };
  
  const handleAddPhrase = (phrase: string) => {
    setAddedPhrases([...addedPhrases, phrase]);
    // Here we would normally save to database
  };
  
  const handleRemovePhrase = (phrase: string) => {
    setAddedPhrases(addedPhrases.filter(p => p !== phrase));
    // Here we would normally remove from database
  };
  
  const handleAddCustomPhrase = (values: CustomPhraseFormValues) => {
    if (values.content.trim()) {
      setCustomPhrases([...customPhrases, values.content]);
      toast({
        title: "Phrase personnalisée ajoutée",
        description: "Votre phrase a été ajoutée à la liste"
      });
      form.reset({ content: "" });
    }
  };
  
  const handleEditCustomPhrase = (index: number) => {
    setEditingPhrase({
      index,
      content: customPhrases[index]
    });
    form.setValue("content", customPhrases[index]);
  };
  
  const handleUpdateCustomPhrase = () => {
    if (editingPhrase && form.getValues().content.trim()) {
      const updatedPhrases = [...customPhrases];
      updatedPhrases[editingPhrase.index] = form.getValues().content;
      setCustomPhrases(updatedPhrases);
      setEditingPhrase(null);
      form.reset({ content: "" });
      toast({
        title: "Phrase mise à jour",
        description: "Votre phrase personnalisée a été modifiée"
      });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingPhrase(null);
    form.reset({ content: "" });
  };
  
  const handleDeleteCustomPhrase = (index: number) => {
    const updatedPhrases = [...customPhrases];
    updatedPhrases.splice(index, 1);
    setCustomPhrases(updatedPhrases);
    toast({
      title: "Phrase supprimée",
      description: "Votre phrase personnalisée a été supprimée"
    });
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
      
      {/* Custom Phrase Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Ajouter une phrase personnalisée</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(
                editingPhrase ? handleUpdateCustomPhrase : handleAddCustomPhrase
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre phrase</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Écrivez votre phrase ici..." 
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                {editingPhrase ? (
                  <>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      Mettre à jour
                    </Button>
                  </>
                ) : (
                  <Button type="submit" className="flex items-center gap-2">
                    <Plus size={16} />
                    Ajouter
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Custom Phrases List */}
      {customPhrases.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mes phrases personnalisées</h2>
          <div className="grid gap-4">
            {customPhrases.map((phrase, index) => (
              <Card key={`custom-${index}`} className="relative">
                <CardContent className="pt-6">
                  <div className="prose max-w-none mb-4">
                    <p>{phrase}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditCustomPhrase(index)}
                      className="flex items-center gap-2"
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteCustomPhrase(index)}
                      className="flex items-center gap-2"
                    >
                      Supprimer
                    </Button>
                    <Button
                      onClick={() => handleAddPhrase(phrase)}
                      variant="default"
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Ajouter à mes directives
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold">Exemples prédéfinis</h2>
          
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
                <ExamplePhraseCard
                  key={example.id}
                  content={example.content}
                  onAdd={handleAddPhrase}
                  onRemove={handleRemovePhrase}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamplesSection;
