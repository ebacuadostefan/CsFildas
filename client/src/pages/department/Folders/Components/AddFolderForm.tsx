import React, { useState, type FC } from "react";

// --- Internal Button Spinner Component ---
const ButtonSpinner: FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-90"></div>
);
// --- End Internal Spinner ---

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Updated to indicate that adding a folder is an asynchronous operation
  onAdd: (folderName: string) => Promise<void>;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [folderName, setFolderName] = useState("");
  const [isAdding, setIsAdding] = useState(false); // New state for loading

  const handleSubmit = async () => {
    const name = folderName.trim();
    if (!name) return;

    setIsAdding(true); // Start loading

    try {
      // Await the asynchronous folder creation process
      await onAdd(name);
      
      // Reset state and close modal only on success
      setFolderName("");
      onClose();
    } catch (error) {
      console.error("Failed to add folder:", error);
      // In a real app, you would display a user-friendly error here.
    } finally {
      setIsAdding(false); // Stop loading, regardless of success or failure
    }
  };

  if (!isOpen) return null;

  // Function to handle cancellation, resetting folderName for a clean slate
  const handleCancel = () => {
    if (isAdding) return; // Prevent canceling while actively adding
    setFolderName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Folder
          </h2>
          <button
            onClick={handleCancel}
            disabled={isAdding}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
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
            disabled={isAdding} // Disable input while submitting
            onKeyDown={(e) => {
              if (e.key === 'Enter' && folderName.trim() && !isAdding) {
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            disabled={isAdding}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 
              hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            // Disable if folder name is empty OR if currently adding
            disabled={!folderName.trim() || isAdding} 
            className={`px-5 py-2 rounded-lg text-white transition disabled:opacity-50 flex items-center justify-center 
              ${isAdding 
                ? "bg-blue-400 cursor-wait" 
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isAdding ? (
              <>
                <ButtonSpinner />
                <span className="ml-2">Adding...</span>
              </>
            ) : (
              "Add Folder"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
