import React, { useState } from "react";

interface AddDepartmentFormProps {
  onSubmit: (name: string, alias: string) => void;
  onCancel: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && alias.trim()) {
      onSubmit(name.trim(), alias.trim());
      setName("");
      setAlias("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <h2 className="text-lg font-semibold text-gray-700">Add New Department</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Department Name"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
        onFocus={(e) => e.target.select()}
      />

      <input
        type="text"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        placeholder="Alias"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
        onFocus={(e) => e.target.select()}
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
