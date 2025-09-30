import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActivities, type Activity } from "../services/ActivityServices";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadActivities = async () => {
      try {
        const data = await fetchActivities();
        // Show most recent 5
        setActivities(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch activities for notifications", err);
      }
    };

    loadActivities();

    // Optional: listen for live updates via custom events
    const handleLiveActivity = (e: Event) => {
      const newActivity = (e as CustomEvent<Activity>).detail;
      setActivities((prev) => [newActivity, ...prev].slice(0, 5));
    };

    window.addEventListener(
      "app-activity",
      handleLiveActivity as EventListener
    );
    return () =>
      window.removeEventListener(
        "app-activity",
        handleLiveActivity as EventListener
      );
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-1.5 w-80 h-80 z-50 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600 overflow-y-auto">
      <ul className="py-2">
        <li className="text-xs text-gray-400 dark:text-gray-300 px-4 shadow-lg flex justify-end">
          <Link
            to="/activitypage"
            onClick={onClose}
            className="hover:underline"
          >
            See all
          </Link>
        </li>
        {activities.length === 0 ? (
          <li className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
            No recent activities
          </li>
        ) : (
          activities.map((act) => (
            <li
              key={act.id}
              className="px-4 py-2 text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <p>
                <strong>[{act.type}]</strong> "{act.name}" was{" "}
                <span className="font-semibold">{act.action}</span>
              </p>
              <small className="text-gray-500 dark:text-gray-400">
                {new Date(act.created_at).toLocaleString()}
              </small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
