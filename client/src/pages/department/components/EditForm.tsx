import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";

interface RenameFolderModalProps {
  isOpen: boolean;
  currentFolderName: string;
  currentAlias?: string;
  currentImage?: string;
  onRename: (formData: FormData) => void;
  onClose: () => void;
}

const RenameFolderModal = ({
  isOpen,
  currentFolderName,
  currentAlias,
  currentImage,
  onRename,
  onClose,
}: RenameFolderModalProps) => {
  const [folderName, setFolderName] = useState(currentFolderName);
  const [alias, setAlias] = useState(currentAlias || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setFolderName(currentFolderName);
    setAlias(currentAlias || "");
    setPhoto(null);
    setError("");
  }, [currentFolderName, currentAlias, isOpen]);

  const handleSubmit = () => {
    setError("");

    if (!folderName.trim()) {
      setError("Department name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", folderName.trim());
    formData.append("alias", alias.trim());

    if (photo) {
      formData.append("image", photo);
    }

    onRename(formData);
  };

  const renderDepartmentImage = () => {
    const imageUrl = photo ? URL.createObjectURL(photo) : currentImage;

    return (
      <div className="relative w-28 h-28 mx-auto mb-4 border-4 border-white rounded-full shadow-md overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Department Logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            {/* Placeholder icon */}
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              ></path>
            </svg>
          </div>
        )}
        <label
          htmlFor="photo-upload"
          className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white text-sm font-medium"
          title="Change Image"
        >
          Change
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
        Edit Department
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Update the department's details and logo.
      </p>

      {/* Image Section */}
      {renderDepartmentImage()}

      {/* Error Message */}
      {error && (
        <div
          className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg text-center"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Form Inputs */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="folderName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            placeholder="e.g., Human Resources"
          />
        </div>

        <div>
          <label
            htmlFor="alias"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alias / Short Name (Optional)
          </label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            placeholder="e.g., HR"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default RenameFolderModal;
