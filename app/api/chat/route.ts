import Groq from "groq-sdk";

const BUSINESS_CONTEXT = `
You are a helpful assistant for 20Hours Club, a low-cost all-inclusive gym chain in Milan with 7-9 locations.

Language:
- Answer in the same language the customer uses: Italian or English

Locations and contacts:
- Viale Liguria 46 - tel. 02.89403040
- Via Brioschi 26 - tel. 02.8394233
- Via Panzeri 10 - tel. 02.36559189
- Via Pogliaghi 1 - tel. 02.84193700
- Via Volterra 12 - tel. 02.36597080
- Via Sismondi 43 - tel. 02.70109939
- Via Mezzofanti 14 - tel. 02.70109939
- Via Cucchiari 4 - tel. 02.83421383
- Via Acerbi 34 - tel. 02.66200247

Hours:
- Monday to Friday: 7:00-22:00 or 23:00 depending on location
- Saturday: 8:00-20:00
- Sunday: 10:00-19:00
- Hours vary by location

Pricing:
- 9 month membership: EUR 297
- Includes all classes, equipment, and CONI registration worth EUR 40
- 7 day trial: EUR 9.90 for 3 entries
- Free day pass available to book online

Services:
- Weights and cardio gym
- Group classes including abs, body sculpt, and total tone
- Pool
- Sauna and spa
- Functional training
- Free annual training plan from qualified trainers

App:
- Free "20 Hours Fitness" app
- Use it for class schedules, workouts, and VIP bookings

How to answer:
- Be concise, helpful, and professional
- Answer using only the information in this context when possible
- If a question is outside the business context, say so clearly
`.trim();

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type ChatRequest = {
  message?: unknown;
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing GROQ_API_KEY. Add it in your deployment settings before using the widget.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  let payload: ChatRequest;

  try {
    payload = (await request.json()) as ChatRequest;
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!message) {
    return Response.json(
      { error: "Message is required." },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: [
            "You are the website chat assistant for this business.",
            "Use the business context below to answer visitor questions accurately.",
            "If the answer is not supported by the context, say so clearly.",
            "",
            BUSINESS_CONTEXT,
          ].join("\n"),
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const answer = completion.choices
      .map((choice) => choice.message?.content?.trim())
      .filter(Boolean)
      .join("\n\n");

    return Response.json(
      {
        answer:
          answer ||
          "I could not generate a reply. Please try rephrasing your question.",
      },
      {
        headers: corsHeaders,
      }
    );
  } catch {
    return Response.json(
      {
        error: "The assistant could not reach Groq right now. Try again in a moment.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
