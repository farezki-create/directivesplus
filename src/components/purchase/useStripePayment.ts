
import * as React from "react";
import { loadStripe, Stripe, StripeElements, StripeElement } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51OvZy8KJHojJ27FpoHYRFw3pYJB93qZFLbOieT47naK9trTRqUUfWVM4kugAGoN7V6lDaUxydQ6k9Kk4FvFa2gvX00RzW8wPxX');

export const useStripePayment = (cardElementRef: React.RefObject<HTMLDivElement>) => {
  const [stripe, setStripe] = React.useState<Stripe | null>(null);
  const [elements, setElements] = React.useState<StripeElements | null>(null);
  const [card, setCard] = React.useState<StripeElement | null>(null);

  React.useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise;
      if (stripeInstance) {
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
          setCard(cardElement);
        }
      }
    };

    initStripe();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, []);

  return { stripe, elements, card };
};
