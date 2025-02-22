
import * as React from "react";
import { loadStripe, Stripe, StripeElements, StripeElement } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51OvZy8KJHojJ27FpoHYRFw3pYJB93qZFLbOieT47naK9trTRqUUfWVM4kugAGoN7V6lDaUxydQ6k9Kk4FvFa2gvX00RzW8wPxX');

export const useStripePayment = (cardElementRef: React.RefObject<HTMLDivElement>) => {
  const [stripe, setStripe] = React.useState<Stripe | null>(null);
  const [elements, setElements] = React.useState<StripeElements | null>(null);
  const [card, setCard] = React.useState<StripeElement | null>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        if (!stripeInstance) {
          throw new Error("Impossible d'initialiser Stripe");
        }

        setStripe(stripeInstance);
        const elements = stripeInstance.elements();
        setElements(elements);
        
        const cardElement = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        });

        if (cardElementRef.current) {
          cardElement.mount(cardElementRef.current);
          cardElement.on('change', (event) => {
            if (event.error) {
              setError(event.error.message);
            } else {
              setError("");
            }
          });
          setCard(cardElement);
        } else {
          throw new Error("L'élément de carte n'a pas pu être monté");
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors de l'initialisation du paiement");
      }
    };

    initStripe();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, []);

  return { stripe, elements, card, error };
};
