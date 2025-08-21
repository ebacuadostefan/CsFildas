import { useRef, useState } from "react";
import { FaChevronRight, FaHome, FaUpload, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../../components/Button/BackButton";

const ProgramOutcomes = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleFileClick = (file: File) => {
    alert(`Pretend to open: ${file.name}`);
  };

  const handleDeleteFile = (fileToDelete: File) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${fileToDelete.name}"?`
    );
    if (confirmDelete) {
      setUploadedFiles((prev) => prev.filter((file) => file !== fileToDelete));
    }
  };

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-15 max-w-7xl mx-auto">
      {/* 🔙 Back + Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
        <BackButton />

        <div className="flex items-center space-x-2">
          <FaHome
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <FaChevronRight className="text-gray-400" />
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate("/departments")}
          >
            Departments
          </span>
          <FaChevronRight className="text-gray-400" />
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate("/departments/computerstudies")}
          >
            Computer Studies
          </span>
          <FaChevronRight className="text-gray-400" />
          <span className="text-blue-600 font-semibold">Program Outcomes</span>
        </div>
      </div>

      {/* 🔍 Search + Upload */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search uploaded files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleUploadClick}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaUpload className="mr-2" /> Upload
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 📋 Uploaded Files Table */}
      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="px-6 py-3">File Name</th>
              <th className="px-6 py-3">File Type</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td
                    className="px-6 py-4 font-medium cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleFileClick(file)}
                  >
                    {file.name}
                  </td>
                  <td className="px-6 py-4">{file.type || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteFile(file)}
                      className="text-red-500 hover:text-red-600 cursor-pointer flex items-center space-x-1"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-gray-600 px-6 py-6">
                  No uploaded files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramOutcomes;
