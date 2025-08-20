import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaPlus, FaChevronRight, FaHome } from "react-icons/fa";
import BackButton from "../../../components/Button/BackButton";

const initialFolders = [
  "Program Outcomes",
  "Curriculum",
  "Faculty",
  "QA Files",
  "Research",
  "Community Extension",
  "Instructional Materials",
  "Self-Survey Reports",
  "Documentation",
];

const ComputerStudiesMainPage = () => {
  const [folders, setFolders] = useState(initialFolders);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [rightClickedFolder, setRightClickedFolder] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  // Add folder
  const handleAddFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      setFolders([...folders, folderName]);
    }
    setShowContextMenu(false);
  };

  // Delete folder
  const handleDeleteFolder = () => {
    if (rightClickedFolder) {
      const confirmDelete = confirm(
        `Are you sure you want to delete "${rightClickedFolder}"?`
      );
      if (confirmDelete) {
        setFolders(folders.filter((folder) => folder !== rightClickedFolder));
      }
    }
    setShowContextMenu(false);
  };

  // Right-click
  const handleFolderRightClick = (e: React.MouseEvent, folderName: string) => {
    e.preventDefault();
    setRightClickedFolder(folderName);
    setShowContextMenu(true);
  };

  // Close context menu
  useEffect(() => {
    const handleClick = () => setShowContextMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const filteredFolders = folders.filter((folder) =>
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle folder click for navigation
 const handleFolderClick = (folderName: string) => {
   setShowContextMenu(false);
   if (folderName === "Program Outcomes") {
     navigate("/departments/computer-studies/program-outcomes");
   } else if (folderName === "Curriculum") {
     navigate("/departments/computer-studies/curriculum"); // <-- Added this line
   } else {
     alert(`Page for "${folderName}" is not yet available.`);
   }
 };


  return (
    <div className="p-15 max-w-7xl mx-auto relative">
      {/* 🔷 Breadcrumbs + Back Button */}
      <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
        <BackButton />

        <div className="flex items-center space-x-2">
          <FaHome
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
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

      {/* 🔍 Search + Add Folder */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddFolder}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Folder
        </button>
      </div>

      {/* 📁 Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder, index) => (
            <div
              key={index}
              onContextMenu={(e) => handleFolderRightClick(e, folder)}
              onClick={() => handleFolderClick(folder)}
              className="bg-gray-100 rounded-md p-4 flex items-center space-x-4 hover:bg-gray-200 transition cursor-pointer"
            >
              <FaFolder className="text-yellow-500 text-2xl" />
              <span className="text-gray-800 font-medium truncate">
                {folder}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No folders found.
          </p>
        )}
      </div>

      {/* 🗑️ Context Menu */}
      {showContextMenu && rightClickedFolder && (
        <ul
          className="fixed bottom-6 right-6 bg-white border border-gray-300 shadow-lg rounded-md z-50"
          style={{ minWidth: "220px" }}
        >
          <li
            className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
            onClick={handleDeleteFolder}
          >
            🗑️ Delete "{rightClickedFolder}"
          </li>
        </ul>
      )}
    </div>
  );
};

export default ComputerStudiesMainPage;
