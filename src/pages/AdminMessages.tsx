import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";

const API_BASE = "/api/v1/admin/support";

const AdminSupportChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const chatListTimer = useRef(null);
  const messageTimer = useRef(null);
  const chatChecksum = useRef(null);
  const msgChecksum = useRef(null);

  /* ---------------- Utility ---------------- */
  const getChecksum = (data) => JSON.stringify(data).length;

  /* ---------------- Fetch Chat List ---------------- */
  const loadChats = async (silent = false) => {
    if (!silent) setLoadingChats(true);
    try {
      const res = await api.get(`${API_BASE}/chats/`);
      const newChats = res.data.results || res.data || [];

      const checksum = getChecksum(newChats);
      if (checksum !== chatChecksum.current) {
        setChats(newChats);
        chatChecksum.current = checksum;
      }
    } catch (err) {
      console.error("Chat list error:", err);
    } finally {
      if (!silent) setLoadingChats(false);
    }
  };

  /* ---------------- Open Chat ---------------- */
  const openChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    msgChecksum.current = null;

    loadMessages(chat.id);
    if (messageTimer.current) clearInterval(messageTimer.current);

    messageTimer.current = setInterval(
      () => loadMessages(chat.id, true),
      2000
    );
  };

  /* ---------------- Load Messages ---------------- */
  const loadMessages = async (chatId, silent = false) => {
    if (!chatId) return;
    if (!silent) setLoadingMessages(true);

    try {
      const res = await api.get(
        `${API_BASE}/chats/messages/?chat_id=${chatId}`
      );

      const newMessages = res.data.results || res.data || [];
      const checksum = getChecksum(newMessages);

      if (checksum !== msgChecksum.current) {
        setMessages(newMessages);
        msgChecksum.current = checksum;
      }
    } catch (err) {
      console.error("Messages load error:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  /* ---------------- Send Message ---------------- */
  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    setSending(true);
    try {
      await api.post(`${API_BASE}/chats/messages/`, {
        chat_id: selectedChat.id,
        message: input,
      });

      setInput("");
      await loadMessages(selectedChat.id, true);
      await loadChats(true);
    } catch (err) {
      console.error("Send message error:", err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- Auto Refresh Chats ---------------- */
  useEffect(() => {
    loadChats();
    chatListTimer.current = setInterval(() => loadChats(true), 5000);

    return () => {
      clearInterval(chatListTimer.current);
      clearInterval(messageTimer.current);
    };
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-gray-100 rounded-lg shadow-md overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-full md:w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 font-semibold text-lg border-b bg-blue-50 text-blue-700">
          🧑‍💻 Admin Chat Panel
        </div>

        {loadingChats ? (
          <div className="p-4 text-center text-gray-500">
            Loading chats...
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No active chats
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => {
              const userName =
                chat.userName || chat.user_name || "User";
              const unread = chat.unread_count || 0;

              return (
                <div
                  key={chat.id}
                  onClick={() => openChat(chat)}
                  className={`p-3 cursor-pointer border-b hover:bg-blue-50 ${
                    selectedChat?.id === chat.id
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{userName}</span>
                    {unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 rounded-full">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.last_message || ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-white flex justify-between">
              <div>
                <div className="font-semibold">
                  {selectedChat.userName ||
                    selectedChat.user_name ||
                    "User"}
                </div>
                <div className="text-xs text-gray-500">
                  Chat ID: {selectedChat.id}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedChat(null);
                  clearInterval(messageTimer.current);
                }}
                className="text-red-500 text-sm"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {loadingMessages ? (
                <div className="text-center text-gray-500 mt-10">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  No messages yet
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isAdmin =
                    msg.sender === "admin" || msg.is_admin;

                  return (
                    <div
                      key={msg.id || i}
                      className={`flex mb-3 ${
                        isAdmin
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[70%] text-sm ${
                          isAdmin
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <div>{msg.message}</div>
                        <div className="text-[10px] opacity-70 text-right mt-1">
                          {isAdmin ? "Admin" : "User"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 border-t bg-white flex">
              <input
                type="text"
                value={input}
                disabled={sending}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            💬 Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportChat;
