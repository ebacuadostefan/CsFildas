import axios from "axios";

// Updated type to reflect the server response structure for mapping
export type RawActivity = {
    id: number;
    item_name: string; // The name of the file/folder
    type: "folder" | "file";
    status: "added" | "renamed" | "deleted"; // Backend's status field
    department: { name: string } | null;
    created_at: string;
};

// Frontend-facing type for the component
export type Activity = {
    id: number;
    name: string; // Mapped from item_name
    type: "folder" | "file";
    action: "created" | "updated" | "deleted"; // Mapped from status
    department: { name: string } | undefined;
    created_at: string;
};

// Helper to convert backend status to frontend action
const mapStatusToAction = (status: RawActivity["status"]): Activity["action"] => {
    if (status === "added") return "created";
    if (status === "renamed") return "updated";
    return status; // 'deleted' remains 'deleted'
};

export const fetchActivities = async (): Promise<Activity[]> => {
    const res = await axios.get("/api/activities");
    const rawActivities: RawActivity[] = res.data;

    if (!Array.isArray(rawActivities)) throw new Error("Invalid API response");

    // --- MAPPING LOGIC ---
    return rawActivities.map((raw) => ({
        id: raw.id,
        name: raw.item_name, // Map item_name to name
        type: raw.type,
        action: mapStatusToAction(raw.status), // Map status to action
        department: raw.department ?? undefined, // Handle nullable department
        created_at: raw.created_at,
    }));
};
