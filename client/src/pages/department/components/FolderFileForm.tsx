import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";

interface RenameItemModalProps {
  isOpen: boolean;
  currentName: string;
  onRename: (newName: string) => void;
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

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSubmit = () => {
    if (name.trim() && name !== currentName) {
      onRename(name.trim());
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      {/* Main content only (no extra container) */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-5"
        autoFocus
      />

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 
            hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || name === currentName}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white 
            hover:bg-blue-700 transition disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default RenameItemModal;
