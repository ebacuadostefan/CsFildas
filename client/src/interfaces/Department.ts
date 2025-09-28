// Department entity
export interface Department {
  id: number;
  name: string;
  alias?: string;
  image?: string | File;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

// Folder entity
export interface Folder {
  id: number;
  folderName: string;
  department_id?: number;
  created_at?: string;
  updated_at?: string;
}

// File entity
export interface FileItem {
  id: number;
  fileName: string;
  filePath: string;  
  fileType?: string;  
  created_at?: string;
  updated_at?: string;
}
