import { getChatClientConfig } from "@/lib/chat-clients";

export const runtime = "nodejs";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type ChatRequest = {
  client?: unknown;
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
  const clientId =
    typeof payload.client === "string" ? payload.client.trim() : "";
  const clientConfig = getChatClientConfig(clientId);

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
    const groqResponse = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
              clientConfig.businessContext,
            ].join("\n"),
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!groqResponse.ok) {
      return Response.json(
        {
          error:
            "Groq could not answer that request right now. Check the API key and try again.",
        },
        {
          status: groqResponse.status,
          headers: corsHeaders,
        },
      );
    }

    const data = (await groqResponse.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
        };
      }>;
    };

    const answer =
      data.choices
        ?.map((choice) => choice.message?.content?.trim())
        .filter((content): content is string => Boolean(content))
        .join("\n\n") || "";

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
