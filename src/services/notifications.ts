import api from "./api";

export type NotificationDelivery = {
    id: number;
    broadcast_id: number;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    read_at: string | null;
    delivered_at: string;
};

export async function fetchNotifications() {
    const res = await api.get("/api/v1/notifications/");
    return (res.data?.data || []) as NotificationDelivery[];
}

export async function fetchUnreadCount() {
    const res = await api.get("/api/v1/notifications/unread-count/");
    return Number(res.data?.data?.count || 0);
}

export async function markNotificationRead(deliveryId: number) {
    await api.post(`/api/v1/notifications/${deliveryId}/read/`);
}