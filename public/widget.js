(() => {
  if (window.__CLAUDE_CHAT_WIDGET_LOADED__) {
    return;
  }

  window.__CLAUDE_CHAT_WIDGET_LOADED__ = true;

  const script =
    document.currentScript ||
    Array.from(document.scripts).find((entry) =>
      entry.src.includes("/widget.js"),
    );

  const apiBase =
    script?.dataset.apiBase ||
    new URL(script?.src || window.location.href).origin;
  const configEndpoint = `${apiBase.replace(/\/$/, "")}/api/chat/config`;
  const endpoint = `${apiBase.replace(/\/$/, "")}/api/chat`;
  const client = script?.dataset.id || script?.dataset.client || "playfitness";
  const titleOverride = script?.dataset.title;
  const subtitleOverride = script?.dataset.subtitle;
  const greetingOverride = script?.dataset.greeting;
  const inline = script?.dataset.inline === "true";
  const startOpen = script?.dataset.startOpen === "true";
  const mountId = script?.dataset.mountId;
  const conversationHistory = [];

  const defaultPromptSuggestions = (promptSuggestions) =>
    Array.isArray(promptSuggestions)
      ? promptSuggestions
          .filter(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.question === "string" &&
              typeof item.answer === "string",
          )
          .map((item) => ({
            answer: item.answer.trim(),
            question: item.question.trim(),
          }))
          .filter((item) => item.question && item.answer)
      : [];

  const init = async () => {
    if (!document.body) {
      return;
    }

    let config;

    try {
      const response = await fetch(
        `${configEndpoint}?client=${encodeURIComponent(client)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return;
      }

      config = await response.json();
    } catch {
      return;
    }

    if (!config?.enabled) {
      return;
    }

    const isMonttiTheme =
      config.themeVariant === "montti" ||
      config.themeVariant === "notion-montti";
    const isNotionMonttiTheme = config.themeVariant === "notion-montti";
    const accent =
      script?.dataset.color ||
      script?.dataset.accent ||
      (isNotionMonttiTheme ? "#DCB9FD" : isMonttiTheme ? "#DFBEFE" : "#111111");
    const title = titleOverride || config.widgetTitle || "Ask us anything";
    const subtitle =
      subtitleOverride ||
      config.widgetSubtitle ||
      "We usually reply in a few seconds.";
    const greeting =
      greetingOverride ||
      config.greeting ||
      "Hi there. Ask a question about the business and I'll answer from the company info provided.";
    const teaserText = config.teaserText || "";
    const teaserDurationMs =
      typeof config.teaserDurationMs === "number" ? config.teaserDurationMs : 0;
    const promptSuggestions = defaultPromptSuggestions(config.promptSuggestions);
    const placeholder =
      isMonttiTheme ? "ktb sou2alek..." : "Ask a question...";
    const mountTarget = mountId
      ? document.getElementById(mountId) || document.body
      : document.body;
    const host = document.createElement("div");
    host.id = "claude-chat-widget-root";
    mountTarget.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: "open" });
    const chatIcon = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 10.5H17M7 14H13.5M20 11.6C20 16.07 16.42 19.7 12 19.7C10.63 19.7 9.35 19.35 8.23 18.74L4 20L5.25 15.97C4.47 14.75 4 13.28 4 11.6C4 7.13 7.58 3.5 12 3.5C16.42 3.5 20 7.13 20 11.6Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    const launcherIcon = `<span class="chat-button-icon">${chatIcon}</span>`;
    const headerBadge = isMonttiTheme
      ? `<div class="header-badge" aria-hidden="true">${chatIcon}</div>`
      : "";
    const teaserMarkup =
      teaserText && !inline
        ? `<div class="launcher-teaser" role="note">${teaserText}</div>`
        : "";

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
          width: ${inline ? "min(430px, 100%)" : "auto"};
          margin: ${inline ? "0 auto" : "0"};
          z-index: ${inline ? "1" : "2147483647"};
          display: flex;
          flex-direction: column;
          align-items: ${inline ? "center" : "flex-end"};
          gap: 14px;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #ffffff;
        }

        .launcher {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
        }

        .widget-shell[data-open="true"] .launcher {
          opacity: 0;
          pointer-events: none;
          transform: translateY(8px) scale(0.96);
          visibility: hidden;
        }

        .launcher-teaser {
          position: relative;
          max-width: 220px;
          padding: 12px 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.94);
          color: #0f0f0f;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
        }

        .launcher-teaser::after {
          content: "";
          position: absolute;
          right: 14px;
          bottom: -6px;
          width: 14px;
          height: 14px;
          background: inherit;
          border-radius: 4px;
          transform: rotate(45deg);
        }

        .chat-button {
          width: 64px;
          height: 64px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          background:
            radial-gradient(circle at top, rgba(255, 255, 255, 0.24), transparent 58%),
            linear-gradient(180deg, ${accent} 0%, #0a0a0a 100%);
          color: #ffffff;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.38);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .chat-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.44);
        }

        .chat-button:focus-visible,
        .send-button:focus-visible,
        .close-button:focus-visible,
        .composer:focus-visible,
        .suggestion-button:focus-visible {
          outline: 2px solid ${accent};
          outline-offset: 2px;
        }

        .chat-button-icon,
        .header-badge svg {
          display: grid;
          place-items: center;
        }

        .chat-button-icon svg,
        .header-badge svg {
          width: 22px;
          height: 22px;
        }

        .chat-panel {
          width: ${inline ? "min(430px, 100%)" : "min(396px, calc(100vw - 24px))"};
          height: min(640px, calc(100vh - 116px));
          display: ${startOpen ? "flex" : "none"};
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          background:
            radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 34%),
            linear-gradient(180deg, rgba(23, 23, 23, 0.98), rgba(10, 10, 10, 0.99));
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(18px);
          transform-origin: bottom right;
          animation: panel-in 180ms ease;
        }

        .chat-panel[data-open="true"] {
          display: flex;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 18px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
        }

        .header-main {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .header-badge {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #f4ede4;
          color: #111111;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.06);
        }

        .header-copy h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
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
          flex-shrink: 0;
        }

        .messages {
          flex: 1;
          padding: 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
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

        .suggestions {
          display: none;
          flex-direction: column;
          gap: 8px;
          padding-top: 6px;
        }

        .suggestions[data-visible="true"] {
          display: flex;
        }

        .suggestions-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0 2px 2px;
        }

        .suggestion-button {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 18px;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          transition: background 160ms ease, transform 160ms ease;
        }

        .suggestion-button:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }

        .suggestion-kicker {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.78);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .suggestion-text {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.45;
          letter-spacing: -0.02em;
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
          border-radius: 22px;
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
          background: ${accent};
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          padding: 0 14px;
        }

        .send-button[disabled] {
          opacity: 0.5;
          cursor: wait;
        }

        .widget-shell[data-theme="montti"] .chat-panel {
          border-color: rgba(223, 190, 254, 0.22);
          background:
            radial-gradient(circle at top, rgba(223, 190, 254, 0.16), transparent 34%),
            linear-gradient(180deg, #23201d 0%, #141311 100%);
        }

        .widget-shell[data-theme="montti"] .header {
          background:
            linear-gradient(180deg, rgba(223, 190, 254, 0.1), rgba(255, 255, 255, 0));
          border-bottom-color: rgba(223, 190, 254, 0.16);
        }

        .widget-shell[data-theme="montti"] .launcher-teaser {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(223, 190, 254, 0.2);
        }

        .widget-shell[data-theme="montti"] .chat-button {
          background: #dfbefe;
          color: #ffffff;
          border-color: rgba(223, 190, 254, 0.65);
          box-shadow: 0 18px 48px rgba(223, 190, 254, 0.22);
        }

        .widget-shell[data-theme="montti"] .chat-button:hover {
          box-shadow: 0 22px 56px rgba(223, 190, 254, 0.28);
        }

        .widget-shell[data-theme="montti"] .header-badge {
          background: #dfbefe;
          color: #ffffff;
          box-shadow: none;
        }

        .widget-shell[data-theme="montti"] .message.assistant,
        .widget-shell[data-theme="montti"] .suggestion-button,
        .widget-shell[data-theme="montti"] .composer-shell {
          background: rgba(255, 255, 255, 0.06);
        }

        .widget-shell[data-theme="montti"] .suggestion-button {
          border-color: rgba(223, 190, 254, 0.28);
          background:
            linear-gradient(180deg, rgba(223, 190, 254, 0.12), rgba(223, 190, 254, 0.05));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .widget-shell[data-theme="montti"] .suggestion-button:hover {
          background:
            linear-gradient(180deg, rgba(223, 190, 254, 0.18), rgba(223, 190, 254, 0.08));
        }

        .widget-shell[data-theme="montti"] .suggestion-kicker {
          background: #dfbefe;
          color: #24192e;
        }

        .widget-shell[data-theme="montti"] .send-button {
          background: ${accent};
          color: #ffffff;
        }

        .widget-shell[data-theme="notion-montti"] .chat-panel {
          border-color: rgba(0, 0, 0, 0.12);
          background: #191919;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
        }

        .widget-shell[data-theme="notion-montti"] .header {
          padding: 18px;
          border-bottom-color: rgba(255, 255, 255, 0.08);
          background: #191919;
        }

        .widget-shell[data-theme="notion-montti"] .header-badge {
          background: #ffffff;
          color: ${accent};
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .widget-shell[data-theme="notion-montti"] .header-copy h2 {
          color: #ffffff;
        }

        .widget-shell[data-theme="notion-montti"] .header-copy p {
          color: rgba(255, 255, 255, 0.62);
        }

        .widget-shell[data-theme="notion-montti"] .launcher-teaser {
          background: #ffffff;
          color: #111111;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.12);
        }

        .widget-shell[data-theme="notion-montti"] .chat-button {
          background: #ffffff;
          color: ${accent};
          border-color: rgba(0, 0, 0, 0.06);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.7),
            0 16px 40px rgba(0, 0, 0, 0.12);
        }

        .widget-shell[data-theme="notion-montti"] .chat-button:hover {
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.7),
            0 20px 44px rgba(0, 0, 0, 0.16);
        }

        .widget-shell[data-theme="notion-montti"] .close-button {
          background: rgba(255, 255, 255, 0.08);
        }

        .widget-shell[data-theme="notion-montti"] .message.assistant {
          background: #242424;
          border-color: rgba(255, 255, 255, 0.05);
        }

        .widget-shell[data-theme="notion-montti"] .message.user {
          background: #ffffff;
          color: #111111;
        }

        .widget-shell[data-theme="notion-montti"] .composer-wrap {
          border-top-color: rgba(255, 255, 255, 0.08);
        }

        .widget-shell[data-theme="notion-montti"] .composer-shell {
          background: #2a2a2a;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .widget-shell[data-theme="notion-montti"] .send-button {
          background: ${accent};
          color: #24192e;
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
            width: ${inline ? "100%" : "auto"};
          }

          .launcher {
            gap: 8px;
          }

          .launcher-teaser {
            max-width: 180px;
            font-size: 12px;
          }

          .chat-panel {
            width: ${inline ? "100%" : "calc(100vw - 24px)"};
            height: min(72vh, 580px);
            border-radius: 24px;
          }
        }
      </style>
      <div class="widget-shell" data-inline="${inline}" data-open="${startOpen}" data-theme="${config.themeVariant || "default"}">
        <section class="chat-panel" aria-label="Chat window" data-open="${startOpen}">
          <div class="header">
            <div class="header-main">
              ${headerBadge}
              <div class="header-copy">
                <h2></h2>
                <p></p>
              </div>
            </div>
            <button class="close-button" type="button" aria-label="Close chat">&times;</button>
          </div>
          <div class="messages" role="log" aria-live="polite">
            <div class="suggestions" data-visible="false"></div>
          </div>
          <form class="composer-wrap">
            <div class="composer-shell">
              <textarea class="composer" rows="1" placeholder="${placeholder}"></textarea>
              <button class="send-button" type="submit">Send</button>
            </div>
          </form>
        </section>
        <div class="launcher">
          ${teaserMarkup}
          <button class="chat-button" type="button" aria-label="Open chat">
            ${launcherIcon}
          </button>
        </div>
      </div>
    `;

    const shell = shadowRoot.querySelector(".widget-shell");
    const panel = shadowRoot.querySelector(".chat-panel");
    const openButton = shadowRoot.querySelector(".chat-button");
    const closeButton = shadowRoot.querySelector(".close-button");
    const messages = shadowRoot.querySelector(".messages");
    const suggestions = shadowRoot.querySelector(".suggestions");
    const teaser = shadowRoot.querySelector(".launcher-teaser");
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

    const rememberMessage = (content, role) => {
      conversationHistory.push({ role, content });

      if (conversationHistory.length > 12) {
        conversationHistory.splice(0, conversationHistory.length - 12);
      }
    };

    const hideTeaser = () => {
      if (!teaser || teaser.dataset.hidden === "true") {
        return;
      }

      teaser.dataset.hidden = "true";
      teaser.style.opacity = "0";
      teaser.style.transform = "translateY(8px)";

      window.setTimeout(() => {
        teaser.remove();
      }, 180);
    };

    const setOpen = (isOpen) => {
      shell.dataset.open = String(isOpen);
      panel.dataset.open = String(isOpen);

      if (isOpen) {
        hideTeaser();
        composer.focus();
      } else {
        openButton.focus();
      }
    };

    const autoResize = () => {
      composer.style.height = "0px";
      composer.style.height = `${Math.min(composer.scrollHeight, 120)}px`;
    };

    const hideSuggestions = () => {
      suggestions.dataset.visible = "false";
      suggestions.innerHTML = "";
    };

    const renderSuggestions = () => {
      if (!promptSuggestions.length) {
        hideSuggestions();
        return;
      }

      messages.appendChild(suggestions);
      suggestions.innerHTML = "";
      suggestions.dataset.visible = "true";
      const label = document.createElement("div");
      label.className = "suggestions-label";
      label.textContent = "quick questions";
      suggestions.appendChild(label);

      promptSuggestions.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "suggestion-button";
        const kicker = document.createElement("span");
        kicker.className = "suggestion-kicker";
        kicker.textContent = "suggested";
        const text = document.createElement("span");
        text.className = "suggestion-text";
        text.textContent = item.question;
        button.append(kicker, text);
        button.addEventListener("click", () => {
          hideSuggestions();
          setOpen(true);
          appendMessage(item.question, "user");
          rememberMessage(item.question, "user");
          appendMessage(item.answer, "assistant");
          rememberMessage(item.answer, "assistant");
        });
        suggestions.appendChild(button);
      });
    };

    appendMessage(greeting, "assistant");
    rememberMessage(greeting, "assistant");
    renderSuggestions();

    if (!inline && teaserDurationMs > 0) {
      window.setTimeout(() => {
        hideTeaser();
      }, teaserDurationMs);
    }

    openButton.addEventListener("click", () => setOpen(true));
    closeButton.addEventListener("click", () => setOpen(false));

    composer.addEventListener("input", autoResize);
    composer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
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

      hideSuggestions();
      appendMessage(message, "user");
      rememberMessage(message, "user");
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
          body: JSON.stringify({
            client,
            history: conversationHistory,
            message,
          }),
        });

        const data = await response.json();
        statusNode.remove();

        if (!response.ok) {
          appendMessage(
            data.error || "Something went wrong while getting a reply.",
            "assistant",
          );
        } else {
          const answer =
            data.answer || "I could not generate a reply. Please try again.";
          appendMessage(answer, "assistant");
          rememberMessage(answer, "assistant");
        }
      } catch {
        statusNode.remove();
        const fallbackMessage =
          "The chat service is unavailable right now. Please try again in a moment.";
        appendMessage(fallbackMessage, "assistant");
        rememberMessage(fallbackMessage, "assistant");
      } finally {
        composer.disabled = false;
        sendButton.disabled = false;
        composer.focus();
      }
    });
  };

  if (document.body) {
    void init();
    return;
  }

  window.addEventListener(
    "DOMContentLoaded",
    () => {
      void init();
    },
    { once: true },
  );
})();
