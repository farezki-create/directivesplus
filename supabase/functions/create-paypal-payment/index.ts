
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { amount, currency = 'EUR', isRecurring } = await req.json();

    // Get PayPal access token
    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    const isLive = Deno.env.get("PAYPAL_ENVIRONMENT") === "live";
    const baseURL = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    // Get access token
    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (isRecurring) {
      // Create subscription plan
      const planResponse = await fetch(`${baseURL}/v1/billing/plans`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: "DIRECTIVEPLUS_MONTHLY",
          name: "Don mensuel DirectivePlus",
          description: "Contribution mensuelle pour soutenir DirectivePlus",
          status: "ACTIVE",
          billing_cycles: [{
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: (amount / 100).toString(),
                currency_code: currency
              }
            }
          }],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3
          }
        }),
      });

      const plan = await planResponse.json();

      // Create subscription
      const subscriptionResponse = await fetch(`${baseURL}/v1/billing/subscriptions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: plan.id,
          start_time: new Date().toISOString(),
          subscriber: {
            email_address: user.email
          },
          application_context: {
            brand_name: "DirectivePlus",
            locale: "fr-FR",
            shipping_preference: "NO_SHIPPING",
            user_action: "SUBSCRIBE_NOW",
            payment_method: {
              payer_selected: "PAYPAL",
              payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
            },
            return_url: `${req.headers.get("origin")}/soutenir?success=true&type=subscription&provider=paypal`,
            cancel_url: `${req.headers.get("origin")}/soutenir?canceled=true&provider=paypal`
          }
        }),
      });

      const subscription = await subscriptionResponse.json();
      const approveLink = subscription.links.find((link: any) => link.rel === "approve");

      return new Response(JSON.stringify({ url: approveLink.href }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else {
      // Create one-time payment
      const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: {
              currency_code: currency,
              value: (amount / 100).toString()
            },
            description: "Don à DirectivePlus"
          }],
          application_context: {
            brand_name: "DirectivePlus",
            locale: "fr-FR",
            landing_page: "BILLING",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: `${req.headers.get("origin")}/soutenir?success=true&provider=paypal`,
            cancel_url: `${req.headers.get("origin")}/soutenir?canceled=true&provider=paypal`
          }
        }),
      });

      const order = await orderResponse.json();
      const approveLink = order.links.find((link: any) => link.rel === "approve");

      return new Response(JSON.stringify({ url: approveLink.href }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
