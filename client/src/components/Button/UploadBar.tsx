import React from "react";

interface UploadBarProps {
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadBar: React.FC<UploadBarProps> = ({
  onUploadClick,
  fileInputRef,
  onFileChange,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onUploadClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Upload
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        multiple
      />
    </div>
  );
};

export default UploadBar;
