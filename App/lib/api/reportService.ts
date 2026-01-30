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
        const formData = new FormData();

        // Append text fields
        formData.append("title", title);
        formData.append("description", description);
        if (category) {
            formData.append("category", category);
        }

        // Append location as separate fields
        if (location) {
            formData.append("location[lat]", location.lat.toString());
            formData.append("location[lng]", location.lng.toString());
            //address not implimented
        }

        // Append media file if it exists
        if (mediaList && mediaList.length > 0) {
            mediaList.forEach(mediaItem => {
                formData.append('media', {
                    uri: mediaItem.uri, // `uri` is the local file path
                    name: mediaItem.name, // The filename
                    type: mediaItem.type === 'image' ? 'image/jpeg' : 'video/mp4', // The MIME type
                } as any);
            });
        }

        const res = await apiClient.post("/reports", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Report submitted successfully:", res.data.data);
        return res.data.data;
    } catch (error: any) {
        console.error("Error creating report:", error.response?.data || error.message);
        return null;
    }
}

export async function getReports(category?: string, status?: string): Promise<Report[]> {
    try {
        const res = await apiClient.get("/reports", { params: { category, status } });
        console.log("report got", res.data.data[0]);
        return res.data.data;
    } catch (error: any) {
        console.error("Error fetching reports:", error.response?.data || error.message);
        return [];
    }
}
/*not workig?? */
export async function getReportById(reportId: string): Promise<Report[]> {
    try {
        const res = await apiClient.get(`/reports/${reportId}`);
        return res.data.data;
    } catch (error: any) {
        console.error(`Error fetching report with ID ${reportId}:`, error.response?.data || error.message);
        throw new Error("Failed to fetch the specified report.");
        return [];
    }
}

// ... getMyReports, updateReportStatus, editMyReport functions updated similarly

export async function getMyReports(): Promise<Report[]> {
    try {
        // ✅ Uses the central apiClient directly
        const res = await apiClient.get("/reports/my");
        // console.log("report got my", res.data.data[0]);
        return res.data.data;
    } catch (error: any) {
        console.error("Error fetching my reports:", error.response?.data || error.message);
        return [];
    }
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
