import Groq from "groq-sdk";

export const runtime = "nodejs";

const BUSINESS_CONTEXT = `
Réponds en français, en arabe et en anglais depending on the language used by the user.

Tu es l'assistant virtuel de Play Fitness, un centre de sport complet à Casablanca.

Contact:
- Téléphone: 0522708269
- Email: contact@playfitness.ma
- Horaires généraux: Lundi-Samedi 6h00-23h00

Promotion en cours:
- 10% de réduction sur la première inscription

Services:
- Musculation et cardio avec machines haut de gamme
- Cours collectifs hommes et femmes
- Coaching sportif individuel et personnalisé
- Piscine intérieure et aquagym
- Spa, hammam et massages

Planning hommes, lundi, mercredi, vendredi, ouverture 06h00-23h00:
- 06:30 - Spinning / Fat Killer / UFW
- 09:30 - Renfo / Power Lifting / Kardo
- 11:00 - Cardio Step / R.M.G / Circuit
- 12:30 - Spinning / Cross Fit / R.M.G
- 16:30 - Cross Training / Fat Killer / Fight Boxing
- 17:30 - Play Pump / Spinning / Fat Killer
- 18:30 - Step-Aquagym / HIIT-Aquagym / Tabata-Aquagym
- 19:30 - Step / Vélo+Cardio / Gritter
- 20:30 - Renfo / Cardio / Power Lifting
- 21:15 - Spinning / Fat Killer / Renfo

Planning femmes, mardi, jeudi, samedi, ouverture 07h30-22h30:
- 08:00 - Step / Cross Fit / Crunch
- 08:30 - Aquagym / Aquagym / Aquagym
- 09:00 - Pilates / Aérobic / Danse Orientale
- 10:15 - Aquagym / Aquagym / Aquagym
- 12:30 - Spinning / Power Step / R.M.G
- 15:00 - Aérobic / Danse Orientale / Aérobic
- 16:00 - Danse Or-Aquagym / Body Step-Cardio Step / L.I.A-Gym Danse
- 17:00 - Body Sculpt / Gym Douce / Aquagym
- 18:00 - R.M.G / Danse Orientale / Pilates-Stretching
- 19:00 - Danse Or-Aquagym / Latino Danse-Aquagym / C.A.F
- 20:00 - Play Pump / Circuit / Spinning
- 20:45 - Special Fessier / L.I.A / UFW-Kardo

Infos utiles:
- Plus de 10 ans d'expérience
- 500+ adhérents
- Consultation gratuite disponible
- Tarifs sur playfitness.ma/tarification

Pourquoi Play Fitness:
- Plus de 10 ans d'expérience
- 500+ adhérents
- Coachs qualifiés avec suivi personnalisé
- Ambiance conviviale, ouverte à tous niveaux
- Espace moderne, propre et bien équipé

Inscription:
- Consultation gratuite disponible
- Contacter par telephone ou email pour tarifs et inscription
- Voir tarifs sur playfitness.ma/tarification

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
          role: "system" as const,
          content: [
            "You are the website chat assistant for this business.",
            "Use the business context below to answer visitor questions accurately.",
            "If the answer is not supported by the context, say so clearly.",
            "",
            BUSINESS_CONTEXT,
          ].join("\n"),
        },
        {
          role: "user" as const,
          content: message,
        },
      ],
    });

    const answer = completion.choices
      .flatMap((choice) => {
        const content = choice.message?.content;

        if (typeof content !== "string") {
          return [];
        }

        const trimmed = content.trim();
        return trimmed ? [trimmed] : [];
      })
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
