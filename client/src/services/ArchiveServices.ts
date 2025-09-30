import AxiosInstance from "./AxiosInstances";

export type ArchivedItem = {
    id: number;
    type: 'file' | 'folder';
    name: string;
    department_name: string;
    archived_at: string;
    metadata: {
        original_folder_id?: number;
        original_department_id?: number;
        fileType?: string;
        fileSize?: number;
    }
};

// Fetch all archived (soft-deleted) files and folders from backend only
export const fetchArchivedItems = async (): Promise<ArchivedItem[]> => {
    const response = await AxiosInstance.get<ArchivedItem[]>("/archive");
    if (!Array.isArray(response.data)) {
        throw new Error("Invalid archive API response");
    }
    return response.data;
};

/**
 * Restores a specific archived file.
 */
export const restoreFile = async (fileId: number) => {
    const response = await AxiosInstance.post(`/archive/file/${fileId}/restore`);
    return response.data;
};

/**
 * Restores a specific archived folder.
 */
export const restoreFolder = async (folderId: number) => {
    const response = await AxiosInstance.post(`/archive/folder/${folderId}/restore`);
    return response.data;
};

/**
 * Permanently deletes a file or folder.
 */
export const deleteArchivedItemPermanently = async (type: 'file' | 'folder', id: number) => {
    // Not implemented on backend yet; no-op to keep UI stable
    return { success: false, message: 'Permanent delete not implemented' } as const;
};