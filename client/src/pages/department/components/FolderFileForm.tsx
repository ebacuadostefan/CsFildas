import { useEffect, useState, type FC } from "react";

// --- Internal Button Spinner Component ---
const ButtonSpinner: FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-90"></div>
);
// --- End Internal Spinner ---

interface RenameItemModalProps {
  isOpen: boolean;
  currentName: string;
  // Updated signature to handle asynchronous operation
  onRename: (newName: string) => Promise<void>; 
  onClose: () => void;
  title?: string;
}

const RenameItemModal = ({
  isOpen,
  currentName,
  onRename,
  onClose,
  title = "Rename",
}: RenameItemModalProps) => {
  const [name, setName] = useState(currentName);
  const [isRenaming, setIsRenaming] = useState(false); // State for loading/submission

  useEffect(() => {
    // Reset name when modal opens or currentName changes
    setName(currentName);
  }, [currentName]);

  const handleSubmit = async () => {
    const newName = name.trim();

    // Check if the name is valid and actually changed
    if (!newName || newName === currentName) {
      onClose(); 
      return;
    }

    setIsRenaming(true); // Start loading

    try {
      // Await the asynchronous rename process
      await onRename(newName);
      // Close modal upon successful renaming
      onClose(); 
    } catch (error) {
      console.error("Failed to rename item:", error);
      // In a real application, you might add a state here to display an error message
    } finally {
      setIsRenaming(false); // Stop loading, regardless of outcome
    }
  };

  // If the modal is not open, return null to hide it completely
  if (!isOpen) return null;

  return (
    // Fixed: Modal structure integrated here (backdrop and container)
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-fadeIn">
        
        {/* Header and Close Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            disabled={isRenaming}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            {/* SVG Cross Icon (using "✕" for simplicity) */}
            ✕
          </button>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-5"
          autoFocus
          disabled={isRenaming} // Disable input while renaming
          onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim() && name !== currentName && !isRenaming) {
                  handleSubmit();
              }
          }}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isRenaming} // Disable cancel button while renaming
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 
              hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            // Disable if name is empty, unchanged, OR currently renaming
            disabled={!name.trim() || name === currentName || isRenaming} 
            className={`px-5 py-2 rounded-lg text-white transition disabled:opacity-50 flex items-center justify-center 
                ${isRenaming 
                  ? "bg-blue-400 cursor-wait" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
                }`}
          >
            {isRenaming ? (
              <>
                <ButtonSpinner />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameItemModal;
