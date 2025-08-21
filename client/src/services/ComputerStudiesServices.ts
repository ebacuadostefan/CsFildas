// src/services/ComputerStudiesServices.ts
import AxiosInstance from "./AxiosInstances";

// Define folder interface
export interface Folder {
  id: number;
  folderName: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const ComputerStudiesServices = {
  // GET all folders
  loadFolders: async (): Promise<Folder[]> => {
    try {
      const response = await AxiosInstance.get<Folder[]>("/csfolders");
      return response.data;
    } catch (error) {
      console.error("Error loading folders:", error);
      throw error;
    }
  },

  // POST new folder
  storeFolder: async (data: { folderName: string; description?: string }): Promise<Folder> => {
    try {
      const response = await AxiosInstance.post<Folder>("/csfolders", data);
      return response.data;
    } catch (error) {
      console.error("Error storing folder:", error);
      throw error;
    }
  },

  // GET single folder
  getFolder: async (id: number | string): Promise<Folder> => {
    try {
      const response = await AxiosInstance.get<Folder>(`/csfolders/${id}`);
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
      const response = await AxiosInstance.put<Folder>(`/csfolders/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating folder:", error);
      throw error;
    }
  },

  // DELETE folder
  destroyFolder: async (id: number | string): Promise<{ message: string }> => {
    try {
      const response = await AxiosInstance.delete<{ message: string }>(`/csfolders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  },
};

export default ComputerStudiesServices;
