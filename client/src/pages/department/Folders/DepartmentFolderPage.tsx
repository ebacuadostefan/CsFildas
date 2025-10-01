import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DepartmentServices from "../../../services/DepartmentServices";
import Spinner from "../../../components/Spinner/Spinner";
import Boxbar from "../../../layout/Boxbar";
import DeleteDepartmentModal from "../components/DeleteDepartmentModal";
import SelectionBar from "../../../layout/SelectionBar";
import AddFolderModal from "./Components/AddFolderForm";
import RenameItemModal from "../../department/components/FolderFileForm";
import { HiDotsVertical } from "react-icons/hi";
import { FaFolder } from "react-icons/fa";
import useAuth from "../../../hooks/UseAuth";

interface DepartmentFolder {
  id: number;
  folderName: string;
  slug: string;
  departmentId: number;
}

const DepartmentFolderPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { canAccessDepartmentBySlug, isAdmin, getDepartmentRedirect } =
    useAuth();
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Access control check
  useEffect(() => {
    if (slug && !canAccessDepartmentBySlug(slug)) {
      navigate(getDepartmentRedirect());
      return;
    }
  }, [slug, canAccessDepartmentBySlug, navigate, getDepartmentRedirect]);

  // --- Data Fetching Logic (using useCallback for consistency) ---
  const fetchFolders = useCallback(() => {
    if (!slug) return;

    setLoading(true);
    DepartmentServices.getFoldersByDepartmentSlug(slug, searchTerm || undefined)
      .then(setFolders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, searchTerm]);

  useEffect(() => {
    const id = setTimeout(fetchFolders, 300);
    return () => clearTimeout(id);
  }, [fetchFolders]);

  // --- Selection and Action Handlers ---

  const handleCheckboxChange = (id: number) => {
    setSelectedFolders((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleDeleteFolders = (folderId?: number) => {
    if (folderId) {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setFolderToRename(folder);
        setSelectedFolders([folderId]);
        setIsDeleteModalOpen(true);
        setOpenMenuId(null);
      }
    } else if (selectedFolders.length > 0) {
      setFolderToRename(null);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteFolders = async () => {
    const idsToDelete = folderToRename ? [folderToRename.id] : selectedFolders;

    if (idsToDelete.length === 0) return;

    try {
      await Promise.all(
        idsToDelete.map((id) => DepartmentServices.deleteFolder(id))
      );
      setFolders((prev) => prev.filter((f) => !idsToDelete.includes(f.id)));

      // Activity logging
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Deleted ${idsToDelete.length} folder(s)`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "deleted",
          },
        })
      );

      setSelectedFolders([]);
      setIsEditing(false);
      setIsDeleteModalOpen(false);
      setFolderToRename(null);
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
      // Activity logging...
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

  const handleRenameFolder = (folderId?: number) => {
    let idToRename = folderId;

    if (!idToRename && selectedFolders.length === 1) {
      idToRename = selectedFolders[0];
    } else if (!idToRename) {
      return;
    }

    const folder = folders.find((f) => f.id === idToRename);
    if (folder) {
      setFolderToRename(folder);
      setIsRenameModalOpen(true);
      setOpenMenuId(null);
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
      // Activity logging...
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

  // --- Utility/Menu Logic ---

  const filteredFolders = folders.filter((folder) =>
    folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (folderId: number) => {
    setOpenMenuId(openMenuId === folderId ? null : folderId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        openMenuId !== null &&
        !(event.target as HTMLElement).closest("[data-menu-trigger]")
      ) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [openMenuId]);

  // --- Render ---

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
        onEdit={() => {
          setIsEditing((prev) => !prev);
          setSelectedFolders([]);
          setOpenMenuId(null);
        }}
        onSelectAll={(selectAll) =>
          setSelectedFolders(selectAll ? filteredFolders.map((f) => f.id) : [])
        }
        onDelete={() => handleDeleteFolders()}
        onRename={() => handleRenameFolder()}
      />
      <div className="mt-10 w-full relative">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFolders.map((folder) => {
              const isSelected = selectedFolders.includes(folder.id);
              const isMenuOpen = openMenuId === folder.id;

              const handleCardClick = () => {
                if (isEditing) {
                  handleCheckboxChange(folder.id);
                } else {
                  navigate(`/departments/${slug}/folders/${folder.slug}`);
                }
              };

              return (
                <div
                  key={folder.id}
                  className={`bg-white shadow-md rounded-md p-4 flex items-center space-x-4 transition cursor-pointer relative
                      ${isEditing && isSelected ? "ring-2 ring-blue-500" : ""} 
                      hover:shadow-xl`}
                  onClick={handleCardClick}
                >
                  {/* --- Content --- */}
                  {/* IMPORTANT: Ensure 'min-w-0' is on the container and the name element. */}
                  <div className="flex items-center space-x-2 flex-grow min-w-0">
                    {/* Folder Icon */}
                    <FaFolder className="h-7 w-7 text-gray-500 flex-shrink-0" />

                    {/* Folder Name - Added 'inline-block' for flow and 'min-w-0' for consistent truncation */}
                    <span className="text-gray-800 font-medium **inline-block** min-w-0 overflow-hidden truncate">
                      {folder.folderName}
                    </span>
                  </div>

                  {/* --- Three-Dot Menu --- */}
                  {!isEditing ? (
                    <div className="absolute top-2 right-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(folder.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100"
                        data-menu-trigger
                      >
                        <HiDotsVertical className="w-3 h-3 text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleRenameFolder(folder.id)}
                            >
                              Rename
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteFolders(folder.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Placeholder for when not editing
                    <div className="absolute top-2 right-2">
                      {isSelected && <div className="w-5 h-5"></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Modals (Unchanged Logic) --- */}

      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        departmentNames={
          folderToRename
            ? [folderToRename.folderName]
            : folders
                .filter((f) => selectedFolders.includes(f.id))
                .map((f) => f.folderName)
        }
        onDelete={confirmDeleteFolders}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFolderToRename(null);
        }}
      />

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
