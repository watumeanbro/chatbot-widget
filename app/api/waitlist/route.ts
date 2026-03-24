import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";

// We validate the incoming request body with zod to guarantee shape + email format.
const BODY_SCHEMA = z.object({
  email: z.string().trim().email(),
});

// We reject common domain typos to prevent users from missing the welcome email.
const COMMON_DOMAIN_TYPOS = new Set([
  "gamil.com",
  "gmial.com",
  "gmal.com",
  "gmail.co",
  "yahooo.com",
  "yaho.com",
  "hotmial.com",
  "outlok.com",
]);

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function isTypoEmail(email: string) {
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) return false;
  const domain = email.slice(atIndex + 1).toLowerCase();
  return COMMON_DOMAIN_TYPOS.has(domain);
}

async function trySendWelcomeEmail(email: string) {
  const resend = getResendClient();
  if (!resend) return;

  // NOTE: Resend requires an email address in the `from` field.
  // This keeps the visible sender name as "CopyCritic" while using Resend's
  // default dev sender email. If you have a verified domain, swap this to your
  // own address (e.g. "CopyCritic <hello@yourdomain.com>").
  const from = "CopyCritic <onboarding@resend.dev>";

  const subject = "You're on the CopyCritic waitlist!";

  const text = `Hey!

You're on the list – thanks for signing up and welcome to CopyCritic.

I'm Malak, and I'm building this because copywriting is one of the most important parts of any landing page — it's what gets people to sign up, buy, and stick around. But when I was working on my own landing page, I couldn't find a single tool that would just tell me honestly: "here's what's wrong with your copy, and here's how to fix it."

So I'm building it myself.

Here's what being early means for you:

1. You'll get in before anyone else — and try it completely free
2. I'll share what I'm building along the way, the wins and the struggles
3. Early members get exclusive perks — more on that soon

Hit reply and tell me about what you're working on? I read every single reply and I'd love to know.


Cheers,
Malak
copycritic.online
`;

  // If sending fails for any reason, we intentionally do NOT fail the signup.
  // The waitlist insert is the source of truth.
  try {
    await resend.emails.send({
      from,
      to: email,
      subject,
      text,
    });
  } catch {
    // swallow
  }
}

async function getWaitlistCount() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: "Supabase is not configured." as const };
  }

  // Equivalent to `SELECT COUNT(*) FROM waitlist` (without returning any rows).
  const { count, error } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  if (error) return { error: "Failed to fetch waitlist count." as const };
  return { count: count ?? 0 };
}

export async function GET() {
  try {
    const result = await getWaitlistCount();
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ count: result.count }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 },
      );
    }

    const rawBody = await req.json().catch(() => null);
    const parsed = BODY_SCHEMA.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    if (isTypoEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const { data: existing, error: existsError } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existsError) {
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    if (existing?.email) {
      return NextResponse.json(
        { error: "You are already on the waitlist!" },
        { status: 409 },
      );
    }

    const { error: insertError } = await supabase.from("waitlist").insert({
      email,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      const maybeDuplicate =
        // Postgres unique violation (seen via PostgREST)
        (insertError as { code?: string }).code === "23505" ||
        insertError.message.toLowerCase().includes("duplicate");

      if (maybeDuplicate) {
        return NextResponse.json(
          { error: "You are already on the waitlist!" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    // Fire-and-forget welcome email (signup is still successful even if this fails).
    void trySendWelcomeEmail(email);

    const countResult = await getWaitlistCount();
    if ("error" in countResult) {
      return NextResponse.json(
        { success: true, count: 0 },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: true, count: countResult.count },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
