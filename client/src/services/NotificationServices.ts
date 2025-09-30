// src/services/NotificationServices.ts
import axios from "axios";

export type Notification = {
  id: number;
  action: string;
  item_type: string;
  item_name: string;
  is_read: boolean;
  created_at: string;
};

const NotificationServices = {
  async fetchAll(): Promise<Notification[]> {
    const res = await axios.get<Notification[]>("/api/notifications");
    return res.data;
  },

  async markAsRead(id: number): Promise<void> {
    await axios.patch(`/api/notifications/${id}/read`);
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/api/notifications/${id}`);
  },
};

export default NotificationServices;
