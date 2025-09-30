// src/services/DepartmentServices.ts
import AxiosInstance from "./AxiosInstances";

// -------------------- INTERFACES --------------------
export interface Department {
  id: number;
  name: string;
  alias?: string;
  slug?: string;
  image?: string;
}

export interface Folder {
  id: number;
  folderName: string;
  description?: string;
  slug: string;
  departmentId: number;
}

export interface FileItem {
  id: number;
  fileName: string;
  filePath: string;
  fileType?: string;
  folder_id: number;
}

// -------------------- SERVICES --------------------
const DepartmentServices = {
  // -------------------- DEPARTMENTS --------------------
  loadDepartments: async (q?: string): Promise<Department[]> => {
    const response = await AxiosInstance.get("/departments", {
      params: q ? { q } : {},
    });
    return response.data;
  },

  storeDepartment: async (department: FormData): Promise<Department> => {
    const response = await AxiosInstance.post("/departments", department, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateDepartment: async (
    id: number,
    formData: FormData
  ): Promise<Department> => {
    const response = await AxiosInstance.post(`/departments/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  destroyDepartment: async (id: number): Promise<void> => {
    await AxiosInstance.delete(`/departments/${id}`);
  },

  // -------------------- FOLDERS --------------------
  // DepartmentServices.ts
  getFolderBySlug: async (slug: string): Promise<Folder> => {
    const response = await AxiosInstance.get(`/folders/slug/${slug}`);
    return response.data;
  },

  getFoldersByDepartmentSlug: async (
    departmentSlug: string,
    q?: string
  ): Promise<Folder[]> => {
    const response = await AxiosInstance.get(
      `/departments/${departmentSlug}/folders`,
      { params: q ? { q } : {} }
    );
    return response.data;
  },

  createFolderInDepartment: async (
    departmentSlug: string,
    folderData: { folderName: string; description?: string }
  ): Promise<Folder> => {
    const response = await AxiosInstance.post(
      `/departments/${departmentSlug}/folders`,
      folderData
    );
    const created: Folder = response.data;

    // Fire a live activity event so Activity page updates immediately
    try {
      const activity = {
        id: Date.now(),
        name: created.folderName,
        type: 'folder' as const,
        action: 'created' as const,
        department: undefined,
        created_at: new Date().toISOString(),
      };
      window.dispatchEvent(new CustomEvent('app-activity', { detail: activity }));
    } catch {
      // no-op
    }

    return created;
  },

  updateFolder: async (
    folderId: number,
    folderData: Partial<Folder>
  ): Promise<Folder> => {
    const response = await AxiosInstance.put(
      `/folders/${folderId}`,
      folderData
    );
    return response.data;
  },

  deleteFolder: async (folderId: number): Promise<void> => {
    await AxiosInstance.delete(`/folders/${folderId}`);
  },

  // -------------------- FILES --------------------
  getFilesBySlug: async (slug: string): Promise<FileItem[]> => {
    const response = await AxiosInstance.get(`/folders/${slug}/files`);
    return response.data;
  },

  uploadFile: async (slug: string, file: File): Promise<FileItem> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await AxiosInstance.post(
      `/folders/${slug}/files`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  deleteFile: async (slug: string, fileId: number): Promise<void> => {
    await AxiosInstance.delete(`/folders/${slug}/files/${fileId}`);
  },

  renameFile: async (
    slug: string,
    fileId: number,
    newName: string
  ): Promise<FileItem> => {
    const response = await AxiosInstance.put(
      `/folders/${slug}/files/${fileId}`,
      { fileName: newName }
    );
    return response.data;
  },
};

export default DepartmentServices;
