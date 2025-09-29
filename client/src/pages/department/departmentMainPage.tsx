import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import AddDepartmentForm from "../department/components/AddDepartmentForm";
import DepartmentServices, {
  type Department,
} from "../../services/DepartmentServices";
import Boxbar from "../../layout/Boxbar";
import SelectionBar from "../../layout/SelectionBar";
import Spinner from "../../components/Spinner/Spinner";
import DeleteDepartmentModal from "./components/DeleteDepartmentModal";
import RenameFolderModal from "./components/EditForm";

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [departmentToRename, setDepartmentToRename] =
    useState<Department | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchDepartments = async () => {
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
    };
    const id = setTimeout(fetchDepartments, 300);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [searchTerm]);

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

  const handleDeleteDepartments = () => {
    if (selectedDepartments.length > 0) setIsDeleteModalOpen(true);
  };

  const confirmDeleteDepartments = async () => {
    try {
      await Promise.all(
        selectedDepartments.map((id) =>
          DepartmentServices.destroyDepartment(id)
        )
      );
      setDepartments((prev) =>
        prev.filter((dept) => !selectedDepartments.includes(dept.id))
      );
      setSelectedDepartments([]);
      setIsEditing(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete departments:", error);
    }
  };

  const handleRenameDepartment = () => {
    if (selectedDepartments.length === 1) {
      const dept = departments.find((d) => d.id === selectedDepartments[0]);
      if (dept) {
        setDepartmentToRename(dept);
        setIsRenameModalOpen(true);
      }
    }
  }; //  2: Updated to accept FormData directly from the RenameFolderModal

  const confirmRenameDepartment = async (formData: FormData) => {
    if (!departmentToRename) return;

    try {
      // FormData already contains 'name', 'alias', 'image' (if set), and '_method: PUT' (from modal fix)
      const updated = await DepartmentServices.updateDepartment(
        departmentToRename.id,
        formData
      );

      setDepartments((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );

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
  }; //  Updated to search by name, alias, OR slug.

  const filteredDepartments = departments.filter((dept) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const nameMatch = dept.name.toLowerCase().includes(lowerSearchTerm);
    const aliasMatch = dept.alias?.toLowerCase().includes(lowerSearchTerm);
    const slugMatch = dept.slug?.toLowerCase().includes(lowerSearchTerm);

    return nameMatch || aliasMatch || slugMatch;
  });

  return (
    <>
           {" "}
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsAddModalOpen(true)}
      />
           {" "}
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
        }}
        onDelete={handleDeleteDepartments}
        onRename={handleRenameDepartment}
      />
           {" "}
      <div className="mt-10 w-full relative">
               {" "}
        {loading ? (
          <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" />         {" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => {
                const isSelected = selectedDepartments.includes(dept.id);

                const handleCardClick = () => {
                  if (isEditing) {
                    handleCheckboxChange(dept.id);
                  } else {
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
                    onClick={handleCardClick}
                  >
                    {/* Checkbox (edit mode only) */}
                    {isEditing && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(dept.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 w-4 h-4 cursor-pointer"
                      />
                    )}

                    {/* Department Image */}
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

                    {/* Department Name */}
                    <h3 className="text-center text-gray-900 font-semibold uppercase text-sm sm:text-base">
                      {dept.name}
                    </h3>

                    {/* Department Alias */}
                    {dept.alias && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        {dept.alias}
                      </p>
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
                {/* Add Department Modal */}       {" "}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          showCloseButton
        >
                   {" "}
          <AddDepartmentForm
            onSubmit={handleAddDepartment}
            onCancel={() => setIsAddModalOpen(false)}
          />
                 {" "}
        </Modal>
                {/* Delete Confirmation Modal */}       {" "}
        <DeleteDepartmentModal
          isOpen={isDeleteModalOpen}
          departmentNames={departments
            .filter((d) => selectedDepartments.includes(d.id))
            .map((d) => d.name)}
          onDelete={confirmDeleteDepartments}
          onClose={() => setIsDeleteModalOpen(false)}
        />
                {/* 🔹 Updated rename modal */}       {" "}
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
             {" "}
      </div>
         {" "}
    </>
  );
};

export default Departments;
