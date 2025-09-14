import { FaTrash, FaEdit } from "react-icons/fa";
import type { Department } from "../../../services/DepartmentServices";

interface DepartmentsTableProps {
  departments: Department[];
  onDepartmentClick: (dept: Department) => void;
  onDeleteClick: (dept: Department) => void;
  onRenameClick: (dept: Department) => void;
}

const DepartmentsTable = ({
  departments,
  onDepartmentClick,
  onDeleteClick,
  onRenameClick,
}: DepartmentsTableProps) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden overflow-x-auto">
      <table className="min-w-full table-auto text-sm sm:text-base">
        <thead className="bg-gray-100 text-left text-gray-600">
          <tr>
            <th className="px-4 sm:px-6 py-3">Department Name</th>
            <th className="px-4 sm:px-6 py-3">Alias</th>
            <th className="px-4 sm:px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 transition">
                {/* Department name */}
                <td
                  className="px-4 sm:px-6 py-4 font-medium cursor-pointer text-blue-600 hover:underline"
                  onClick={() => onDepartmentClick(dept)}
                >
                  {dept.name}
                </td>

                {/* Department alias */}
                <td className="px-4 sm:px-6 py-4">{dept.alias || "—"}</td>

                {/* Actions */}
                <td className="px-4 sm:px-6 py-4 flex space-x-4">
                  <button
                    onClick={() => onRenameClick(dept)}
                    className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 text-sm sm:text-base"
                  >
                    <FaEdit /> <span>Rename</span>
                  </button>

                  <button
                    onClick={() => onDeleteClick(dept)}
                    className="text-red-500 hover:text-red-600 flex items-center space-x-1 text-sm sm:text-base"
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-600 px-6 py-6">
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentsTable;
