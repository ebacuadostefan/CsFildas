import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight, FaPlus } from "react-icons/fa";
import BackButton from "../../components/Button/BackButton";
import Modal from "../../components/Modal";
import AddDepartmentForm from "../department/components/AddDepartmentForm";
import DepartmentServices, {
  type Department,
} from "../../services/DepartmentServices";
import CCSimg from "../../assets/img/CSSimg.jpg";

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await DepartmentServices.loadDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // 🔹 Add department
  const handleAddDepartment = async (name: string, alias: string) => {
    try {
      const newDept = await DepartmentServices.storeDepartment({
        name,
        alias,
      });
      setDepartments((prev) => [...prev, newDept]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  // 🔹 Search filter
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-15 max-w-7xl ml-3 mx-auto relative">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
        <BackButton />
        <div className="flex items-center space-x-2">
          <FaHome
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <FaChevronRight className="text-gray-400" />
          <span className="text-blue-600 font-medium">Departments</span>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="ml-4 px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              onClick={() =>
                dept.name === "Computer Studies" ||
                "College of Computer Studies"
                  ? navigate("/departments/computerstudies")
                  : alert(`Page for ${dept.name} is not yet available.`)
              }
              className="bg-white rounded-lg shadow-md flex flex-col items-center p-6 hover:shadow-lg transition"
            >
              {dept.name === "Computer Studies" ||
              "College of Computer Studies" ? (
                <img
                  src={CCSimg}
                  alt="College of Computer Studies"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full mb-4"></div>
              )}
              <p className="text-center font-medium text-gray-700 uppercase text-sm">
                {dept.name}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            No departments found.
          </p>
        )}
      </div>

      {/* ➕ Add Department Modal */}
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
    </div>
  );
};

export default Departments;
