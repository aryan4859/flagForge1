"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import botAvatar from "@/public/logo.png";

type Msg = { id: string; role: "user" | "bot"; text: string };

export default function FloatingChat({
  userId,
  challengeId,
}: {
  userId?: string;
  challengeId?: string;
}) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  async function sendMessage(msg: string) {
    if (!msg.trim()) return;

    const newUserMsg: Msg = {
      id: Date.now().toString(),
      role: "user",
      text: msg,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          userId,
          challengeId,
          hintLevel: "nudge",
        }),
      });

      const data = await res.json();
      const newBotMsg: Msg = {
        id: Date.now().toString(),
        role: "bot",
        text: data.reply,
      };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          text: "Error: Unable to fetch response.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div
      ref={chatRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-50 cursor-move"
      onMouseDown={handleMouseDown}
    >
      {/* Floating Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-transform duration-300"
        >
          💬
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Need Help?</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80 mb-3 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 items-start ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "bot" && (
                  <Image
                    src={botAvatar}
                    alt="Bot"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div
                  className={`p-2 rounded-lg max-w-[70%] break-words ${
                    m.role === "user"
                      ? "bg-red-500 text-white text-right"
                      : "bg-gray-700 text-white text-left"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
              </div>
            ))}
            {loading && (
              <p className="text-gray-400 text-sm italic">Thinking...</p>
            )}
          </div>
          <div className="flex">
            <input
              className="flex-1 rounded-l-lg p-2 text-black"
              placeholder="Ask for help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-lg text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
