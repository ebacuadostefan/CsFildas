import { FaTrash } from "react-icons/fa";
import type { FileItem } from "../../../../services/DepartmentServices";

interface FilesTableProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onDeleteClick: (file: FileItem) => void;
  selectedFiles?: number[];
  isEditing?: boolean;
  onCheckboxChange?: (id: number) => void;
}

const FilesTable = ({
  files,
  onFileClick,
  onDeleteClick,
  selectedFiles = [],
  isEditing = false,
  onCheckboxChange,
}: FilesTableProps) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden overflow-x-auto">
      <table className="min-w-full table-auto text-sm sm:text-base">
        <thead className="bg-gray-100 text-left text-gray-600">
          <tr>
            {isEditing && <th className="px-4 sm:px-6 py-3 w-12"></th>}
            <th className="px-4 sm:px-6 py-3">File Name</th>
            <th className="px-4 sm:px-6 py-3">File Type</th>
            <th className="px-4 sm:px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {files.length > 0 ? (
            files.map((file) => {
              const isSelected = selectedFiles.includes(file.id);
              return (
                <tr
                  key={file.id}
                  className={`hover:bg-gray-50 transition cursor-pointer ${
                    isEditing && isSelected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => onFileClick(file)}
                >
                  {isEditing && (
                    <td
                      className="px-4 sm:px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onCheckboxChange?.(file.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-4 sm:px-6 py-4 font-medium text-blue-600 hover:underline">
                    {file.fileName}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {file.fileType || "Unknown"}
                  </td>
                  <td
                    className="px-4 sm:px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onDeleteClick(file)}
                      className="text-red-500 hover:text-red-600 flex items-center space-x-1 text-sm sm:text-base"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={isEditing ? 4 : 3}
                className="text-center text-gray-600 px-6 py-6"
              >
                No files found in this folder.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilesTable;
