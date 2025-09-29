import React, { useState, useRef, useCallback } from "react";

interface AddDepartmentFormProps {
  onSubmit: (formData: FormData) => void;
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = (file: File) => {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_SIZE_BYTES) {
      alert("Image is larger than 5MB. Please choose a smaller file.");
      return;
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !alias.trim()) return;
    if (!image) {
      alert("Image is required (max 5MB, jpg/jpeg/png/svg).");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("alias", alias.trim());
    formData.append("image", image);

    onSubmit(formData);
    setName("");
    setAlias("");
    setImage(null);
    setPreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Add Department
        </h2>
        <p className="text-gray-500 text-sm">
          Create a new department and upload its logo.
        </p>
      </div>

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
            <div className="text-gray-400 text-sm mb-1">📁 Drop image here</div>
            <div className="text-sm text-gray-600">or click to browse</div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
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
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
            hover:bg-gray-200 transition duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
            hover:bg-blue-700 transition duration-150"
        >
          Add Department
        </button>
      </div>
    </form>
  );
};

export default AddDepartmentForm;
