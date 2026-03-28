import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

const API_BASE = `/api/v1/support/chats/messages/`;

export default function SupportChat({ user }) {
  const [email, setEmail] = useState(
    localStorage.getItem("chat_email") || user?.email || ""
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef(null);

  // 🔊 sound
  const playSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/sfx/download/mixkit-message-pop-alert-2354.mp3"
    );
    audio.play().catch(() => {});
  };

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // fetch messages
  const fetchMessages = async () => {
    if (!email) return;

    try {
      const res = await api.get(`${API_BASE}?email=${email}`);

      const newMessages = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      if (newMessages.length > messages.length) playSound();

      setMessages(newMessages);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!open || !email) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [open, email]);

  // send message
  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    if (!email) return alert("Enter email");

    try {
      const res = await api.post(API_BASE, {
        message,
        email,
        attachments,
      });

      const newMsg = {
        ...(res.data?.data || res.data),
        sender: "user", // 🔥 important
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
      setAttachments([]);
    } catch (err) {
      console.error(err);
    }
  };

  // file select
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const fileData = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setAttachments((prev) => [...prev, ...fileData]);
  };

  const removeAttachment = (name) => {
    setAttachments((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-[9999] bottom-4 right-4 md:bottom-6 md:right-6 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          💬 Support
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div
          className="
          fixed z-[999999]
          inset-0 w-full h-[100dvh]

          md:inset-auto md:bottom-6 md:right-6
          md:w-[380px] md:max-w-[calc(100vw-20px)] md:h-[520px]

          bg-white md:rounded-2xl shadow-2xl border flex flex-col overflow-hidden
        "
        >
          {/* HEADER */}
          <div className="bg-indigo-600 text-white flex justify-between items-center px-4 py-3">
            <h3 className="font-semibold">💬 Support Chat</h3>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* EMAIL INPUT */}
          {!email && (
            <div className="p-4 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded text-black"
              />
              <button
                onClick={() => {
                  if (!email) return;
                  localStorage.setItem("chat_email", email);
                  fetchMessages();
                }}
                className="bg-indigo-600 text-white py-2 rounded"
              >
                Start Chat
              </button>
            </div>
          )}

          {/* CHAT AREA */}
          {email && (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">

                {messages.map((msg, i) => {
  const isMine = msg.sender === "user";

  return (
    <div
      key={i}
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
        max-w-[70%] px-4 py-2 text-sm shadow

        ${
          isMine
            ? "bg-indigo-500 text-white rounded-2xl rounded-br-none"
            : "bg-gray-200 text-black rounded-2xl rounded-bl-none"
        }
      `}
      >
        {/* receiver name */}
        {!isMine && (
          <p className="text-xs font-semibold mb-1">
            {msg.userName || "Support"}
          </p>
        )}

        <p>{msg.message}</p>

        <span className="text-[10px] block text-right mt-1 opacity-70">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
})}

                <div ref={chatEndRef}></div>
              </div>

              {/* ATTACHMENTS */}
              {attachments.length > 0 && (
                <div className="p-2 bg-gray-100 flex gap-2 overflow-x-auto">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className="bg-white border px-2 py-1 rounded text-xs flex gap-1"
                    >
                      {file.name}
                      <button onClick={() => removeAttachment(file.name)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* INPUT */}
              <div className="p-3 border-t flex items-center gap-2">
                <label className="cursor-pointer">
                  📎
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm text-black"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                  onClick={handleSend}
                  className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}