import { FaFolder, FaPlus, FaChevronRight, FaHome } from "react-icons/fa";
import BackButton from "../../../../components/Button/BackButton";
import Modal from "../../../../components/Modal";
import ComputerStudiesForm from "../Components/AddForm";
import RenameFolderModal from "../Components/EditForm";
import DeleteFolderModal from "../Components/DeleteForm";

interface Folder {
  id: number;
  folderName: string;
  description?: string;
}

interface Props {
  folders: Folder[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  rightClickedFolder: Folder | null;
  setRightClickedFolder: (folder: Folder | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (value: boolean) => void;
  newFolderName: string;
  setNewFolderName: (value: string) => void;
  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (value: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
  handleAddFolder: () => void;
  handleDeleteFolder: () => void;
  handleRenameFolder: (newName: string) => void;
  navigate: (path: string) => void;
}

const CssTableForm: React.FC<Props> = ({
  folders,
  searchTerm,
  setSearchTerm,
  rightClickedFolder,
  setRightClickedFolder,
  isAddModalOpen,
  setIsAddModalOpen,
  newFolderName,
  setNewFolderName,
  isRenameModalOpen,
  setIsRenameModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleAddFolder,
  handleDeleteFolder,
  handleRenameFolder,
  navigate,
}) => {
  // 🔹 Filter folders
  const filteredFolders = folders.filter((f) =>
    f.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-15 max-w-7xl ml-3 mx-auto relative">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
        <BackButton />
        <div className="flex items-center space-x-2">
          <FaHome
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <FaChevronRight className="text-gray-400" />
          <span
            className="text-blue-500 font-medium cursor-pointer"
            onClick={() => navigate("/departments")}
          >
            Departments
          </span>
          <FaChevronRight className="text-gray-400" />
          <span className="text-blue-700 font-semibold">Computer Studies</span>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => (
            <div
              key={folder.id}
              onContextMenu={(e) => {
                e.preventDefault();
                setRightClickedFolder(folder);
              }}
              onClick={() =>
                navigate(`/departments/computerstudies/folder/${folder.id}`)
              }
              className="bg-gray-100 rounded-md p-4 flex items-center space-x-4 hover:bg-gray-200 transition cursor-pointer"
            >
              <FaFolder className="text-yellow-500 text-2xl" />
              <span className="text-gray-800 font-medium truncate">
                {folder.folderName}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No folders found.</p>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} showCloseButton>
        <ComputerStudiesForm
          folderName={newFolderName}
          setFolderName={setNewFolderName}
          onSubmit={handleAddFolder}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Rename Modal */}
      <RenameFolderModal
        isOpen={isRenameModalOpen}
        currentFolderName={rightClickedFolder?.folderName || ""}
        onRename={handleRenameFolder}
        onClose={() => setIsRenameModalOpen(false)}
      />

      {/* Delete Modal */}
      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        folderName={rightClickedFolder?.folderName || ""}
        onDelete={handleDeleteFolder}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default CssTableForm;
