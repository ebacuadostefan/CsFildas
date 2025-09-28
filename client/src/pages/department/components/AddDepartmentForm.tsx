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
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB (matches server 5120 KB)
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
    if (file) {
      handleImageSelect(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !alias.trim()) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("alias", alias.trim());
    if (image) formData.append("image", image);

    onSubmit(formData);
    setName("");
    setAlias("");
    setImage(null);
    setPreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <h2 className="text-lg font-semibold text-gray-700">
        Add New Department
      </h2>

      {/* Drag-and-drop image upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mb-2"
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

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Department Name"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="text"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        placeholder="Alias"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddDepartmentForm;
