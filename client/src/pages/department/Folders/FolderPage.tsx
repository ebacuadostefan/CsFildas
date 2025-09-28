import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import type { Folder, FileItem } from "../../../services/DepartmentServices";
import DepartmentServices from "../../../services/DepartmentServices";
import FilesTable from "./Files/FileTable";

import Spinner from "../../../components/Spinner/Spinner";
import Headbar from "../../../layout/Boxbar";
import SelectionBar from "../../../layout/SelectionBar";
import DeleteFolderModal from "./Components/DeleteForm";
import RenameItemModal from "../../department/components/FolderFileForm";

// New shortcut component

const FolderPage = () => {
  const { folderSlug } = useParams<{ slug: string; folderSlug: string }>();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Fetch folder and files
  useEffect(() => {
    if (!folderSlug) return;

    const id = setTimeout(() => {
      setLoading(true);
      Promise.all([
        DepartmentServices.getFolderBySlug(folderSlug),
        DepartmentServices.getFilesBySlug(folderSlug),
      ])
        .then(([folderData, filesData]) => {
          setFolder(folderData);
          setFiles(
            searchTerm
              ? filesData.filter((f) =>
                  f.fileName.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : filesData
          );
        })
        .catch((err) => console.error("Error loading folder:", err))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(id);
  }, [folderSlug, searchTerm]);

  const handleFileClick = (file: FileItem) => {
    if (isEditing) {
      handleCheckboxChange(file.id);
    } else {
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
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !folderSlug) return;

    try {
      const uploadPromises = Array.from(selectedFiles).map((file) =>
        DepartmentServices.uploadFile(folderSlug, file)
      );
      const newFiles = await Promise.all(uploadPromises);
      setFiles((prev) => [...prev, ...newFiles]);
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Uploaded ${newFiles.length} file(s)`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "created",
          },
        })
      );
    } catch (error) {
      console.error("Failed to upload files:", error);
    }
  };

  const handleDeleteFiles = () => {
    if (selectedFiles.length > 0) setIsDeleteModalOpen(true);
  };

  const confirmDeleteFiles = async () => {
    if (!folderSlug) return;
    try {
      await Promise.all(
        selectedFiles.map((id) => DepartmentServices.deleteFile(folderSlug, id))
      );
      setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)));
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `Deleted ${selectedFiles.length} file(s)`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "deleted",
          },
        })
      );
      setSelectedFiles([]);
      setIsEditing(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete files:", error);
    }
  };

  const handleRenameFile = () => {
    if (selectedFiles.length === 1) {
      const file = files.find((f) => f.id === selectedFiles[0]);
      if (file) {
        setFileToRename(file);
        setIsRenameModalOpen(true);
      }
    }
  };

  const confirmRenameFile = async (newName: string) => {
    if (!fileToRename || !newName.trim() || !folderSlug) return;
    try {
      const updated = await DepartmentServices.renameFile(
        folderSlug,
        fileToRename.id,
        newName.trim()
      );
      setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      const now = new Date();
      window.dispatchEvent(
        new CustomEvent("app-activity", {
          detail: {
            id: Date.now(),
            name: `File renamed to "${updated.fileName}"`,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            status: "updated",
          },
        })
      );
      setIsRenameModalOpen(false);
      setFileToRename(null);
    } catch (err) {
      console.error("Failed to rename file:", err);
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
      {/* Headbar with Upload button */}
      <Headbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={handleUploadClick}
      />

      {/* Hidden file input for uploads (triggered by Add/Upload button) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      <SelectionBar
        onAdd={handleUploadClick}
        totalItems={filteredFiles.length}
        selectedItems={selectedFiles.length}
        isEditing={isEditing}
        onEdit={() => setIsEditing((prev) => !prev)}
        onSelectAll={(selectAll: boolean) => {
          if (!isEditing) return;
          setSelectedFiles(selectAll ? filteredFiles.map((f) => f.id) : []);
        }}
        onDelete={handleDeleteFiles}
        onRename={handleRenameFile}
        addLabel="Upload"
        deleteLabel="Delete"
        renameLabel="Rename"
      />

      {/* Main Content Area */}
      <div className="mt-10 w-full relative">
        {/* Upload Bar Shortcut */}

        {/* Files Table */}
        <FilesTable
          files={filteredFiles}
          onFileClick={handleFileClick}
          onDeleteClick={(file) => {
            setSelectedFiles([file.id]);
            setIsDeleteModalOpen(true);
          }}
          selectedFiles={selectedFiles}
          isEditing={isEditing}
          onCheckboxChange={handleCheckboxChange}
        />

        {/* Delete Modal */}
        <DeleteFolderModal
          isOpen={isDeleteModalOpen}
          folderName={files
            .filter((f) => selectedFiles.includes(f.id))
            .map((f) => f.fileName)
            .join(", ")}
          onDelete={confirmDeleteFiles}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedFiles([]);
          }}
        />

        <RenameItemModal
          isOpen={isRenameModalOpen}
          currentName={fileToRename?.fileName || ""}
          onRename={confirmRenameFile}
          onClose={() => {
            setIsRenameModalOpen(false);
            setFileToRename(null);
          }}
          title="Rename File"
        />
      </div>
    </>
  );
};

export default FolderPage;
