import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

interface StoreSettings {
  store: {
    name: string;
    currency: string;
    timezone: string;
    taxRate: number;
  };
  shipping: {
    freeThreshold: number;
    domesticRate: number;
    expeditedRate: number;
  };
  business: {
    hours: {
      monday: { open: string; close: string; };
      tuesday: { open: string; close: string; };
      wednesday: { open: string; close: string; };
      thursday: { open: string; close: string; };
      friday: { open: string; close: string; };
      saturday: { open: string; close: string; };
      sunday: { open: string; close: string; };
    };
    phone: string;
    email: string;
  };
  features: {
    chatEnabled: boolean;
    voiceSearchEnabled: boolean;
    personalStylistEnabled: boolean;
    arTryOnEnabled: boolean;
    sizeRecommendationEnabled: boolean;
  };
}

const defaultSettings: StoreSettings = {
  store: {
    name: "KCT Menswear",
    currency: "USD",
    timezone: "America/New_York", 
    taxRate: 0.08
  },
  shipping: {
    freeThreshold: 15000, // $150.00 in cents
    domesticRate: 995,    // $9.95 in cents
    expeditedRate: 2495   // $24.95 in cents
  },
  business: {
    hours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "10:00", close: "19:00" },
      sunday: { open: "12:00", close: "18:00" }
    },
    phone: "(313) 525-2424",
    email: "info@kctmenswear.com"
  },
  features: {
    chatEnabled: true,
    voiceSearchEnabled: true,
    personalStylistEnabled: true,
    arTryOnEnabled: false,
    sizeRecommendationEnabled: true
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Return the default settings for now
    // In the future, this could be enhanced to fetch from a settings table
    return new Response(
      JSON.stringify(defaultSettings),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in get-public-settings:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        fallback: defaultSettings
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})