import React, { useState } from "react";

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (folderName: string) => void;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    if (!folderName.trim()) return;
    onAdd(folderName.trim());
    setFolderName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Folder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="mb-5">
          <label
            htmlFor="folderName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Folder Name <span className="text-red-500">*</span>
          </label>
          <input
            id="folderName"
            type="text"
            placeholder="e.g., Project Folders"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            autoFocus
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setFolderName("");
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 
              hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white 
              hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!folderName.trim()}
          >
            Add Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
