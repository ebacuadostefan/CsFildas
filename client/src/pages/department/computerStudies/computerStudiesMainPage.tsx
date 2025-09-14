import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ComputerStudiesServices from "../../../services/ComputerStudiesServices";
import CssTableForm from "./Components/CssTableForm";

interface Folder {
  id: number;
  folderName: string;
  description?: string;
}

const ComputerStudiesMainPage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rightClickedFolder, setRightClickedFolder] = useState<Folder | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  // 🔹 Load folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const data = await ComputerStudiesServices.loadFolders();
        setFolders(data);
      } catch (error) {
        console.error("Failed to load folders:", error);
      }
    };
    fetchFolders();
  }, []);

  // 🔹 Add folder
  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const newFolder = await ComputerStudiesServices.storeFolder({
          folderName: newFolderName.trim(),
        });
        setFolders((prev) => [...prev, newFolder]);
      } catch (error) {
        console.error("Failed to add folder:", error);
      }
    }
    setNewFolderName("");
    setIsAddModalOpen(false);
  };

  // 🔹 Delete folder
  const handleDeleteFolder = async () => {
    if (rightClickedFolder) {
      try {
        await ComputerStudiesServices.destroyFolder(rightClickedFolder.id);
        setFolders((prev) => prev.filter((f) => f.id !== rightClickedFolder.id));
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
    }
    setIsDeleteModalOpen(false);
  };

  // 🔹 Rename folder
  const handleRenameFolder = async (newName: string) => {
    if (rightClickedFolder) {
      try {
        const updated = await ComputerStudiesServices.updateFolder(rightClickedFolder.id, {
          folderName: newName,
        });
        setFolders((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      } catch (error) {
        console.error("Failed to rename folder:", error);
      }
    }
    setIsRenameModalOpen(false);
  };

  return (
    <CssTableForm
      folders={folders}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      rightClickedFolder={rightClickedFolder}
      setRightClickedFolder={setRightClickedFolder}
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
      newFolderName={newFolderName}
      setNewFolderName={setNewFolderName}
      isRenameModalOpen={isRenameModalOpen}
      setIsRenameModalOpen={setIsRenameModalOpen}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      handleAddFolder={handleAddFolder}
      handleDeleteFolder={handleDeleteFolder}
      handleRenameFolder={handleRenameFolder}
      navigate={navigate}
    />
  );
};

export default ComputerStudiesMainPage;
