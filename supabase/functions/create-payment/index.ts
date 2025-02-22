
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from 'https://esm.sh/stripe@13.6.0'

const stripeClient = new stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: stripe.createFetchHttpClient(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { amount, email } = await req.json()

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: 'eur',
      payment_method_types: ['card'],
      receipt_email: email,
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
