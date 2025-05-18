
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// This is a publishable key, so it's safe to include in client-side code
const stripePromise = loadStripe('pk_test_51OeDsAKTG7wZzxBTAUBHUJSiN0B5RUOQ0FYWrPesD66IdSujzAdV7vCR6QPpgPYSbpNFqPzqxGrpAMw9jdjOUcP700t7fwugJl');

export interface CreateDonationSessionParams {
  amount: number;
  isRecurring: boolean;
}

export const createDonationSession = async ({ amount, isRecurring }: CreateDonationSessionParams) => {
  try {
    // This would normally call your backend API to create a Stripe session
    // For now, we'll simulate this with a client-side implementation
    // In a real implementation, you'd use a Supabase Edge Function
    
    // Create Stripe Checkout Session on your server
    const response = await fetch('/api/create-donation-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        isRecurring,
        currency: 'eur', // Use Euro as the currency
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const session = await response.json();
    
    // When testing without a backend, you can comment this out
    // and use the mockRedirect below
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });
      
      if (error) {
        console.error('Error redirecting to checkout:', error);
        throw error;
      }
    }
    
    // Mock implementation for testing without a backend
    // mockRedirect(amount, isRecurring);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating donation session:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la création de la session de don.' 
    };
  }
};

// For testing without a backend
const mockRedirect = (amount: number, isRecurring: boolean) => {
  console.log(`MOCK: Redirecting to Stripe for ${isRecurring ? 'recurring' : 'one-time'} payment of €${amount/100}`);
  alert(`Cette fonctionnalité nécessite une intégration back-end avec Stripe. En production, vous seriez redirigé vers la page de paiement Stripe pour un don ${isRecurring ? 'mensuel' : 'ponctuel'} de ${amount/100}€.`);
};
