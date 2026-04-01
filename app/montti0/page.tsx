"use client";

import { useEffect } from "react";
import { CHAT_CLIENTS } from "@/lib/chat-clients";

export default function MonttiZeroPage() {
  const client = CHAT_CLIENTS.montti0;

  useEffect(() => {
    const existingScript = document.getElementById("chat-widget-preview-script");

    if (existingScript) {
      existingScript.remove();
    }

    const existingWidgetRoot = document.getElementById("claude-chat-widget-root");
    existingWidgetRoot?.remove();
    delete (window as Window & { __CLAUDE_CHAT_WIDGET_LOADED__?: boolean })
      .__CLAUDE_CHAT_WIDGET_LOADED__;

    const script = document.createElement("script");
    script.id = "chat-widget-preview-script";
    script.src = "/widget.js";
    script.async = true;
    script.dataset.id = client.id;
    script.dataset.title = client.widgetTitle;
    script.dataset.subtitle = client.widgetSubtitle;
    script.dataset.greeting = client.greeting;
    document.body.appendChild(script);

    return () => {
      script.remove();

      const widgetRoot = document.getElementById("claude-chat-widget-root");
      widgetRoot?.remove();
      delete (window as Window & { __CLAUDE_CHAT_WIDGET_LOADED__?: boolean })
        .__CLAUDE_CHAT_WIDGET_LOADED__;
    };
  }, [client]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-12 text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,185,253,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(220,185,253,0.18),transparent_24%)]" />
      <h1 className="relative text-center font-sans text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
        <span className="text-[#DCB9FD]">Montti</span>
        <span> — Chatbot Demo</span>
      </h1>
    </main>
  );
}
