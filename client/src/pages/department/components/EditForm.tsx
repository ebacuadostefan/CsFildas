import { useEffect, useState, type FC } from "react";

// --- Internal Button Spinner Component ---
const ButtonSpinner: FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-90"></div>
);
// --- End Internal Spinner ---

interface RenameFolderModalProps {
  isOpen: boolean;
  currentFolderName: string;
  currentAlias?: string;
  currentImage?: string;
  // Assuming onRename is an async operation given it uses FormData and needs a spinner
  onRename: (formData: FormData) => Promise<void>; 
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
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  // Effect to reset state when modal opens or primary props change
  useEffect(() => {
    if (isOpen) {
        setFolderName(currentFolderName);
        setAlias(currentAlias || "");
        setPhoto(null);
        setError("");
    }
  }, [currentFolderName, currentAlias, isOpen]);

  // Function to determine if any changes have been made (to enable the save button)
  const isFormDirty = 
    folderName.trim() !== currentFolderName || 
    alias.trim() !== (currentAlias || "") || 
    photo !== null;

  const handleSubmit = async () => {
    setError("");

    if (!folderName.trim()) {
      setError("Department name is required.");
      return;
    }

    if (!isFormDirty) {
        // If nothing changed, just close the modal.
        onClose();
        return;
    }

    setIsSubmitting(true); // Start loading

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", folderName.trim());
    formData.append("alias", alias.trim());

    if (photo) {
      formData.append("image", photo);
    }
    
    try {
        // Wait for the asynchronous rename/update process to complete
        await onRename(formData);
        // Note: We don't call onClose here; the parent component should handle closing
        // the modal when the onRename promise resolves, after data is saved/fetched.
    } catch (err) {
        console.error("Rename/Update failed:", err);
        setError("Failed to save changes. Please try again.");
    } finally {
        setIsSubmitting(false); // Stop loading
    }
  };

  const renderDepartmentImage = () => {
    // Clean up the object URL when photo changes or component unmounts
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
          // Ensure input is disabled during submission
          disabled={isSubmitting} 
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>
    );
  };

  if (!isOpen) return null;

  // Fixed: Modal structure integrated here (backdrop and container)
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
        >
            ✕
        </button>

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
              disabled={isSubmitting} // Disable input while submitting
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
              disabled={isSubmitting} // Disable input while submitting
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting} // Disable cancel while submitting
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            // Disable if submitting, or if the name is invalid, or if nothing has changed.
            disabled={isSubmitting || !folderName.trim() || !isFormDirty} 
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition duration-150 flex items-center justify-center disabled:opacity-50
                ${isSubmitting 
                  ? "bg-blue-400 cursor-wait" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
                }`}
          >
            {isSubmitting ? (
              <>
                <ButtonSpinner />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderModal;
