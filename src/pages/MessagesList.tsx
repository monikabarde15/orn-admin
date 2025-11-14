import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = "https://backend.onrequestlab.com/api/v1/support/chats/messages/";

export default function SupportChat() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef(null);

  const playSound = () => {
    const audio = new Audio("https://assets.mixkit.co/sfx/download/mixkit-message-pop-alert-2354.mp3");
    audio.play().catch(() => {});
  };

  // Auto scroll
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!email) return;
    try {
      const res = await axios.get(`${API_BASE}?email=${email}`);
      const newMessages = res.data || [];
      if (newMessages.length > messages.length) playSound();
      setMessages(newMessages);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [email, open, messages.length]);

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    if (!email.trim()) return alert("Please enter email to start chat");

    try {
      const payload = { message, email, attachments };
      const res = await axios.post(API_BASE, payload);
      const newMsg = {
        ...res.data,
        sender: "guest",
        userName: email,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
      setAttachments([]);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setAttachments((prev) => [...prev, ...fileData]);
  };

  const removeAttachment = (name) =>
    setAttachments((prev) => prev.filter((f) => f.name !== name));

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white py-3 px-5 rounded-full shadow-lg z-[99999] hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          💬 Support
        </button>
      )}

      {/* Chat Box */}
      {open && (
        <div
          className="fixed bottom-6 right-6 w-96 max-w-[90vw] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[999999] transition-all"
          style={{
            animation: "popIn 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white flex justify-between items-center px-4 py-3 rounded-t-2xl">
            <h3 className="font-semibold">💬 Support Chat</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-lg hover:opacity-75"
            >
              ✕
            </button>
          </div>

          {/* Email Input */}
          {!email && (
            <div className="p-4 flex flex-col gap-3">
              <p className="text-sm text-gray-600">
                Enter your email to start chatting:
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="border rounded-lg p-2 text-sm focus:outline-indigo-500 text-black"
              />
              <button
                onClick={() => email && fetchMessages()}
                className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Start Chat
              </button>
            </div>
          )}

          {/* Chat Messages */}
          {email && (
            <>
              <div className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm">
                    No messages yet...
                  </p>
                )}

                {messages.map((msg, i) => {
                  const isGuest = msg.sender === "guest";
                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isGuest ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl shadow ${
                          isGuest
                            ? "bg-indigo-100 text-black rounded-br-none"
                            : "bg-gray-200 text-black rounded-bl-none"
                        }`}
                      >
                        {msg.attachments?.length > 0 && (
                          <div className="space-y-1 mb-1">
                            {msg.attachments.map((file, idx) => (
                              <a
                                key={idx}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 text-xs underline block"
                              >
                                📎 {file.split("/").pop()}
                              </a>
                            ))}
                          </div>
                        )}
                        <p>{msg.message}</p>
                        <span className="block text-[10px] text-gray-600 text-right mt-1">
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

              {/* Attachment Preview */}
              {attachments.length > 0 && (
                <div className="bg-gray-100 p-2 flex gap-2 overflow-x-auto">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-white border rounded-md px-2 py-1 text-xs shadow"
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeAttachment(file.name)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Input */}
              <div className="p-3 border-t bg-white flex items-center gap-2">
                <label className="cursor-pointer text-xl">
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
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm text-black focus:outline-indigo-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* CSS animation */}
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
