// File: components/FloatingChat.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

type Msg = { id: string; role: "user" | "bot"; text: string };

export default function FloatingChat({
  userId,
  challengeId,
}: {
  userId?: string;
  challengeId?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  async function send() {
    if (!text.trim()) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || "anonymous",
        },
        body: JSON.stringify({
          message: text,
          challengeId,
          hintLevel: "nudge",
        }),
      });

      const j = await res.json();
      const botText = j?.reply || j?.error || "No reply from server";
      const botMsg: Msg = { id: `b-${Date.now()}`, role: "bot", text: botText };
      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: "Failed to contact server",
        },
      ]);
    } finally {
      setText("");
      setBusy(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#111827",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        💬
      </button>

      {/* Floating chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 360,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            background: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            height: 420,
          }}
        >
          <div
            ref={boxRef}
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingRight: 4,
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: "#6b7280", fontSize: 13 }}>
                Ask for a hint, FAQ, or explanation — e.g., "Hint for
                bizlogic-001"
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <div
                  style={{
                    background: m.role === "user" ? "#e0f2fe" : "#f3f4f6",
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 14,
                    lineHeight: 1.4,
                  }}
                >
                  <strong
                    style={{ display: "block", fontSize: 11, marginBottom: 4 }}
                  >
                    {m.role === "user" ? "You" : "Assistant"}
                  </strong>
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              aria-label="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask for a hint or FAQ..."
              disabled={busy}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
            <button
              onClick={send}
              disabled={busy || !text.trim()}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: "#111827",
                color: "#fff",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
