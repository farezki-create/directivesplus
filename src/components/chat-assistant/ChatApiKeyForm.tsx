
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { setPerplexityApiKey } from '@/utils/perplexityService';
import { LinkIcon } from 'lucide-react';

const ChatApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Clé API requise",
        description: "Veuillez entrer votre clé API Perplexity",
        variant: "destructive"
      });
      return;
    }

    setPerplexityApiKey(apiKey);
    toast({
      title: "Clé API sauvegardée",
      description: "Votre clé API a été enregistrée pour cette session"
    });
  };

  return (
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-4">
        Pour utiliser l'assistant, veuillez entrer votre clé API Perplexity.
      </p>
      <Input
        type="password"
        placeholder="Clé API Perplexity"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-2"
      />
      <Button 
        onClick={handleSaveApiKey}
        className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
      >
        Enregistrer la clé
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Vous pouvez obtenir une clé API sur{' '}
        <a 
          href="https://www.perplexity.ai/settings/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-directiveplus-600 hover:underline"
        >
          perplexity.ai
        </a>
      </p>
    </div>
  );
};

export default ChatApiKeyForm;
