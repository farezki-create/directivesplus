
// Utility for interacting with the Perplexity API

// Store API key for reuse
let perplexityApiKey: string | null = null;

export const setPerplexityApiKey = (apiKey: string) => {
  perplexityApiKey = apiKey;
  // Store in session storage so it persists during the session
  sessionStorage.setItem('perplexity_api_key', apiKey);
};

export const getPerplexityApiKey = (): string | null => {
  if (perplexityApiKey) return perplexityApiKey;
  
  // Try to get from session storage
  const storedKey = sessionStorage.getItem('perplexity_api_key');
  if (storedKey) {
    perplexityApiKey = storedKey;
    return storedKey;
  }
  
  return null;
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export const sendChatMessage = async (options: ChatCompletionOptions) => {
  const apiKey = getPerplexityApiKey();
  
  if (!apiKey) {
    throw new Error("API key not set. Please set your Perplexity API key first.");
  }
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.1-sonar-small-128k-online',
        messages: options.messages,
        temperature: options.temperature || 0.2,
        max_tokens: options.maxTokens || 1000,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API Error: ${response.status} ${errorData ? JSON.stringify(errorData) : response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    throw error;
  }
};
