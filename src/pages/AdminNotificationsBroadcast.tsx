import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminNotificationsBroadcast = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const t = title.trim();
    const m = message.trim();

    if (!t || !m) {
      toast.error("Title and message are required.", { position: "top-center" });
      return;
    }

    setSending(true);
    try {
      const res = await api.post("/api/v1/admin/notifications/broadcast/", {
        title: t,
        message: m,
        is_active: isActive,
      });

      toast.success(`Broadcast sent to ${res.data?.delivered_to ?? 0} users`, { position: "top-center" });
      setTitle("");
      setMessage("");
      setIsActive(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Failed to send broadcast";
      toast.error(msg, { position: "top-center" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="panel">
      <h2 className="text-lg font-semibold mb-4">Notification Broadcast</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="form-input w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Maintenance window"
            maxLength={120}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="form-textarea w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write the notification message…"
            rows={6}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="is_active" className="text-sm">
            Active (visible to users)
          </label>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary"
        >
          {sending ? "Sending…" : "Send Broadcast"}
        </button>
      </form>
    </div>
  );
};

export default AdminNotificationsBroadcast;