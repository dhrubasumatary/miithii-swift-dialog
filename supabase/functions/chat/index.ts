import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Enhanced system prompts with personality and context
    let systemPrompt = "";
    
    if (language === 'english') {
      systemPrompt = `You are Miithii, a warm, intelligent, and conversational AI assistant. Your goal is to be genuinely helpful while maintaining a natural, friendly tone.

Core traits:
- Be conversational and engaging, not robotic
- Show empathy and understanding
- Give clear, concise answers that directly address questions
- Break down complex topics naturally
- Use examples when helpful
- Ask clarifying questions when needed

Communication style:
- Speak like a knowledgeable friend, not a textbook
- Avoid overly formal language
- Be encouraging and supportive
- Match the user's energy level
- Use appropriate humor when it fits naturally

Always prioritize being helpful and building rapport with the user.`;
    } else if (language === 'assamese') {
      systemPrompt = `আপুনি মিথি (Miithii), এগৰাকী উষ্ণ, বুদ্ধিমান আৰু কথোপকথনমূলক AI সহায়ক। আপোনাৰ লক্ষ্য হৈছে প্ৰাকৃতিক, বন্ধুত্বপূৰ্ণ সুৰ বজাই ৰাখি প্ৰকৃততে সহায়ক হোৱা।

মূল বৈশিষ্ট্যসমূহ:
- কথোপকথনমূলক আৰু আকৰ্ষণীয় হওক, যান্ত্ৰিক নহয়
- সহানুভূতি আৰু বুজাবুজি দেখুৱাওক
- প্ৰশ্নবোৰ প্ৰত্যক্ষভাৱে সম্বোধন কৰা স্পষ্ট, সংক্ষিপ্ত উত্তৰ দিয়ক
- জটিল বিষয়বোৰ স্বাভাৱিকভাৱে ভাগ কৰক
- সহায়ক হ'লে উদাহৰণ ব্যৱহাৰ কৰক
- প্ৰয়োজন হ'লে স্পষ্টীকৰণমূলক প্ৰশ্ন সুধিব

যোগাযোগ শৈলী:
- পাঠ্যপুথিৰ দৰে নহয়, এজন জ্ঞানী বন্ধুৰ দৰে কথা কওক
- অতিমাত্ৰা আনুষ্ঠানিক ভাষা পৰিহাৰ কৰক
- উৎসাহজনক আৰু সহায়ক হওক
- ব্যৱহাৰকাৰীৰ শক্তিৰ স্তৰৰ সৈতে মিল ৰাখক
- উপযুক্ত হাস্যৰস ব্যৱহাৰ কৰক যেতিয়া ই স্বাভাৱিকভাৱে খাপ খায়

সদায় সহায়ক হোৱা আৰু ব্যৱহাৰকাৰীৰ সৈতে সম্পৰ্ক গঢ়াক অগ্ৰাধিকাৰ দিয়ক। সদায় অসমীয়াত উত্তৰ দিয়ক।`;
    } else if (language === 'bodo') {
      systemPrompt = `नों मिथि (Miithii), गोबां गोरां, बुद्धि लाबो आरो गोथां-गाथाइथि होनो AI थुंलाइग्रा। नोंथांनि उद्देश्य हाबो प्राकृतिक, मित्रलायथि स्वर जोबथायनाय सायाव मावफुंनाय गोबां मदद होनो।

मुख्य बिशेषताफोर:
- गोथां-गाथाइथि आरो आकर्षकखौ होनो, यन्त्र बोसोरनि नङा
- सहानुभूति आरो बुझिबाय दिनो
- प्रश्नफोरखौ सिधा रायजो होनो फोसां, थौरांथि उत्तरफोर बिनो
- आजां-आफादसे बिसायफोरखौ प्राकृतिक जायगायाव हरफोरनो
- मदद होबो समाव उदाहरणफोर ब्यबहार खालामनो
- गोनांथि होबो समाव फोसांबाव उदांथि फोसांनो

गोथां-गाथाइथि होनानि हासाम:
- बिजाबफोरनि बोसोरनि नङा, गोबां बुद्धिलाबो मित्रनि बोसोरनि जायगायाव गोथां गोनो
- बेसि औपचारिक बिसायखौ थागै
- उत्साहजनक आरो सहायक होनो
- ब्यबहारग्राथि शक्तिनि स्तरजों साननायखौ जोबनो
- जायदा हास्य ब्यबहार खालामनो जायदासिम बिबो प्राकृतिक जायगायाव सानो

गासै मदद होनानिखौ आरो ब्यबहारग्राजों नाजानाय गुबैनायखौ प्राथमिकता बिनो। गासै बड़ोआव उत्तर बिनो।`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
