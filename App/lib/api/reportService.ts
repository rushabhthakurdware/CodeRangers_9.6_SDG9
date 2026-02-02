import apiClient from './apiClient';
import { Report, MediaItem } from '@/lib/types';

export async function createReport(
    title: string,
    description: string,
    location: { lat: number, lng: number, address?: string } = { lat: 21.1458, lng: 79.0882, address: 'LocationName' },
    category: "pothole" | "streetlight" | "garbage" | "water" | "other" = "other",
    mediaList?: MediaItem[],
    status?: "submitted" | "in-progress" | "resolved",
): Promise<Report | null> {
    try {
        // Map to strict backend input requirements
        const payload = {
            location: {
                lat: location.lat,
                lon: location.lng
            },
            asset: {
                type: category || "road",
                geometry: {
                    area_m2: 1.0 // Default or estimated
                }
            },
            description: description,
            title: title,
            // Additional fields expected by analyze-complete
            severity_override: "moderate"
        };

        const res = await apiClient.post("/analyze-complete", payload);

        console.log("Report submitted successfully:", res.data);

        // Return a mock Report object since the backend returns a different structure
        return {
            _id: res.data.issue_id,
            title: title,
            description: description,
            location: location,
            category: category,
            media: [],
            createdBy: { _id: "user", name: "User", email: "", role: "citizen" },
            createdByName: "User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "submitted"
        };
    } catch (error: any) {
        console.error("Error creating report:", error.response?.data || error.message);
        return null;
    }
}

export async function getReports(category?: string, status?: string): Promise<Report[]> {
    try {
        const res = await apiClient.get("/data");
        console.log("Decision data fetched:", res.data.count);

        // Map 'decision_outputs' to 'Report' type
        const reports: Report[] = res.data.data.map((item: any, index: number) => ({
            _id: item.id?.toString() || index.toString(),
            title: `Priority ${item.priority_level}`,
            description: item.explanation || "No details provided",
            category: "pothole", // Defaulting as category isn't in decision_outputs
            location: {
                lat: 0, // Location not returned in /data endpoint
                lng: 0
            },
            media: [],
            status: item.selected_for_repair ? "in-progress" : "submitted",
            createdAt: item.computed_at || new Date().toISOString(),
            updatedAt: item.computed_at || new Date().toISOString(),
            createdByName: "System",
            createdBy: { _id: "sys", name: "System", email: "", role: "admin" }
        }));

        return reports;
    } catch (error: any) {
        console.error("Error fetching reports:", error.response?.data || error.message);
        return [];
    }
}

/*not workig?? */
export async function getReportById(reportId: string): Promise<Report[]> {
    // Not implemented in new backend
    return [];
}

// ... getMyReports, updateReportStatus, editMyReport functions updated similarly

export async function getMyReports(): Promise<Report[]> {
    // Alias to getReports for now
    return getReports();
}

/**
 * ADMIN: Update a report's status and/or assigned user.
 */
export async function updateReportStatus(reportId: string, status?: string, assignedTo?: string): Promise<Report | null> {
    try {
        const payload: { status?: string; assignedTo?: string } = {};
        if (status) payload.status = status;
        if (assignedTo) payload.assignedTo = assignedTo;

        // ✅ Uses the central apiClient directly
        const res = await apiClient.put(`/reports/${reportId}`, payload);
        return res.data.data;
    } catch (error: any) {
        console.error("Error updating report:", error.response?.data || error.message);
        return null;
    }
}


/**
 * USER: Edit the title and description of their own report.
 */
export async function editMyReport(reportId: string, title: string, description: string): Promise<Report | null> {
    try {
        // ✅ Uses the central apiClient directly
        const res = await apiClient.put(`/reports/my/${reportId}`, { title, description });
        return res.data.data;
    } catch (error: any) {
        console.error("Error editing report:", error.response?.data || error.message);
        return null;
    }
}

export { Report };
