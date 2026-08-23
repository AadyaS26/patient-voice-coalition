// src/components/ChatWidget.jsx
//
// Floating "help" chat widget, rendered once in App.jsx (outside <Routes>)
// so it persists across every page. Talks to api/chatbot.js, which calls
// Google's free-tier Gemini API server-side.
//
// Conversation state resets on page reload — it's a lightweight help
// widget, not a persistent account feature.

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const GREETING = {
  role: "assistant",
  content: "Hi! I'm here to help you find your way around AutoimmuneVoices — ask me anything about the site, or where to go for something specific.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      const reply = data.ok ? data.reply : "Sorry, something went wrong — try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect just now — try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, fontFamily: "Inter, sans-serif" }}>
      {open && (
        <div
          style={{
            width: 340,
            maxWidth: "calc(100vw - 48px)",
            height: 460,
            maxHeight: "calc(100vh - 120px)",
            background: "#FAF8F3",
            border: "1px solid #E4E0D6",
            borderRadius: 14,
            boxShadow: "0 16px 40px rgba(27,42,74,0.22)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              background: "#1B2A4A",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 15.5, fontWeight: 500, color: "#FAF8F3" }}>
              Ask AutoimmuneVoices
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
            >
              <X size={18} color="#C4C8D6" />
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.role === "user" ? "#1B2A4A" : "#FFFFFF",
                  color: m.role === "user" ? "#FAF8F3" : "#2B2A28",
                  border: m.role === "user" ? "none" : "1px solid #E4E0D6",
                  borderRadius: 12,
                  padding: "9px 13px",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#FFFFFF",
                  border: "1px solid #E4E0D6",
                  borderRadius: 12,
                  padding: "9px 13px",
                  fontSize: 13.5,
                  color: "#8A8880",
                }}
              >
                Thinking…
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #E4E0D6" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              style={{
                flex: 1,
                fontFamily: "Inter, sans-serif",
                fontSize: 13.5,
                border: "1px solid #E4E0D6",
                borderRadius: 8,
                padding: "9px 12px",
                background: "#FFFFFF",
                color: "#2B2A28",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#1B2A4A",
                border: "none",
                borderRadius: 8,
                width: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: loading || !input.trim() ? "default" : "pointer",
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
              aria-label="Send"
            >
              <Send size={15} color="#FAF8F3" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#1B2A4A",
          border: "none",
          boxShadow: "0 8px 20px rgba(27,42,74,0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
        }}
      >
        {open ? <X size={22} color="#FAF8F3" /> : <MessageCircle size={22} color="#FAF8F3" />}
      </button>
    </div>
  );
}
