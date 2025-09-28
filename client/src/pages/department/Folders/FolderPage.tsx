import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Folder, FileItem } from "../../../services/DepartmentServices";
import DepartmentServices from "../../../services/DepartmentServices";
import FilesTable from "./Files/FileTable";

import Spinner from "../../../components/Spinner/Spinner";
import Headbar from "../../../layout/Boxbar";
import SelectionBar from "../../../layout/SelectionBar";
import DeleteFolderModal from "./Components/DeleteForm";
// New shortcut component

const FolderPage = () => {
  const { folderSlug } = useParams<{ slug: string; folderSlug: string }>();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Fetch folder and files
  useEffect(() => {
    if (!folderSlug) return;

    setLoading(true);
    Promise.all([
      DepartmentServices.getFolderBySlug(folderSlug),
      DepartmentServices.getFilesBySlug(folderSlug),
    ])
      .then(([folderData, filesData]) => {
        setFolder(folderData);
        setFiles(filesData);
      })
      .catch((err) => console.error("Error loading folder:", err))
      .finally(() => setLoading(false));
  }, [folderSlug]);

  const handleFileClick = (file: FileItem) => {
    const fullUrl = `http://localhost:8000${file.filePath}`;
    if (file.fileType?.includes("pdf") || file.fileType?.includes("image")) {
      window.open(fullUrl, "_blank");
    } else if (
      file.fileType?.includes("doc") ||
      file.fileType?.includes("docx")
    ) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        fullUrl
      )}&embedded=true`;
      window.open(viewerUrl, "_blank");
    } else {
      window.open(fullUrl, "_blank");
    }
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Headbar with New button */}
      <Headbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsAddModalOpen(true)}
      />
      <SelectionBar
        onAdd={() => setIsAddModalOpen(true)}
        onSelectAll={() => console.log("Select all clicked")}
      />

      <div className="p-15 max-w-7xl ml-3 mx-auto relative space-y-4">
        {/* Upload Bar Shortcut */}

        {/* Files Table */}
        <FilesTable
          files={filteredFiles}
          onFileClick={handleFileClick}
          onDeleteClick={(file) => {
            setSelectedFile(file);
            setIsDeleteModalOpen(true);
          }}
        />

        {/* Delete Modal */}
        <DeleteFolderModal
          isOpen={isDeleteModalOpen}
          folderName={selectedFile?.fileName || ""}
          onDelete={async () => {
            if (!selectedFile || !folderSlug) return;
            try {
              await DepartmentServices.deleteFile(folderSlug, selectedFile.id);
              setFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));
            } catch (err) {
              console.error("Error deleting file:", err);
            }
          }}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedFile(null);
          }}
        />
      </div>
    </>
  );
};

export default FolderPage;
