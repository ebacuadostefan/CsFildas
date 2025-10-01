import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Folder, FileItem } from "../../../services/DepartmentServices";
import DepartmentServices from "../../../services/DepartmentServices";
import FilesTable from "./Files/FileTable";
import Spinner from "../../../components/Spinner/Spinner";
import Headbar from "../../../layout/Boxbar";
import SelectionBar from "../../../layout/SelectionBar";
import DeleteFolderModal from "./Components/DeleteForm";
import RenameItemModal from "../../department/components/FolderFileForm";
import useAuth from "../../../hooks/UseAuth";

const FolderPage = () => {
  const { folderSlug, slug } = useParams<{
    slug: string;
    folderSlug: string;
  }>();
  const navigate = useNavigate();
  const { canAccessDepartmentBySlug, getDepartmentRedirect } = useAuth();
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

  // Access control check
  useEffect(() => {
    if (slug && !canAccessDepartmentBySlug(slug)) {
      navigate(getDepartmentRedirect());
      return;
    }
  }, [slug, canAccessDepartmentBySlug, navigate, getDepartmentRedirect]);

  // Helpers
  const getFileNameOnly = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, ""); // remove extension
  };

  const getFileExtension = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return "Unknown";

    const allowed = ["pdf", "doc", "docx", "png", "jpg", "jpeg"];
    return allowed.includes(ext) ? `.${ext}` : "Unknown";
  };

  // Fetch folder + files
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
          setFiles(filesData);
        })
        .catch((err) => console.error("Error loading folder:", err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(id);
  }, [folderSlug]);

  // File click logic
  const handleFileClick = (file: FileItem) => {
    if (isEditing) {
      handleCheckboxChange(file.id);
      return;
    }

    const fullUrl = `http://localhost:8000${file.filePath}`;
    const extension = getFileExtension(file.fileName);

    if (extension === ".doc" || extension === ".docx") {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        fullUrl
      )}&embedded=true`;
      window.open(viewerUrl, "_blank");
    } else {
      window.open(fullUrl, "_blank");
    }
  };

  // Checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
    );
  };

  // Upload
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !folderSlug) return;

    try {
      const uploadPromises = Array.from(selectedFiles).map((file) =>
        DepartmentServices.uploadFile(folderSlug, file)
      );
      const newFiles = await Promise.all(uploadPromises);
      setFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error("Failed to upload files:", error);
    }
  };

  // Delete
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
      setSelectedFiles([]);
      setIsEditing(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete files:", error);
    }
  };

  // Rename
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
      setIsRenameModalOpen(false);
      setFileToRename(null);
      setSelectedFiles([]);
    } catch (err) {
      console.error("Failed to rename file:", err);
    }
  };

  // Format before passing to FilesTable
  const filteredFiles = files
    .filter((file) =>
      getFileNameOnly(file.fileName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((file) => ({
      ...file,
      displayName: getFileNameOnly(file.fileName),
      displayType: getFileExtension(file.fileName),
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Headbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={handleUploadClick}
      />

      <SelectionBar
        onAdd={handleUploadClick}
        totalItems={filteredFiles.length}
        selectedItems={selectedFiles.length}
        isEditing={isEditing}
        onEdit={() => {
          setIsEditing((prev) => !prev);
          setSelectedFiles([]);
        }}
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

      <div className="mt-10">
        {/* Header bar */}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />

        {/* Action bar */}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-4">
          {filteredFiles.length > 0 ? (
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
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg font-medium">No files found</p>
              <p className="text-sm">Upload files to get started</p>
            </div>
          )}
        </div>

        {/* Delete modal */}
        <DeleteFolderModal
          isOpen={isDeleteModalOpen}
          folderName={files
            .filter((f) => selectedFiles.includes(f.id))
            .map((f) => getFileNameOnly(f.fileName))
            .join(", ")}
          onDelete={confirmDeleteFiles}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedFiles([]);
          }}
        />

        {/* Rename modal */}
        <RenameItemModal
          isOpen={isRenameModalOpen}
          currentName={
            fileToRename ? getFileNameOnly(fileToRename.fileName) : ""
          }
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
