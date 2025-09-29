// src/services/DepartmentServices.ts
import AxiosInstance from "./AxiosInstances";

// Department interface
export interface Department {
  id: number;
  name: string;
  alias?: string;
  slug?: string;
  image?: string;
}

// Folder interface
export interface Folder {
  id: number;
  folderName: string;
  description?: string;
  slug: string;
  departmentId: number;
}

// File interface
export interface FileItem {
  id: number;
  fileName: string;
  filePath: string;
  fileType?: string;
  folder_id: number;
}

const DepartmentServices = {
  // -------------------- DEPARTMENTS --------------------

  // Get all departments
  loadDepartments: async (q?: string): Promise<Department[]> => {
    const response = await AxiosInstance.get("/departments", { params: q ? { q } : {} });
    return response.data;
  },

  // Create new department
  storeDepartment: async (department: FormData): Promise<Department> => {
    const response = await AxiosInstance.post("/departments", department, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update department
  updateDepartment: async (
  id: number, formData: FormData
): Promise<Department> => {
    // 💥 FIX 2: Change the request method from PUT to POST to handle multipart/form-data.
    // The '_method: "PUT"' field in the FormData handles the actual update method on the backend.
    const response = await AxiosInstance.post(`/departments/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
},

  // Delete department
  destroyDepartment: async (id: number): Promise<void> => {
    await AxiosInstance.delete(`/departments/${id}`);
  },

  // -------------------- FOLDERS --------------------

  // Get a folder by slug
  getFolderBySlug: async (slug: string): Promise<Folder> => {
    const response = await AxiosInstance.get(`/folders/slug/${slug}`);
    return response.data;
  },

  // Get folders by department slug
  getFoldersByDepartmentSlug: async (departmentSlug: string, q?: string): Promise<Folder[]> => {
    const response = await AxiosInstance.get(`/departments/${departmentSlug}/folders`, { params: q ? { q } : {} });
    return response.data;
  },

  // Create folder in department
  createFolderInDepartment: async (
    departmentSlug: string,
    folderData: { folderName: string; description?: string }
  ): Promise<Folder> => {
    const response = await AxiosInstance.post(
      `/departments/${departmentSlug}/folders`,
      folderData
    );
    return response.data;
  },

  // Update folder
  updateFolder: async (
    folderId: number,
    folderData: Partial<Folder>
  ): Promise<Folder> => {
    const response = await AxiosInstance.put(`/folders/${folderId}`, folderData);
    return response.data;
  },

  // Delete folder
  deleteFolder: async (folderId: number): Promise<void> => {
    await AxiosInstance.delete(`/folders/${folderId}`);
  },

  // -------------------- FILES --------------------

  // Get files by folder slug
  getFilesBySlug: async (slug: string): Promise<FileItem[]> => {
    const response = await AxiosInstance.get(`/folders/slug/${slug}/files`);
    return response.data;
  },

  // Upload file into folder
  uploadFile: async (slug: string, file: File): Promise<FileItem> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await AxiosInstance.post(
      `/folders/slug/${slug}/files`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // Delete file from folder
  deleteFile: async (slug: string, fileId: number): Promise<void> => {
    await AxiosInstance.delete(`/folders/slug/${slug}/files/${fileId}`);
  },

  // Rename file in folder by slug
  renameFile: async (slug: string, fileId: number, newName: string): Promise<FileItem> => {
    const response = await AxiosInstance.put(`/folders/slug/${slug}/files/${fileId}/edit`, {
      fileName: newName,
    });
    return response.data;
  },
};

export default DepartmentServices;
