import Groq from "groq-sdk";

const BUSINESS_CONTEXT = `
Acme Studio is a boutique product design and development agency.

What we do:
- Design and build modern websites and web apps
- Offer brand strategy, UX design, and front-end development
- Work with startups, consultants, and small businesses

How to answer:
- Be concise, helpful, and professional
- Answer using only the information in this context when possible
- If a question is outside the business context, say you can only answer questions about Acme Studio
- Invite the visitor to leave contact details or ask for a consultation when it fits naturally
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
