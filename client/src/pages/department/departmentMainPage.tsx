import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import AddDepartmentForm from "../department/components/AddDepartmentForm";
import DepartmentServices, {
  type Department,
} from "../../services/DepartmentServices";
import Boxbar from "../../layout/Boxbar";
import SelectionBar from "../../layout/SelectionBar"; // KEPT
import Spinner from "../../components/Spinner/Spinner";
import DeleteDepartmentModal from "./components/DeleteDepartmentModal";
import RenameFolderModal from "./components/EditForm";
import { HiDotsVertical } from "react-icons/hi"; // New icon import

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]); // KEPT
  const [isEditing, setIsEditing] = useState(false); // KEPT
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [departmentToRename, setDepartmentToRename] =
    useState<Department | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // State for three-dot menu
  const navigate = useNavigate();

  // --- Data Fetching Logic (Unchanged) ---
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DepartmentServices.loadDepartments(
        searchTerm || undefined
      );
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    const id = setTimeout(fetchDepartments, 300);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [fetchDepartments]);

  // --- Global State Management ---

  const handleAddDepartment = async (formData: FormData) => {
    try {
      const newDept = await DepartmentServices.storeDepartment(formData);
      setDepartments((prev) => [...prev, newDept]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((deptId) => deptId !== id) : [...prev, id]
    );
  };

  // --- Delete Logic ---

  // Initiated by SelectionBar (multi-delete) or three-dot menu (single-delete)
  const handleDeleteDepartments = (deptId?: number) => {
    if (deptId) {
      // Single delete initiated from three-dot menu
      const dept = departments.find((d) => d.id === deptId);
      if (dept) {
        setDepartmentToRename(dept);
        setSelectedDepartments([deptId]); // Temporarily set for modal display
        setIsDeleteModalOpen(true);
        setOpenMenuId(null);
      }
    } else if (selectedDepartments.length > 0) {
      // Multi-delete initiated from SelectionBar
      setDepartmentToRename(null); // Clear single select context
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteDepartments = async () => {
    const idsToDelete = departmentToRename
      ? [departmentToRename.id]
      : selectedDepartments;

    if (idsToDelete.length === 0) return;

    try {
      await Promise.all(
        idsToDelete.map((id) => DepartmentServices.destroyDepartment(id))
      );
      setDepartments((prev) =>
        prev.filter((dept) => !idsToDelete.includes(dept.id))
      );
      setSelectedDepartments([]);
      setIsEditing(false);
      setIsDeleteModalOpen(false);
      setDepartmentToRename(null);
    } catch (error) {
      console.error("Failed to delete departments:", error);
    }
  };

  // --- Rename Logic ---

  // Initiated by SelectionBar (if only 1 selected) or three-dot menu (single rename)
  const handleRenameDepartment = (deptId?: number) => {
    let idToRename = deptId;

    if (!idToRename && selectedDepartments.length === 1) {
      idToRename = selectedDepartments[0]; // From SelectionBar
    } else if (!idToRename) {
      return; // No valid department to rename
    }

    const dept = departments.find((d) => d.id === idToRename);
    if (dept) {
      setDepartmentToRename(dept);
      setIsRenameModalOpen(true);
      setOpenMenuId(null);
    }
  };

  const confirmRenameDepartment = async (formData: FormData) => {
    if (!departmentToRename) return;

    try {
      const updated = await DepartmentServices.updateDepartment(
        departmentToRename.id,
        formData
      );

      setDepartments((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );

      // Activity logging remains
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Department renamed to "${updated.name}"`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "updated",
          },
        })
      );

      setIsRenameModalOpen(false);
      setDepartmentToRename(null);
      setSelectedDepartments([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to rename department:", error);
    }
  };

  // --- Utility Functions ---

  const filteredDepartments = departments.filter((dept) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const nameMatch = dept.name.toLowerCase().includes(lowerSearchTerm);
    const aliasMatch = dept.alias?.toLowerCase().includes(lowerSearchTerm);
    const slugMatch = dept.slug?.toLowerCase().includes(lowerSearchTerm);

    return nameMatch || aliasMatch || slugMatch;
  });

  const toggleMenu = (deptId: number) => {
    setOpenMenuId(openMenuId === deptId ? null : deptId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      // Check if the click is outside any menu trigger/button
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

      {/* SelectionBar is KEPT */}
      <SelectionBar
        onAdd={() => setIsAddModalOpen(true)}
        totalItems={filteredDepartments.length}
        selectedItems={selectedDepartments.length}
        isEditing={isEditing}
        onSelectAll={(selectAll: boolean) => {
          if (!isEditing) return;
          setSelectedDepartments(
            selectAll ? filteredDepartments.map((d) => d.id) : []
          );
        }}
        onEdit={() => {
          setIsEditing((prev) => !prev);
          setSelectedDepartments([]); // Clear selection when exiting edit mode
          setOpenMenuId(null); // Close any open three-dot menu
        }}
        onDelete={() => handleDeleteDepartments()} // Multi-delete
        onRename={() => handleRenameDepartment()} // Rename only if 1 is selected
      />

      <div className="mt-10 w-full relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => {
                const isSelected = selectedDepartments.includes(dept.id);
                const isMenuOpen = openMenuId === dept.id;

                const handleCardClick = () => {
                  if (isEditing) {
                    // Selection logic when in global edit mode
                    handleCheckboxChange(dept.id);
                  } else {
                    // Navigation logic when NOT in global edit mode
                    navigate(
                      `/departments/${
                        dept.slug ||
                        dept.name.toLowerCase().replace(/\s+/g, "-")
                      }`
                    );
                  }
                };

                return (
                  <div
                    key={dept.id}
                    className={`bg-white rounded-xl shadow-md flex flex-col items-center p-6 transition cursor-pointer relative
                      ${isEditing && isSelected ? "ring-2 ring-blue-500" : ""} 
                      hover:shadow-xl`}
                  >
                    {/* Element that handles selection (when editing) or navigation (when not editing) */}
                    <div
                      className="flex flex-col items-center w-full"
                      onClick={handleCardClick}
                    >
                      {/* Department Image/Content */}
                      {dept.image ? (
                        <img
                          src={dept.image}
                          alt={dept.name}
                          className="w-24 h-24 rounded-full mb-3 object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                      <h3 className="text-center text-gray-900 font-semibold uppercase text-sm sm:text-base">
                        {dept.name}
                      </h3>
                      {dept.alias && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          {dept.alias}
                        </p>
                      )}
                    </div>

                    {/* Three-Dot Menu: 
                      Only show when NOT in isEditing mode, as SelectionBar handles actions in that mode.
                    */}
                    {!isEditing && (
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click navigation
                            toggleMenu(dept.id);
                          }}
                          className="p-2 rounded-full hover:bg-gray-100"
                          data-menu-trigger // Used to identify menu buttons for closing logic
                        >
                          <HiDotsVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 focus:outline-none"
                            onClick={(e) => e.stopPropagation()} // Keep menu open when clicking inside
                          >
                            <div className="py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleRenameDepartment(dept.id)}
                              >
                                Rename
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteDepartments(dept.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                No departments found.
              </p>
            )}
          </div>
        )}

        {/* Add Department Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          showCloseButton
        >
          <AddDepartmentForm
            onSubmit={handleAddDepartment}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <DeleteDepartmentModal
          isOpen={isDeleteModalOpen}
          departmentNames={
            departmentToRename // Use single item if set (from three-dot menu)
              ? [departmentToRename.name]
              : departments // Otherwise use all selected items (from SelectionBar)
                  .filter((d) => selectedDepartments.includes(d.id))
                  .map((d) => d.name)
          }
          onDelete={confirmDeleteDepartments}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDepartmentToRename(null);
          }}
        />

        {/* Rename Modal */}
        <RenameFolderModal
          isOpen={isRenameModalOpen}
          currentFolderName={departmentToRename?.name || ""}
          currentAlias={departmentToRename?.alias || ""}
          currentImage={departmentToRename?.image}
          onRename={confirmRenameDepartment}
          onClose={() => {
            setIsRenameModalOpen(false);
            setDepartmentToRename(null);
          }}
        />
      </div>
    </>
  );
};

export default Departments;
