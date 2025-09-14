import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  Folder,
  FileItem,
} from "../../../../services/ComputerStudiesServices";
import ComputerStudiesServices from "../../../../services/ComputerStudiesServices";
import SearchUploadBar from "./Components/SearchBar";
import Breadcrumbs from "./Components/BreadCrumps";
import FilesTable from "./Files/FileTable";
import DeleteFolderModal from "../Components/DeleteForm";

const FolderPage = () => {
  const { id } = useParams<{ id: string }>();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // fetch data
  useEffect(() => {
    if (!id) return;
    ComputerStudiesServices.getFolder(id).then(setFolder).catch(console.error);
    ComputerStudiesServices.getFiles(id).then(setFiles).catch(console.error);
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !id) return;
    try {
      for (const file of Array.from(selectedFiles)) {
        await ComputerStudiesServices.uploadFile(id, file);
      }
      const updatedFiles = await ComputerStudiesServices.getFiles(id);
      setFiles(updatedFiles);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

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

  return (
    <div className="p-15 max-w-7xl ml-3 mx-auto relative">
      <Breadcrumbs folderName={folder?.folderName} />

      <SearchUploadBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onUploadClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        onFileChange={handleFileChange}
      />

      <FilesTable
        files={filteredFiles}
        onFileClick={handleFileClick}
        onDeleteClick={(file) => {
          setSelectedFile(file);
          setIsDeleteModalOpen(true);
        }}
      />

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        folderName={selectedFile?.fileName || ""}
        onDelete={async () => {
          if (!selectedFile) return;
          try {
            await ComputerStudiesServices.deleteFile(selectedFile.id);
            setFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFile(null);
        }}
      />
    </div>
  );
};

export default FolderPage;
