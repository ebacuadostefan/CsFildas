import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DepartmentServices from "../../../services/DepartmentServices";
import Spinner from "../../../components/Spinner/Spinner";
import Boxbar from "../../../layout/Boxbar";
import DeleteDepartmentModal from "../components/DeleteDepartmentModal";
import SelectionBar from "../../../layout/SelectionBar"; // import your modal
import AddFolderModal from "./Components/AddFolderForm";
import RenameItemModal from "../../department/components/FolderFileForm";

interface DepartmentFolder {
  id: number;
  folderName: string;
  slug: string;
  departmentId: number;
}

const DepartmentFolderPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<DepartmentFolder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<DepartmentFolder | null>(
    null
  );

  useEffect(() => {
    if (!slug) return;

    const id = setTimeout(() => {
      setLoading(true);
      DepartmentServices.getFoldersByDepartmentSlug(
        slug,
        searchTerm || undefined
      )
        .then(setFolders)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(id);
  }, [slug, searchTerm]);

  // Checkbox selection
  const handleCheckboxChange = (id: number) => {
    setSelectedFolders((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Delete selected folders
  const handleDeleteFolders = async () => {
    try {
      await Promise.all(
        selectedFolders.map((id) => DepartmentServices.deleteFolder(id))
      );
      setFolders((prev) => prev.filter((f) => !selectedFolders.includes(f.id)));
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Deleted ${selectedFolders.length} folder(s)`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "deleted",
          },
        })
      );
      setSelectedFolders([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to delete folders:", error);
    }
  };

  // Add new folder
  const handleAddFolder = async (folderName: string) => {
    if (!slug) return;
    try {
      const newFolder = await DepartmentServices.createFolderInDepartment(
        slug,
        {
          folderName,
        }
      );
      setFolders((prev) => [...prev, newFolder]);
      setIsAddModalOpen(false);
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Folder created: ${newFolder.folderName}`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "created",
          },
        })
      );
    } catch (error) {
      console.error("Failed to add folder:", error);
    }
  };

  // Rename folder
  const handleRenameFolder = () => {
    if (selectedFolders.length === 1) {
      const folder = folders.find((f) => f.id === selectedFolders[0]);
      if (folder) {
        setFolderToRename(folder);
        setIsRenameModalOpen(true);
      }
    }
  };

  const confirmRenameFolder = async (newName: string) => {
    if (!folderToRename || !newName.trim()) return;
    try {
      const updated = await DepartmentServices.updateFolder(folderToRename.id, {
        folderName: newName.trim(),
      });
      setFolders((prev) =>
        prev.map((f) => (f.id === updated.id ? updated : f))
      );
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Folder renamed to "${updated.folderName}"`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "updated",
          },
        })
      );
      setIsRenameModalOpen(false);
      setFolderToRename(null);
      setSelectedFolders([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to rename folder:", error);
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsAddModalOpen(true)}
      />

      <SelectionBar
        onAdd={() => setIsAddModalOpen(true)}
        totalItems={filteredFolders.length}
        selectedItems={selectedFolders.length}
        isEditing={isEditing}
        onEdit={() => setIsEditing((prev) => !prev)}
        onSelectAll={(selectAll) =>
          setSelectedFolders(selectAll ? filteredFolders.map((f) => f.id) : [])
        }
        onDelete={() => setIsDeleteModalOpen(true)} // open modal
        onRename={handleRenameFolder}
      />

      <div className="mt-10 w-full relative">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="bg-white shadow-md rounded-md p-4 flex items-center space-x-4 hover:bg-gray-200 transition cursor-pointer relative"
              >
                {isEditing && (
                  <input
                    type="checkbox"
                    checked={selectedFolders.includes(folder.id)}
                    onChange={() => handleCheckboxChange(folder.id)}
                    className="absolute top-2 right-2 w-3 h-3 cursor-pointer"
                    onFocus={(e) => e.stopPropagation()}
                  />
                )}

                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-gray-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span
                    className="text-gray-800 font-medium truncate"
                    onClick={() =>
                      navigate(`/departments/${slug}/folders/${folder.slug}`)
                    }
                  >
                    {folder.folderName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Folder Modal */}
      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        departmentNames={folders
          .filter((f) => selectedFolders.includes(f.id))
          .map((f) => f.folderName)}
        onDelete={handleDeleteFolders}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Add Folder Modal */}
      <AddFolderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddFolder}
      />

      <RenameItemModal
        isOpen={isRenameModalOpen}
        currentName={folderToRename?.folderName || ""}
        onRename={confirmRenameFolder}
        onClose={() => {
          setIsRenameModalOpen(false);
          setFolderToRename(null);
        }}
        title="Rename Folder"
      />
    </>
  );
};

export default DepartmentFolderPage;
