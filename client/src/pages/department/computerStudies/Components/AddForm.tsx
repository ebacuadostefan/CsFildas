import React from "react";

interface ComputerStudiesFormProps {
  folderName: string;
  setFolderName: (name: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ComputerStudiesForm: React.FC<ComputerStudiesFormProps> = ({
  folderName,
  setFolderName,
  onSubmit,
  onCancel,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <h2 className="text-lg font-semibold text-gray-700">Add New Folder</h2>
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Folder name"
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

export default ComputerStudiesForm;
