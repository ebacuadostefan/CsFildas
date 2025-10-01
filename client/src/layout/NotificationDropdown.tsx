import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActivities, type Activity } from "../services/ActivityServices";
// Import the Spinner component
import Spinner from "../components/Spinner/Spinner";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  // Add a loading state
  const [isLoading, setIsLoading] = useState(false);
  // Add popup notification state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const loadActivities = async () => {
      // Set isLoading to true before the API call
      setIsLoading(true);
      try {
        const data = await fetchActivities();
        // Show most recent 5
        setActivities(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch activities for notifications", err);
      } finally {
        // Set isLoading to false after the API call is complete
        setIsLoading(false);
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

  // Function to determine the color based on the action
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "deleted":
        return "text-red-500";
      case "added":
      case "created":
        return "text-green-500";
      case "edited":
      case "updated":
        return "text-blue-500";
      default:
        return ""; // Return empty string for no specific color
    }
  };

  // Function to handle navigation based on activity type
  const handleActivityClick = (activity: Activity) => {
    if (!activity.department) {
      setPopupMessage("No department information available for this activity");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    // Create department slug from department name
    const departmentSlug = activity.department.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (activity.type === "folder") {
      // Navigate to department folder page
      navigate(`/departments/${departmentSlug}`);
      setPopupMessage(`Navigating to ${activity.department.name} folders`);
    } else if (activity.type === "file") {
      // For files, navigate to department folder page (since we don't have folder slug)
      navigate(`/departments/${departmentSlug}`);
      setPopupMessage(
        `Navigating to ${activity.department.name} to find file "${activity.name}"`
      );
    }

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    onClose(); // Close the dropdown after navigation
  };

  return (
    <>
      <div className="absolute right-0 mt-1.5 w-80 h-80 z-50 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600 overflow-y-auto">
        <ul className="py-2">
          <li className="text-xs text-gray-400 px-4 shadow-lg flex justify-end">
            <button
              onClick={() => {
                navigate("/activitypage");
                onClose();
              }}
              className="hover:underline hover:text-gray-300 transition-colors"
            >
              See all
            </button>
          </li>
          {/* Conditional rendering for loading state */}
          {isLoading ? (
            <li className="flex justify-center py-4">
              <Spinner size="md" />
            </li>
          ) : activities.length === 0 ? (
            <li className="px-4 py-4 text-sm text-white-700">
              No recent activities
            </li>
          ) : (
            activities.map((act) => (
              <li
                key={act.id}
                className="px-4 py-2 text-sm hover:bg-gray-50 shadow-md dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleActivityClick(act)}
              >
                <p className="text-gray-300">
                  <strong>[{act.type}]</strong> "{act.name}" was{" "}
                  <span
                    className={`font-semibold ${getActionColor(act.action)}`}
                  >
                    {act.action}
                  </span>
                </p>
                <small className="text-gray-200">
                  {new Date(act.created_at).toLocaleString()}
                </small>
                {act.department && (
                  <small className="text-blue-300 block mt-1">
                    📁 {act.department.name}
                  </small>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">{popupMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationDropdown;
