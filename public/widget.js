(() => {
  if (window.__CLAUDE_CHAT_WIDGET_LOADED__) {
    return;
  }

  window.__CLAUDE_CHAT_WIDGET_LOADED__ = true;

  const script =
    document.currentScript ||
    Array.from(document.scripts).find((entry) =>
      entry.src.includes("/widget.js")
    );

  const apiBase =
    script?.dataset.apiBase ||
    new URL(script?.src || window.location.href).origin;
  const endpoint = `${apiBase.replace(/\/$/, "")}/api/chat`;
  const title = script?.dataset.title || "Ask us anything";
  const subtitle =
    script?.dataset.subtitle || "We usually reply in a few seconds.";
  const accent = script?.dataset.accent || "#ffffff";
  const inline = script?.dataset.inline === "true";
  const startOpen = script?.dataset.startOpen === "true" || inline;
  const mountId = script?.dataset.mountId;

  const init = () => {
    if (!document.body) {
      return;
    }

    const mountTarget = mountId
      ? document.getElementById(mountId) || document.body
      : document.body;
    const host = document.createElement("div");
    host.id = "claude-chat-widget-root";
    mountTarget.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = `
    <style>
      :host {
        all: initial;
      }

      *, *::before, *::after {
        box-sizing: border-box;
      }

      .widget-shell {
        position: ${inline ? "relative" : "fixed"};
        right: ${inline ? "auto" : "24px"};
        bottom: ${inline ? "auto" : "24px"};
        width: ${inline ? "min(420px, 100%)" : "auto"};
        margin: ${inline ? "0 auto" : "0"};
        z-index: ${inline ? "1" : "2147483647"};
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #ffffff;
      }

      .chat-button {
        width: 64px;
        height: 64px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        background:
          radial-gradient(circle at top, rgba(255, 255, 255, 0.18), transparent 55%),
          linear-gradient(180deg, #191919 0%, #0a0a0a 100%);
        color: #ffffff;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
      }

      .chat-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 22px 56px rgba(0, 0, 0, 0.46);
      }

      .chat-button:focus-visible,
      .send-button:focus-visible,
      .close-button:focus-visible,
      .composer:focus-visible {
        outline: 2px solid ${accent};
        outline-offset: 2px;
      }

      .chat-panel {
        width: ${inline ? "min(420px, 100%)" : "min(380px, calc(100vw - 24px))"};
        height: min(620px, calc(100vh - 110px));
        display: ${startOpen ? "flex" : "none"};
        flex-direction: column;
        margin-top: ${inline ? "0" : "14px"};
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        overflow: hidden;
        background:
          radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 38%),
          linear-gradient(180deg, rgba(19, 19, 19, 0.98), rgba(7, 7, 7, 0.98));
        backdrop-filter: blur(18px);
        box-shadow: 0 22px 70px rgba(0, 0, 0, 0.48);
        transform-origin: bottom right;
        animation: panel-in 180ms ease;
      }

      .chat-panel[data-open="true"] {
        display: flex;
      }

      .widget-shell[data-inline="true"] .chat-button {
        display: none;
      }

      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 18px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .header-copy h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .header-copy p {
        margin: 6px 0 0;
        color: rgba(255, 255, 255, 0.64);
        font-size: 13px;
        line-height: 1.45;
      }

      .close-button {
        width: 36px;
        height: 36px;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        color: #ffffff;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
      }

      .messages {
        flex: 1;
        padding: 18px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 24%),
          transparent;
      }

      .message {
        max-width: 88%;
        padding: 12px 14px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .message.assistant {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .message.user {
        align-self: flex-end;
        background: #ffffff;
        color: #090909;
      }

      .message.status {
        align-self: flex-start;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.58);
        padding: 0 2px;
      }

      .composer-wrap {
        padding: 14px 14px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .composer-shell {
        display: flex;
        gap: 10px;
        align-items: flex-end;
        padding: 10px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.05);
      }

      .composer {
        flex: 1;
        min-height: 44px;
        max-height: 120px;
        resize: none;
        border: 0;
        background: transparent;
        color: #ffffff;
        font: inherit;
        line-height: 1.45;
        padding: 4px 6px;
      }

      .composer::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      .composer:focus {
        outline: none;
      }

      .send-button {
        min-width: 48px;
        height: 48px;
        border: 0;
        border-radius: 16px;
        background: #ffffff;
        color: #090909;
        font-weight: 600;
        cursor: pointer;
        padding: 0 14px;
      }

      .send-button[disabled] {
        opacity: 0.5;
        cursor: wait;
      }

      @keyframes panel-in {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @media (max-width: 640px) {
        .widget-shell {
          right: ${inline ? "auto" : "12px"};
          bottom: ${inline ? "auto" : "12px"};
        }

        .chat-panel {
          width: ${inline ? "100%" : "calc(100vw - 24px)"};
          height: min(72vh, 560px);
          border-radius: 22px;
        }
      }
    </style>
    <div class="widget-shell" data-inline="${inline}">
      <button class="chat-button" type="button" aria-label="Open chat">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 10.5H17M7 14H13.5M20 11.6C20 16.07 16.42 19.7 12 19.7C10.63 19.7 9.35 19.35 8.23 18.74L4 20L5.25 15.97C4.47 14.75 4 13.28 4 11.6C4 7.13 7.58 3.5 12 3.5C16.42 3.5 20 7.13 20 11.6Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <section class="chat-panel" aria-label="Chat window" data-open="${startOpen}">
        <div class="header">
          <div class="header-copy">
            <h2></h2>
            <p></p>
          </div>
          <button class="close-button" type="button" aria-label="Close chat">&times;</button>
        </div>
        <div class="messages" role="log" aria-live="polite"></div>
        <form class="composer-wrap">
          <div class="composer-shell">
            <textarea class="composer" rows="1" placeholder="Ask a question..."></textarea>
            <button class="send-button" type="submit">Send</button>
          </div>
        </form>
      </section>
    </div>
    `;

    const panel = shadowRoot.querySelector(".chat-panel");
    const openButton = shadowRoot.querySelector(".chat-button");
    const closeButton = shadowRoot.querySelector(".close-button");
    const messages = shadowRoot.querySelector(".messages");
    const form = shadowRoot.querySelector(".composer-wrap");
    const composer = shadowRoot.querySelector(".composer");
    const sendButton = shadowRoot.querySelector(".send-button");
    const heading = shadowRoot.querySelector(".header-copy h2");
    const subheading = shadowRoot.querySelector(".header-copy p");

    heading.textContent = title;
    subheading.textContent = subtitle;

    const appendMessage = (content, role) => {
      const node = document.createElement("div");
      node.className = `message ${role}`;
      node.textContent = content;
      messages.appendChild(node);
      messages.scrollTop = messages.scrollHeight;
      return node;
    };

    const setOpen = (isOpen) => {
      panel.dataset.open = String(isOpen);

      if (isOpen) {
        composer.focus();
      } else {
        openButton.focus();
      }
    };

    const autoResize = () => {
      composer.style.height = "0px";
      composer.style.height = `${Math.min(composer.scrollHeight, 120)}px`;
    };

    appendMessage(
      "Hi there. Ask a question about the business and I'll answer from the company info provided.",
      "assistant"
    );

    openButton.addEventListener("click", () => setOpen(true));
    closeButton.addEventListener("click", () => {
      if (!inline) {
        setOpen(false);
      }
    });

    composer.addEventListener("input", autoResize);
    composer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!inline) {
          setOpen(false);
        }
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const message = composer.value.trim();

      if (!message) {
        return;
      }

      appendMessage(message, "user");
      composer.value = "";
      autoResize();
      composer.disabled = true;
      sendButton.disabled = true;

      const statusNode = appendMessage("Thinking...", "status");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();
        statusNode.remove();

        if (!response.ok) {
          appendMessage(
            data.error || "Something went wrong while getting a reply.",
            "assistant"
          );
        } else {
          appendMessage(
            data.answer || "I could not generate a reply. Please try again.",
            "assistant"
          );
        }
      } catch {
        statusNode.remove();
        appendMessage(
          "The chat service is unavailable right now. Please try again in a moment.",
          "assistant"
        );
      } finally {
        composer.disabled = false;
        sendButton.disabled = false;
        composer.focus();
      }
    });
  };

  if (document.body) {
    init();
    return;
  }

  window.addEventListener("DOMContentLoaded", init, { once: true });
})();
