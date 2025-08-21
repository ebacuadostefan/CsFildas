import type { RefObject } from "react";
import { FaUpload } from "react-icons/fa";
    

interface SearchUploadBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchUploadBar = ({
  searchTerm,
  onSearchChange,
  onUploadClick,
  fileInputRef,
  onFileChange,
}: SearchUploadBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
      <input
        type="text"
        placeholder="Search uploaded files..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex justify-end">
        <button
          onClick={onUploadClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm sm:text-base"
        >
          <FaUpload className="mr-2" /> Upload
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.png"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
};

export default SearchUploadBar;
