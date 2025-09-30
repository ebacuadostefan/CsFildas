import { useEffect, useState, useCallback } from "react";
import {
  fetchArchivedItems,
  restoreFile,
  restoreFolder,
  deleteArchivedItemPermanently,
  type ArchivedItem,
} from "../services/ArchiveServices";
import ArchiveTable from "./component/archiveTable";
import Headbar from "../layout/Boxbar";
import SelectionBar from "../layout/SelectionBar";

// Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-blue-500 font-medium">Loading...</span>
  </div>
);

// remove local Boxbar/SelectionBar in favor of shared components

const ArchiveMainPage = () => {
  const [archives, setArchives] = useState<ArchivedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Keep visual parity with Department's SelectionBar
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchArchivedItems();
      setArchives(data);
    } catch (err) {
      console.error("Failed to fetch archives", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRestore = async (item: ArchivedItem) => {
    try {
      setLoading(true);
      if (item.type === "file") await restoreFile(item.id);
      else await restoreFolder(item.id);

      setArchives((prev) => prev.filter((a) => a.id !== item.id));
      setSelected((prev) =>
        prev.filter((key) => key !== `${item.type}-${item.id}`)
      );
    } catch (err) {
      console.error("Failed to restore", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: ArchivedItem) => {
    try {
      setLoading(true);
      await deleteArchivedItemPermanently(item.type, item.id); // Placeholder API
      setArchives((prev) => prev.filter((a) => a.id !== item.id));
      setSelected((prev) =>
        prev.filter((key) => key !== `${item.type}-${item.id}`)
      );
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setLoading(false);
    }
  };

  // Selection is removed; actions are accessed via the row 3-dots menu
  const handleToggleSelect = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );

  const handleToggleSelectAll = () => {
    if (!isEditing) return;
    const allIds = filteredArchives.map((a) => `${a.type}-${a.id}`);
    if (selected.length === allIds.length) setSelected([]);
    else setSelected(allIds);
  };

  // Date formatting is handled in ArchiveTable

  const filteredArchives = archives.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Headbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {}}
      />

      <SelectionBar
        totalItems={filteredArchives.length}
        selectedItems={selected.length}
        isEditing={isEditing}
        onEdit={() => {
          setIsEditing((prev) => !prev);
          setSelected([]);
        }}
        onSelectAll={(selectAll) => {
          if (!isEditing) return;
          if (selectAll)
            setSelected(filteredArchives.map((a) => `${a.type}-${a.id}`));
          else setSelected([]);
        }}
        onDelete={() => {
          // Optional: bulk delete selected
          // If needed, we can iterate selected and call deleteArchivedItemPermanently
        }}
        onRename={() => {}}
        deleteLabel="Delete"
      />

      <div className="flex-1 overflow-y-auto mt-10 w-full relative">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <ArchiveTable
            items={filteredArchives}
            isEditing={isEditing}
            selected={selected}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ArchiveMainPage;
