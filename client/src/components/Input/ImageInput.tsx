import React, { useState, DragEvent } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">
        Department Image
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
          ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400"
          }`}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-600">{image?.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImage(null);
                setPreview(null);
                onImageSelect(null);
              }}
              className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Drag & drop an image here</p>
            <p className="text-sm text-gray-400">or click to browse</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          e.target.files && e.target.files[0] && handleFile(e.target.files[0])
        }
      />
    </div>
  );
};

export default ImageUpload;
