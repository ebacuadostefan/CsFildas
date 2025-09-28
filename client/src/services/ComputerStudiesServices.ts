// src/services/ComputerStudiesServices.ts
import AxiosInstance from "./AxiosInstances";

// ---------------- FOLDER INTERFACE ----------------
export interface Folder {
  id: number;
  folderName: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// ---------------- FILE INTERFACE ----------------
export interface FileItem {
  id: number;
  folder_id: number;
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
  created_at?: string;
  updated_at?: string;
}

const ComputerStudiesServices = {
  // ---------- FOLDER SERVICES ----------
  // GET all folders
  loadFolders: async (): Promise<Folder[]> => {
    try {
      const response = await AxiosInstance.get<Folder[]>("/folders");
      return response.data;
    } catch (error) {
      console.error("Error loading folders:", error);
      throw error;
    }
  },

  // POST new folder
  storeFolder: async (data: { folderName: string; description?: string }): Promise<Folder> => {
    try {
      const response = await AxiosInstance.post<Folder>("/folders", data);
      return response.data;
    } catch (error) {
      console.error("Error storing folder:", error);
      throw error;
    }
  },

  // GET single folder
  getFolder: async (id: number | string): Promise<Folder> => {
    try {
      const response = await AxiosInstance.get<Folder>(`/folders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting folder:", error);
      throw error;
    }
  },

  // PUT update folder
  updateFolder: async (
    id: number | string,
    data: { folderName: string; description?: string }
  ): Promise<Folder> => {
    try {
      const response = await AxiosInstance.put<Folder>(`/folders/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating folder:", error);
      throw error;
    }
  },

  // DELETE folder
  destroyFolder: async (id: number | string): Promise<{ message: string }> => {
    try {
      const response = await AxiosInstance.delete<{ message: string }>(`/folders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  },

  // ---------- FILE SERVICES ----------
  // GET all files in a folder
  getFiles: async (folderId: number | string): Promise<FileItem[]> => {
    try {
      const response = await AxiosInstance.get<FileItem[]>(`/folders/${folderId}/files`);
      return response.data;
    } catch (error) {
      console.error("Error loading files:", error);
      throw error;
    }
  },

  // POST upload a new file
  uploadFile: async (folderId: number | string, file: File): Promise<FileItem> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await AxiosInstance.post<FileItem>(
        `/folders/${folderId}/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // DELETE file
  deleteFile: async (fileId: number | string): Promise<{ message: string }> => {
    try {
      const response = await AxiosInstance.delete<{ message: string }>(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
};

export default ComputerStudiesServices;
