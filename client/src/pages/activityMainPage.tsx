import React, { useEffect, useState, useCallback, useMemo } from "react";
// FIX 1: Assuming ActivityTable is in a sibling directory named 'component'
import ActivityTable from "./component/ActivityTable";
import { fetchActivities, type Activity } from "../services/ActivityServices";
import Boxbar from "../layout/Boxbar";
import Spinner from "../components/Spinner/Spinner";

const ActivityPage: React.FC = () => {
  // Initialize activities as an empty array to ensure stability
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (err) {
      console.error("API Load Error:", err);
      setError(
        "Failed to load activities. Please check the network connection."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();

    // Live Activity Listener
    const liveActivityHandler = (e: Event) => {
      try {
        const newActivity = (e as CustomEvent<Activity>).detail;
        // Add the new activity to the start of the list
        setActivities((prev) => [newActivity, ...prev].slice(0, 100));
      } catch (err) {
        console.error("Failed to handle live activity event", err);
      }
    };

    window.addEventListener(
      "app-activity",
      liveActivityHandler as EventListener
    );

    // Cleanup listener
    return () => {
      window.removeEventListener(
        "app-activity",
        liveActivityHandler as EventListener
      );
    };
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    if (!searchTerm) return activities;
    const lowerSearchTerm = searchTerm.toLowerCase();

    return activities.filter(
      (a) =>
        // Search by item name or department name
        a.name?.toLowerCase().includes(lowerSearchTerm) ||
        a.department?.name?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [activities, searchTerm]);

  if (error) {
    return (
      <div className="text-red-600 text-center p-10 bg-red-100 border border-red-300 rounded-lg mx-auto max-w-lg mt-10">
        {error}
      </div>
    );
  }

  return (
    <>
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {}}
      />
      <div className="mt-10 w-full relative">
        <div className="w-full relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-96 bg-white rounded-xl shadow-lg">
              <Spinner size="lg" />
            </div>
          ) : (
            <ActivityTable activities={filteredActivities} />
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityPage;
