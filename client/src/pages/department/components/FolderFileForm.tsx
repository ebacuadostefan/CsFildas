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
      <div className="bg-white rounded-2xl p-2 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RenameItemModal;
