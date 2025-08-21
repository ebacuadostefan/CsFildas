import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaPlus, FaChevronRight, FaHome } from "react-icons/fa";
import BackButton from "../../../components/Button/BackButton";
import Modal from "../../../components/Modal";
import ComputerStudiesForm from "./Components/AddForm";
import RenameFolderModal from "./Components/EditForm";
import DeleteFolderModal from "./Components/DeleteForm";
import ComputerStudiesServices from "../../../services/ComputerStudiesServices"; // ✅ API service

interface Folder {
  id: number;
  folderName: string;
  description?: string;
}

const ComputerStudiesMainPage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [rightClickedFolder, setRightClickedFolder] = useState<Folder | null>(
    null
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  // 🔹 Load folders from API on mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const data = await ComputerStudiesServices.loadFolders();
        setFolders(data);
      } catch (error) {
        console.error("Failed to load folders:", error);
      }
    };
    fetchFolders();
  }, []);

  // 🔹 Add folder
  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const newFolder = await ComputerStudiesServices.storeFolder({
          folderName: newFolderName.trim(),
        });
        setFolders((prev) => [...prev, newFolder]); // update state
      } catch (error) {
        console.error("Failed to add folder:", error);
      }
    }
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  // 🔹 Delete folder
  const handleDeleteFolder = async () => {
    if (rightClickedFolder) {
      try {
        await ComputerStudiesServices.destroyFolder(rightClickedFolder.id);
        setFolders((prev) =>
          prev.filter((folder) => folder.id !== rightClickedFolder.id)
        );
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
    }
  };

  // 🔹 Rename folder
  const handleRenameFolder = async (newName: string) => {
    if (rightClickedFolder) {
      try {
        const updated = await ComputerStudiesServices.updateFolder(
          rightClickedFolder.id,
          { folderName: newName }
        );
        setFolders((prev) =>
          prev.map((f) => (f.id === updated.id ? updated : f))
        );
      } catch (error) {
        console.error("Failed to rename folder:", error);
      }
    }
  };

  // 🔹 Context menu
  const handleFolderRightClick = (e: React.MouseEvent, folder: Folder) => {
    e.preventDefault();
    setRightClickedFolder(folder);
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleClick = () => setShowContextMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // 🔹 Search filter
  const filteredFolders = folders.filter((folder) =>
    folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Folder navigation
  const handleFolderClick = (folder: Folder) => {
    setShowContextMenu(false);
    navigate(`/departments/computerstudies/folder/${folder.id}`);
  };

  return (
    <div className="p-15 max-w-7xl mx-auto relative">
      {/* 🔷 Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
        <BackButton />
        <div className="flex items-center space-x-2">
          <FaHome
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <FaChevronRight className="text-gray-400" />
          <span
            className="text-blue-500 font-medium cursor-pointer"
            onClick={() => navigate("/departments")}
          >
            Departments
          </span>
          <FaChevronRight className="text-gray-400" />
          <span className="text-blue-700 font-semibold">Computer Studies</span>
        </div>
      </div>

      {/* 🔍 Search + Add Folder */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>

      {/* 📁 Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => (
            <div
              key={folder.id}
              onContextMenu={(e) => handleFolderRightClick(e, folder)}
              onClick={() => handleFolderClick(folder)}
              className="bg-gray-100 rounded-md p-4 flex items-center space-x-4 hover:bg-gray-200 transition cursor-pointer"
            >
              <FaFolder className="text-yellow-500 text-2xl" />
              <span className="text-gray-800 font-medium truncate">
                {folder.folderName}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No folders found.
          </p>
        )}
      </div>

      {/* 🗑️ Context Menu */}
      {showContextMenu && rightClickedFolder && (
        <ul
          className="fixed bottom-6 right-6 bg-white border border-gray-300 shadow-lg rounded-md z-50"
          style={{ minWidth: "220px" }}
        >
          <li
            className="px-4 py-2 hover:bg-blue-100 text-blue-600 cursor-pointer"
            onClick={() => {
              setIsRenameModalOpen(true);
              setShowContextMenu(false);
            }}
          >
            ✏️ Rename "{rightClickedFolder.folderName}"
          </li>
          <li
            className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
            onClick={() => {
              setIsDeleteModalOpen(true);
              setShowContextMenu(false);
            }}
          >
            🗑️ Delete "{rightClickedFolder.folderName}"
          </li>
        </ul>
      )}

      {/* ➕ Add Folder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        showCloseButton
      >
        <ComputerStudiesForm
          folderName={newFolderName}
          setFolderName={setNewFolderName}
          onSubmit={handleAddFolder}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* ✏️ Rename Folder Modal */}
      <RenameFolderModal
        isOpen={isRenameModalOpen}
        currentFolderName={rightClickedFolder?.folderName || ""}
        onRename={handleRenameFolder}
        onClose={() => setIsRenameModalOpen(false)}
      />

      {/* 🗑️ Delete Folder Modal */}
      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        folderName={rightClickedFolder?.folderName || ""}
        onDelete={handleDeleteFolder}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ComputerStudiesMainPage;
