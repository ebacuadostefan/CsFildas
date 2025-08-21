import { FaTrash } from "react-icons/fa";
import type { FileItem } from "../../../../../services/ComputerStudiesServices";


interface FilesTableProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onDeleteClick: (file: FileItem) => void;
}

const FilesTable = ({ files, onFileClick, onDeleteClick }: FilesTableProps) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden overflow-x-auto">
      <table className="min-w-full table-auto text-sm sm:text-base">
        <thead className="bg-gray-100 text-left text-gray-600">
          <tr>
            <th className="px-4 sm:px-6 py-3">File Name</th>
            <th className="px-4 sm:px-6 py-3">File Type</th>
            <th className="px-4 sm:px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {files.length > 0 ? (
            files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition">
                <td
                  className="px-4 sm:px-6 py-4 font-medium cursor-pointer text-blue-600 hover:underline"
                  onClick={() => onFileClick(file)}
                >
                  {file.fileName}
                </td>
                <td className="px-4 sm:px-6 py-4">{file.fileType || "Unknown"}</td>
                <td className="px-4 sm:px-6 py-4">
                  <button
                    onClick={() => onDeleteClick(file)}
                    className="text-red-500 hover:text-red-600 flex items-center space-x-1 text-sm sm:text-base"
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
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
