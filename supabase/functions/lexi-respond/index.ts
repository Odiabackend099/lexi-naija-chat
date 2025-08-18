import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let input = '';
    let sessionId: string | undefined;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      input = (body.input || body.text || '').toString();
      sessionId = body.sessionId as string | undefined;
    } else {
      const url = new URL(req.url);
      input = url.searchParams.get('input') || '';
      sessionId = url.searchParams.get('sessionId') || undefined;
    }

    if (!input || input.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Missing input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `You are Lexi, a compliance-ready Nigerian financial assistant for LexiPay (by ODIA.Dev). 
- Be concise, accurate and action-oriented.
- Always assume context: Nigerian SMEs, payments, transfers, balances, invoices, Flutterwave rails.
- If user asks to send money, ask for: amount, recipient name, bank, and purpose. Confirm before proceeding.
- Never fabricate facts. If uncertain, ask a clarifying question.
- Tone: professional, warm, Nigerian English.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        // New models require max_completion_tokens instead of max_tokens
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return new Response(JSON.stringify({ error: 'AI service failed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ text, sessionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('lexi-respond error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
