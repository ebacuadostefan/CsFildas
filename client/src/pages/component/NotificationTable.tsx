// src/pages/notifications/components/NotificationTable.tsx
import type { Notification } from "../../services/NotificationServices";

interface NotificationTableProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationTable = ({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationTableProps) => {
  if (notifications.length === 0) {
    return <p>No notifications yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`p-3 border rounded-lg flex justify-between items-center ${
            n.is_read ? "bg-gray-100" : "bg-blue-50"
          }`}
        >
          <div>
            <p>
              <strong>{n.item_type}</strong> "{n.item_name}" was{" "}
              <span className="font-semibold">{n.action}</span>
            </p>
            <small className="text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </small>
          </div>
          <div className="flex gap-2">
            {!n.is_read && (
              <button
                className="px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => onMarkAsRead(n.id)}
              >
                Mark as Read
              </button>
            )}
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => onDelete(n.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotificationTable;
