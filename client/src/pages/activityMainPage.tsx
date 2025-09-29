import React, { useEffect, useState } from "react";
import ActivityTable from "./component/ActivityTable";
import Boxbar from "../layout/Boxbar";
import SelectionBar from "../layout/SelectionBar";
import Spinner from "../components/Spinner/Spinner";
// make sure the path is correct

type Activity = {
  id: number;
  name: string; // message
  time: string;
  date: string;
  status: "created" | "updated" | "deleted";
};

const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // spinner state

  useEffect(() => {
    // simulate loading delay (or real API call)
    const loadActivities = async () => {
      try {
        const saved = localStorage.getItem("app-activities");
        if (saved) {
          setActivities(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load activities:", error);
      } finally {
        setIsLoading(false); // stop spinner
      }
    };

    loadActivities();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Activity>).detail;
      setActivities((prev) => {
        const next = [detail, ...prev].slice(0, 100);
        try {
          localStorage.setItem("app-activities", JSON.stringify(next));
        } catch {}
        return next;
      });
    };
    window.addEventListener("app-activity", handler as EventListener);
    return () =>
      window.removeEventListener("app-activity", handler as EventListener);
  }, []);

  const filteredActivities = activities.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteActivities = () => {
    if (selectedActivities.length === 0) return;
    setActivities((prev) =>
      prev.filter((a) => !selectedActivities.includes(a.id))
    );
    setSelectedActivities([]);
    setIsEditing(false);
  };

  return (
    <>
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsAddModalOpen(true)}
      />
      <SelectionBar
        onAdd={() => setIsAddModalOpen(true)}
        totalItems={filteredActivities.length}
        selectedItems={selectedActivities.length}
        isEditing={isEditing}
        onSelectAll={(selectAll: boolean) => {
          if (!isEditing) return;
          setSelectedActivities(
            selectAll ? filteredActivities.map((a) => a.id) : []
          );
        }}
        onEdit={() => setIsEditing((prev) => !prev)}
        onDelete={handleDeleteActivities}
      />
      <div className="mt-10 w-full relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <ActivityTable activities={filteredActivities} />
        )}
      </div>
    </>
  );
};

export default ActivityPage;
