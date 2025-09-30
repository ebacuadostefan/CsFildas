import { useEffect, useState, useCallback } from "react";
import {
  fetchArchivedItems,
  restoreFile,
  restoreFolder,
  deleteArchivedItemPermanently,
  type ArchivedItem,
} from "../services/ArchiveServices"; // ✅ Import from services
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";

// Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-blue-500 font-medium">Loading...</span>
  </div>
);

// Search + Add bar
const Boxbar = ({
  searchTerm,
  setSearchTerm,
  onAdd,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onAdd: () => void;
}) => (
  <div className="p-4 bg-white border-b shadow-sm flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
    <div className="flex items-center w-full max-w-lg relative">
      <FaSearch className="h-5 w-5 text-gray-400 absolute left-3" />
      <input
        type="text"
        placeholder="Search archives by name or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-inner"
      />
    </div>
    <button
      onClick={onAdd}
      className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center justify-center space-x-2"
    >
      <FaPlus className="w-5 h-5" />
      <span>New Item (Mock)</span>
    </button>
  </div>
);

// Selection bar for batch actions
const SelectionBar = ({
  count,
  onDelete,
  onRestore,
}: {
  count: number;
  onDelete: () => void;
  onRestore: () => void;
}) => (
  <div className="sticky top-0 z-10 p-3 bg-yellow-50 text-yellow-800 border-b border-yellow-300 flex flex-col sm:flex-row justify-between items-center shadow-lg rounded-b-xl mx-4 mt-2">
    <span className="font-semibold text-sm mb-2 sm:mb-0">
      {count} items selected
    </span>
    <div className="flex space-x-3">
      <button
        onClick={onRestore}
        className="px-4 py-2 text-xs bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-150 flex items-center space-x-1"
      >
        <FaRotate className="w-4 h-4" />
        <span>Restore</span>
      </button>
      <button
        onClick={onDelete}
        className="px-4 py-2 text-xs bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-150 flex items-center space-x-1"
      >
        <FaTrash className="w-4 h-4" />
        <span>Delete Permanently</span>
      </button>
    </div>
  </div>
);

const ArchiveMainPage = () => {
  const [archives, setArchives] = useState<ArchivedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

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
      setSelected((prev) => prev.filter((id) => id !== item.id));
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
      setSelected((prev) => prev.filter((id) => id !== item.id));
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleToggleSelectAll = () => {
    const allIds = filteredArchives.map((a) => a.id);
    if (selected.length === allIds.length) setSelected([]);
    else setSelected(allIds);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredArchives = archives.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => alert("Add Item: Not implemented.")}
      />

      <h1 className="text-3xl font-extrabold text-gray-800 p-6 pb-2">
        Document Archive
      </h1>

      {selected.length > 0 && (
        <SelectionBar
          count={selected.length}
          onDelete={() => {
            selected.forEach((id) => {
              const item = archives.find((a) => a.id === id);
              if (item) handleDelete(item);
            });
          }}
          onRestore={() => {
            selected.forEach((id) => {
              const item = archives.find((a) => a.id === id);
              if (item) handleRestore(item);
            });
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg mt-4">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-blue-50 text-gray-600 uppercase text-xs leading-normal border-b border-gray-200">
                  <th className="py-3 px-3 text-center w-12 rounded-tl-xl">
                    <input
                      type="checkbox"
                      checked={
                        selected.length > 0 &&
                        selected.length === filteredArchives.length
                      }
                      onChange={handleToggleSelectAll}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-6 text-left font-semibold">Name</th>
                  <th className="py-3 px-6 text-left font-semibold">
                    Department
                  </th>
                  <th className="py-3 px-6 text-left font-semibold">Type</th>
                  <th className="py-3 px-6 text-left font-semibold">
                    Date Archived
                  </th>
                  <th className="py-3 px-6 text-center font-semibold rounded-tr-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {filteredArchives.length > 0 ? (
                  filteredArchives.map((item) => {
                    const isSelected = selected.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-100 transition duration-100 ${
                          isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-6 font-medium text-gray-800">
                          {item.name}
                        </td>
                        <td className="py-3 px-6">{item.department_name}</td>
                        <td className="py-3 px-6 capitalize">{item.type}</td>
                        <td className="py-3 px-6">
                          {formatDate(item.archived_at)}
                        </td>
                        <td className="py-3 px-6 text-center space-x-2">
                          <button className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition">
                            View
                          </button>
                          <button
                            onClick={() => handleRestore(item)}
                            className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-gray-500 italic text-lg bg-white rounded-b-xl"
                    >
                      No archived records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveMainPage;
