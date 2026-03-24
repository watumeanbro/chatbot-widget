"use client";

import { Button, Card } from "@heroui/react";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const existingScript = document.getElementById("chat-widget-preview-script");

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.id = "chat-widget-preview-script";
    script.src = "/widget.js";
    script.async = true;
    script.dataset.title = "Talk to Acme Studio";
    script.dataset.subtitle = "Ask about services, pricing, or timelines.";
    document.body.appendChild(script);

    return () => {
      script.remove();

      const widgetRoot = document.getElementById("claude-chat-widget-root");
      widgetRoot?.remove();
      delete (window as Window & { __CLAUDE_CHAT_WIDGET_LOADED__?: boolean })
        .__CLAUDE_CHAT_WIDGET_LOADED__;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between gap-8 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_30%),linear-gradient(180deg,#151515_0%,#050505_100%)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] md:p-12">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              embeddable groq chatbot widget
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                a clean dark chat widget you can drop onto any site
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                the bubble lives in the bottom right, opens a polished chat
                panel, and answers with claude using one editable business
                context block on the server.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                as="a"
                href="#embed"
                radius="full"
                className="bg-white px-6 font-medium text-black"
              >
                copy embed code
              </Button>
              <Button
                as="a"
                href="#deploy"
                variant="bordered"
                radius="full"
                className="border-white/20 bg-white/5 px-6 text-white"
              >
                deploy steps
              </Button>
            </div>
          </div>

          <Card className="border border-white/10 bg-white/5 p-6 text-white shadow-none">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                what you can swap
              </p>
              <div className="space-y-3 text-sm leading-6 text-white/72">
                <p>
                  `BUSINESS_CONTEXT` in the api route controls what the assistant
                  knows.
                </p>
                <p>
                the widget title, subtitle, and endpoint can be changed from
                the script tag.
              </p>
              <p>
                  the groq key stays server-side, so the embed is safe to
                  use on client websites.
              </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card
            id="embed"
            className="border border-white/10 bg-black/30 p-6 text-white shadow-none"
          >
            <div className="space-y-4">
              <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold tracking-[-0.03em]">
                embed code
              </h2>
              <p className="text-sm leading-6 text-white/68">
                load the script from your deployed app. it injects the chat
                bubble automatically.
              </p>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/85">
{`<script
  src="https://your-domain.vercel.app/widget.js"
  data-title="Talk to Acme Studio"
  data-subtitle="Ask about services, pricing, or timelines."
  defer
></script>`}
              </pre>
            </div>
          </Card>

          <Card
            id="deploy"
            className="border border-white/10 bg-black/30 p-6 text-white shadow-none"
          >
            <div className="space-y-4">
              <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold tracking-[-0.03em]">
                deploy steps
              </h2>
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-white/72">
                <li>push this repo to github.</li>
                <li>import it into vercel.</li>
                <li>add `GROQ_API_KEY` in project environment variables.</li>
                <li>deploy and copy your production url.</li>
                <li>paste the script tag onto any client website.</li>
              </ol>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
