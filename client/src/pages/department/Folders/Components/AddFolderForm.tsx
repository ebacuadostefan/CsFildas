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
    setFolderName(""); // reset input
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Lighter overlay with subtle blur
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Add New Folder
        </h2>

        <input
          type="text"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setFolderName("");
              onClose();
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
