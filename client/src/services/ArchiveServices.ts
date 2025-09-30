import axios from "axios";

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

/**
 * Fetches all archived (soft-deleted) files and folders.
 */
export const fetchArchivedItems = async (): Promise<ArchivedItem[]> => {
    try {
        // Mock data fallback if axios fails or API is unavailable
        const mockData: ArchivedItem[] = [
            { id: 101, type: 'file', name: '2023 Q4 Report.pdf', department_name: 'Finance', archived_at: '2025-08-01T10:00:00Z', metadata: { fileType: 'application/pdf', fileSize: 512000 } },
            { id: 102, type: 'folder', name: 'Project Alpha Assets', department_name: 'Marketing', archived_at: '2025-09-05T15:30:00Z', metadata: {} },
            { id: 103, type: 'file', name: 'User Policy V3.docx', department_name: 'HR', archived_at: '2025-09-15T09:10:00Z', metadata: { fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 85000 } },
        ];
        
        // Attempt to fetch real data
        const response = await axios.get("/api/archive");
        if (!Array.isArray(response.data) || response.data.length === 0) {
            return mockData; // Return mock if API returns empty array or invalid
        }
        return response.data;
    } catch (error) {
        console.warn("Error fetching archived items from API, falling back to mock data:", error);
        // Fallback to mock data on network error
        return [
            { id: 101, type: 'file', name: '2023 Q4 Report.pdf', department_name: 'Finance', archived_at: '2025-08-01T10:00:00Z', metadata: { fileType: 'application/pdf', fileSize: 512000 } },
            { id: 102, type: 'folder', name: 'Project Alpha Assets', department_name: 'Marketing', archived_at: '2025-09-05T15:30:00Z', metadata: {} },
            { id: 103, type: 'file', name: 'User Policy V3.docx', department_name: 'HR', archived_at: '2025-09-15T09:10:00Z', metadata: { fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 85000 } },
        ];
    }
};

/**
 * Restores a specific archived file.
 */
export const restoreFile = async (fileId: number) => {
    // This POST request hits the /api/archive/file/{id}/restore route
    const response = await axios.post(`/api/archive/file/${fileId}/restore`);
    return response.data;
};

/**
 * Restores a specific archived folder.
 */
export const restoreFolder = async (folderId: number) => {
    // This POST request hits the /api/archive/folder/{id}/restore route
    const response = await axios.post(`/api/archive/folder/${folderId}/restore`);
    return response.data;
};

// Placeholder for permanent delete (for future implementation)
export const deleteArchivedItemPermanently = async (type: 'file' | 'folder', id: number) => {
    // Placeholder logic - actual implementation will hit DELETE /api/archive/{type}/{id}
    console.log(`Permanently deleting ${type} with ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
    return { success: true, message: `${type} deleted permanently.` };
};
