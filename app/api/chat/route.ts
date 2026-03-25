import Groq from "groq-sdk";

const BUSINESS_CONTEXT = `
You are a helpful assistant for Accadueo Club, a gym with pool in Milan.

Language:
- Answer in the same language the customer uses: Italian or English

Location:
- Viale Lucania 27, 20139 Milano

Phone:
- 02 55230786

Hours:
- Monday to Friday: weights room 6:30-22:30, pools 7:30-22:30
- Saturday and Sunday: 8:30-19:30
- Activities end 30 minutes before closing

Memberships:
- Cardio Power, weights room only
- 1 week: EUR 50 + registration EUR 25 + membership card EUR 10
- 2 weeks: EUR 40 per week + registration EUR 25 + membership card EUR 10
- 3 months: EUR 99 per month + registration EUR 89 + membership card EUR 10
- 9 months: EUR 69 per month + registration EUR 89 + membership card EUR 10
- Open Basic, weights room + pool + group classes
- 1 month: EUR 120 + registration EUR 50 + membership card EUR 10
- 3 months: EUR 109 per month + registration EUR 89 + membership card EUR 10
- 9 months: EUR 77 per month + registration EUR 89 + membership card EUR 10

Adult services:
- Weights room
- Acquagym
- Idrospinning
- Fitness classes
- Functional training
- Personal trainer
- Idrokinesiterapia
- Classes for pregnant women
- Free swimming
- Master swimming

Children services:
- Baby swimming from 3 months
- Swimming school
- Private lessons
- Swimming for schools

Physiotherapy:
- Accadueo Osteo Physio Center available

Other info:
- Open 7 days a week
- Over 25 years of experience
- No automatic membership renewal
- Free trial day available
- Free app available to book classes and track workouts
- Discounted rates for parents of kids enrolled in swimming courses
- Metro MM3 yellow line, Brenta or Corvetto stop

Facilities:
- Pool
- Gym

Social media:
- Instagram: https://www.instagram.com/accadueoclub/
- TikTok: https://www.tiktok.com/@accadueoclub
- Facebook: https://www.facebook.com/accadueoclub01

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
