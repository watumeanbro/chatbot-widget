"use client";

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
    script.dataset.title = "Assistente Accadueo Club";
    script.dataset.subtitle =
      "Chiedimi info su corsi, abbonamenti e orari";
    script.dataset.inline = "true";
    script.dataset.mountId = "chat-widget-inline-slot";
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
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-start rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_28%),linear-gradient(180deg,#131313_0%,#050505_100%)] px-6 py-12 shadow-[0_30px_100px_rgba(0,0,0,0.45)] md:px-12 md:py-16">
        <h1 className="text-center font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
          Accadueo Club - Chatbot Demo
        </h1>
        <div
          id="chat-widget-inline-slot"
          className="mt-10 flex w-full justify-center"
        />
      </div>
    </main>
  );
}
