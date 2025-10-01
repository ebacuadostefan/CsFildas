import React, { type FC, useState, useRef, useCallback } from "react";

// --- Internal Button Spinner Component ---
// Using the design concept from your previous request, but adjusted for button context (small, white border).
const ButtonSpinner: FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-90"></div>
);
// --- End Internal Spinner ---

interface AddDepartmentFormProps {
  // Note: We implicitly assume onSubmit is an async function that returns a Promise 
  // so we can correctly manage the loading state (e.g., an API call).
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New state to manage loading/submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = (file: File) => {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (jpg, jpeg, png, svg).");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be less than 5MB.");
      return;
    }
    setError(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  // Convert handleSubmit to async to correctly handle the submission lifecycle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !alias.trim()) {
      setError("Department name and alias are required.");
      return;
    }
    if (!image) {
      setError("Please upload an image (max 5MB).");
      return;
    }

    setIsSubmitting(true); // START loading indicator

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("alias", alias.trim());
    formData.append("image", image);

    try {
      // Await the parent's onSubmit function (which should contain the API call)
      await onSubmit(formData);

      // Reset form state only upon successful submission
      setName("");
      setAlias("");
      setImage(null);
      setPreview(null);
      setError(null);
      
    } catch (err) {
      // The parent component should ideally handle specific error display, 
      // but we set a fallback error message here.
      console.error("Department submission failed:", err);
      setError("Failed to add department. Please check your network and try again.");
    } finally {
      setIsSubmitting(false); // STOP loading indicator
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-2xl max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Add Department</h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details and upload the department logo.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-28 h-28 object-cover rounded-full mb-2 border-4 border-gray-200 shadow-sm"
          />
        ) : (
          <>
            {/* Using Lucide icon SVG for a modern look */}
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="36" 
                height="36" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-400 mb-2"
            >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 13a2 2 0 0 0 0 4"></path>
                <path d="M12 15h4"></path>
            </svg>
            <div className="text-gray-500 text-sm mb-1 font-semibold">Drop image here</div>
            <div className="text-xs text-gray-600">or click to browse (Max 5MB)</div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isSubmitting} // Disable file input during submission
        />
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Human Resources"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
            disabled={isSubmitting} // Disable during submission
          />
        </div>

        <div>
          <label
            htmlFor="alias"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alias / Short Name <span className="text-red-500">*</span>
          </label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="e.g., HR"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
            disabled={isSubmitting} // Disable during submission
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting} // Disable cancel button during submission
          className={`px-5 py-2 text-sm font-medium rounded-lg transition duration-150 ${
            isSubmitting
              ? "text-gray-400 bg-gray-200 cursor-not-allowed"
              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting} // Disable submit button during submission
          className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition duration-150 flex items-center justify-center ${
            isSubmitting
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <>
              <ButtonSpinner />
              <span className="ml-2">Adding...</span>
            </>
          ) : (
            "Add Department"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddDepartmentForm;
