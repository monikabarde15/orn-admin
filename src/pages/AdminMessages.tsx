import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = "https://backend.onrequestlab.com/api/v1/admin/support";

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

  // Get token from cookies
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };
  const accessToken = getCookie("access");

  /* ----------------------------- Utility ----------------------------- */
  const getChecksum = (data) => JSON.stringify(data).length; // lightweight diff check

  /* ----------------------------- Fetch Chat List ----------------------------- */
  const loadChats = async (silent = false) => {
    if (!silent) setLoadingChats(true);
    try {
      const res = await axios.get(`${API_BASE}/chats/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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

  /* ----------------------------- Open Chat ----------------------------- */
  const openChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    loadMessages(chat.id);
    if (messageTimer.current) clearInterval(messageTimer.current);
    messageTimer.current = setInterval(() => loadMessages(chat.id, true), 2000);
  };

  /* ----------------------------- Load Messages ----------------------------- */
  const loadMessages = async (chatId, silent = false) => {
    if (!chatId) return;
    if (!silent) setLoadingMessages(true);
    try {
      const res = await axios.get(`${API_BASE}/chats/messages/?chat_id=${chatId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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

  /* ----------------------------- Send Message ----------------------------- */
  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;
    setSending(true);
    try {
      await axios.post(
        `${API_BASE}/chats/messages/`,
        { chat_id: selectedChat.id, message: input },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setInput("");
      await loadMessages(selectedChat.id, true);
      await loadChats(true); // refresh chat list silently
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  /* ----------------------------- Auto Scroll ----------------------------- */
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ----------------------------- Auto Refresh Chats ----------------------------- */
  useEffect(() => {
    loadChats();
    chatListTimer.current = setInterval(() => loadChats(true), 5000);
    return () => {
      clearInterval(chatListTimer.current);
      clearInterval(messageTimer.current);
    };
  }, []);

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-gray-100 rounded-lg shadow-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 font-semibold text-lg border-b bg-blue-50 text-blue-700">
          🧑‍💻 Admin Chat Panel
        </div>
        {loadingChats ? (
          <div className="p-4 text-center text-gray-500">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No active chats</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => {
              const userName = chat.userName || chat.user_name || "User";
              const lastMsg = chat.last_message || "";
              const unread = chat.unread_count || 0;
              const time = chat.last_message_time
                ? new Date(chat.last_message_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              return (
                <div
                  key={chat.id}
                  className={`p-3 cursor-pointer border-b hover:bg-blue-50 transition ${
                    selectedChat?.id === chat.id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => openChat(chat)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{userName}</span>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{lastMsg}</div>
                  {unread > 0 && (
                    <div className="text-xs text-white bg-blue-600 rounded-full px-2 inline-block mt-1">
                      {unread}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">
                  {selectedChat.userName || selectedChat.user_name || "User"}
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
                className="text-sm text-red-500 hover:underline"
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
                  No messages yet.
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isAdmin = msg.sender === "admin" || msg.is_admin;
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex ${
                        isAdmin ? "justify-end" : "justify-start"
                      } mb-3`}
                    >
                      <div
                        className={`p-3 rounded-lg shadow text-sm max-w-[70%] ${
                          isAdmin
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <div>{msg.message}</div>
                        <div className="text-[10px] mt-1 opacity-75 text-right">
                          {isAdmin ? "Admin" : "User"} •{" "}
                          {new Date(
                            msg.timestamp || msg.created_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white flex items-center">
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={input}
                disabled={sending}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="text-5xl mb-4">💬</div>
            <div>Select a user chat to start messaging</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportChat;
