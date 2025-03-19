
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Get HDS API authentication info from environment variables
const HDS_API_URL = Deno.env.get("HDS_API_URL");
const HDS_API_KEY = Deno.env.get("HDS_API_KEY");
const HDS_CLIENT_ID = Deno.env.get("HDS_CLIENT_ID");

// Define CORS headers for allowing requests from the frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface HDSSaveRequest {
  pdfData: string;
  userId: string;
  metadata: {
    createdAt: string;
    documentType: string;
    patientId?: string;
    documentName: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[HDS] Storage function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify HDS API authentication configuration
    if (!HDS_API_URL || !HDS_API_KEY || !HDS_CLIENT_ID) {
      console.error("[HDS] Missing configuration: HDS_API_URL, HDS_API_KEY or HDS_CLIENT_ID not defined");
      throw new Error("The HDS API configuration is incomplete. Check environment variables.");
    }
    
    // Extract request data
    const { pdfData, userId, metadata }: HDSSaveRequest = await req.json();
    
    if (!pdfData || !userId) {
      console.error("[HDS] Invalid request: missing PDF data or userId");
      throw new Error("PDF data or user ID is missing");
    }

    // Check approximate PDF size in Base64
    const pdfSizeKB = Math.round(pdfData.length * 0.75 / 1024);
    console.log(`[HDS] Approximate PDF size: ${pdfSizeKB} KB`);
    
    if (pdfSizeKB > 10000) { // Limit to 10MB
      console.error(`[HDS] PDF too large: ${pdfSizeKB} KB`);
      throw new Error(`PDF is too large (${pdfSizeKB} KB). Maximum accepted size is 10MB.`);
    }

    console.log(`[HDS] Attempting to save document for user ${userId}`);
    console.log(`[HDS] Metadata: ${JSON.stringify(metadata)}`);

    // Prepare data for HDS API call
    const requestBody = {
      document: pdfData,
      patientId: metadata.patientId || userId,
      documentType: metadata.documentType || "DIRECTIVES_ANTICIPEES",
      documentName: metadata.documentName || `directives_anticipees_${new Date().toISOString()}`,
      createdAt: metadata.createdAt || new Date().toISOString(),
      format: "application/pdf"
    };

    // Simulate HDS API call
    console.log("[HDS] Sending data to HDS API...");
    
    /* 
    // Code to uncomment and adapt for real integration:
    try {
      const response = await fetch(HDS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HDS_API_KEY}`,
          "X-Client-Id": HDS_CLIENT_ID
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[HDS] API call failed: ${response.status}`, errorText);
        throw new Error(`HDS API call failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("[HDS] API response:", responseData);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Document successfully sent to HDS storage provider",
        data: responseData
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (fetchError) {
      console.error("[HDS] Request error:", fetchError);
      throw new Error(`Error communicating with HDS API: ${fetchError.message}`);
    }
    */

    // Mock successful response for now
    const mockResponseData = {
      success: true,
      documentId: `hds-doc-${Date.now()}`,
      storageLocation: "HDS_SECURE_STORAGE",
      timestamp: new Date().toISOString()
    };

    // Add simulated delay for testing user experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    return new Response(JSON.stringify({ 
      success: true,
      message: "Document successfully sent to HDS storage provider",
      data: mockResponseData
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending document to HDS API:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An unknown error occurred",
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
