import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  sentTo: string;
  successCount: number;
  failureCount: number;
}

const AdminNotificationsBroadcast = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sending, setSending] = useState(false);

  const [history, setHistory] = useState<NotificationItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // =========================
  // FETCH HISTORY
  // =========================
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);

      const res = await api.get(
        "/api/v1/notifications/history"
      );

      setHistory(res.data.notifications || []);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to fetch notification history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // =========================
  // SEND NOTIFICATION
  // =========================
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const t = title.trim();
    const b = body.trim();

    if (!t || !b) {
      toast.error("Title and Body are required");
      return;
    }

    try {
      setSending(true);

      const payload = {
        title: t,
        body: b,
        imageUrl,
      };

      const res = await api.post(
        "/api/v1/notifications/send-to-all",
        payload
      );

      toast.success(
        res.data?.message || "Notification sent successfully"
      );

      setTitle("");
      setBody("");
      setImageUrl("");

      fetchHistory();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to send notification"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="panel">
      <h2 className="text-xl font-bold mb-5">
        Notification Broadcast
      </h2>

      {/* SEND FORM */}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Title
          </label>

          <input
            type="text"
            className="form-input w-full"
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Body
          </label>

          <textarea
            className="form-textarea w-full"
            rows={5}
            placeholder="Enter notification body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Image URL (optional)
          </label>

          <input
            type="text"
            className="form-input w-full"
            placeholder="https://example.com/image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary"
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>
      </form>

      {/* HISTORY */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">
          Notification History
        </h3>

        {loadingHistory ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No notifications found</p>
        ) : (
          <div className="overflow-auto">
            <table className="table-auto w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Body</th>
                  <th className="p-2 border">Sent To</th>
                  <th className="p-2 border">Success</th>
                  <th className="p-2 border">Failed</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">
                      {item.title}
                    </td>

                    <td className="p-2 border">
                      {item.body}
                    </td>

                    <td className="p-2 border">
                      {item.sentTo}
                    </td>

                    <td className="p-2 border">
                      {item.successCount}
                    </td>

                    <td className="p-2 border">
                      {item.failureCount}
                    </td>

                    <td className="p-2 border">
                      {new Date(
                        item.sentAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsBroadcast;