import { useEffect, useState } from "react";
import ComputerStudiesForm from "./AddForm";
import Modal from "../../../../components/Modal";

interface RenameFolderModalProps {
  isOpen: boolean;
  currentFolderName: string;
  onRename: (newName: string) => void;
  onClose: () => void;
}

const RenameFolderModal = ({
  isOpen,
  currentFolderName,
  onRename,
  onClose,
}: RenameFolderModalProps) => {
  const [folderName, setFolderName] = useState(currentFolderName);

  useEffect(() => {
    setFolderName(currentFolderName);
  }, [currentFolderName]);

  const handleSubmit = () => {
    if (folderName.trim() && folderName !== currentFolderName) {
      onRename(folderName.trim());
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <ComputerStudiesForm
        folderName={folderName}
        setFolderName={setFolderName}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default RenameFolderModal;
