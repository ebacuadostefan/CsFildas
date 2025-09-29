import { FaTrash } from "react-icons/fa";
import type { FileItem } from "../../../../services/DepartmentServices";

interface FilesTableProps {
  files: (FileItem & { displayName: string; displayType: string })[];
  onFileClick?: (file: FileItem) => void;
  onDeleteClick?: (file: FileItem) => void;
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
  if (!files.length) {
    return <p className="text-center text-gray-500 py-6">No files found</p>;
  }

  return (
    <>
      <div className="w-full">
        {/* Desktop / Tablet View */}
        <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-sm text-left bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
              <tr>
                {isEditing && <th className="px-4 py-3">Select</th>}
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">File Type</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-100 transition shadow-md last:border-none"
                >
                  {isEditing && (
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => onCheckboxChange?.(file.id)}
                      />
                    </td>
                  )}
                  <td
                    className="px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => onFileClick?.(file)}
                  >
                    {file.displayName}
                  </td>
                  <td className="px-4 py-2">{file.displayType}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onDeleteClick?.(file)}
                      className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                    >
                      <FaTrash />{" "}
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              {isEditing && (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => onCheckboxChange?.(file.id)}
                  />
                  <span className="text-xs text-gray-500">Select</span>
                </div>
              )}

              <p
                className="font-medium text-blue-600 hover:underline cursor-pointer"
                onClick={() => onFileClick?.(file)}
              >
                {file.displayName}
              </p>
              <p className="text-sm text-gray-500">Type: {file.displayType}</p>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => onDeleteClick?.(file)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilesTable;
