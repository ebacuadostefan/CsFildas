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

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await DepartmentServices.loadDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (formData: FormData) => {
    try {
      const newDept = await DepartmentServices.storeDepartment(formData);
      setDepartments((prev) => [...prev, newDept]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  const handleCheckboxChange = (id: string) => {
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

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        totalItems={filteredDepartments.length}
        selectedItems={selectedDepartments.length}
        isEditing={isEditing}
        onSelectAll={(selectAll: boolean) => {
          if (!isEditing) return;
          setSelectedDepartments(
            selectAll ? filteredDepartments.map((d) => d.id) : []
          );
        }}
        onEdit={() => setIsEditing((prev) => !prev)}
        onDelete={handleDeleteDepartments}
      />

      <div className="p-15 max-w-7xl mx-auto relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
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
                    className={`bg-white rounded-lg shadow-lg flex flex-col items-center p-6 transition cursor-pointer relative
                      ${isEditing && isSelected ? "ring-2 ring-blue-500" : ""}
                      hover:shadow-lg`}
                    onClick={handleCardClick}
                  >
                    {isEditing && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(dept.id)}
                        className="absolute top-2 right-2 w-3 h-3 cursor-pointer"
                      />
                    )}

                    {dept.image ? (
                      <img
                        src={dept.image}
                        alt={dept.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full mb-4"></div>
                    )}

                    <p className="text-center font-medium text-gray-700 uppercase text-sm">
                      {dept.name}
                    </p>
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
          departmentNames={departments
            .filter((d) => selectedDepartments.includes(d.id))
            .map((d) => d.name)}
          onDelete={confirmDeleteDepartments}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Departments;
