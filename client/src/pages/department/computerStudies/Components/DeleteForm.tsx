import Modal from "../../../../components/Modal";

interface DeleteFolderModalProps {
  isOpen: boolean;
  folderName: string;
  onDelete: () => void;
  onClose: () => void;
}

const DeleteFolderModal = ({
  isOpen,
  folderName,
  onDelete,
  onClose,
}: DeleteFolderModalProps) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Delete Folder</h2>
        <p className="text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">"{folderName}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFolderModal;
