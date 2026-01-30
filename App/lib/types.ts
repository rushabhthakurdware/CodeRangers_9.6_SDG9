import { ViewStyle } from "react-native";

// The user data structure from your API
export type UserData = {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
};

// The report data structure from your API
export type Report = {
    _id: string;
    title: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address?: string;
    };
    category: "pothole" | "streetlight" | "garbage" | "water" | "other";

    // ✅ FIX: This now perfectly matches your server's JSON response
    media: {
        name: string;
        url: string;
        type: string; // Use 'string' here, as it's raw from the API
    }[];
    createdBy: {
        _id: string;
        email: string;
        name: string;
        role: string;
    };
    status?: "submitted" | "in-progress" | "resolved";
    assignedTo?: any;
    //createdBy: any;
    createdAt: string;
    updatedAt: string;
    createdByName: string;
};
/*server data fetched

[{"__v": 0, "_id": "68d010b02c9ac593f7b5cb6a", "category": "pothole", "createdAt": "2025-09-21T14:50:24.596Z", "createdBy": {"_id": "68bee7bcba030dc0d532298c", "email": "j", "name": "Jayant Citizen", "role": "citizen"}, "createdByName": "Jayant Citizen", "description": "22", "location": {"lat": 21.1756777, "lng": 79.040598}, "media": [[Object]], "status": "submitted", "title": "check 2", "updatedAt": "2025-09-21T14:50:24.596Z"}, 

*/
// The media item structure used in the app
export type MediaItem = {
    uri: string;
    type: "image" | "video" | "audio";
    name: string;
};
// ✅ Represents a formatted report, ready to be displayed in your UI components
export type Post = {
    id: string;          // Mapped from _id
    title: string;
    description: string;
    media: MediaItem[];  //photo urls and wrong:( Assumes API maps 'url' to 'uri')
    createdAt: string;   // From timestamps
    updatedAt: string;   // From timestamps
    createdByName: string;
    // --- Fields added from reportSchema ---
    location: {
        lat: number;
        lng: number;
        address?: string;
    };

    category: "pothole" | "streetlight" | "garbage" | "water" | "other";

    status: "submitted" | "in-progress" | "resolved";

    createdBy: {
        id: string;
        name: string;
        email: string;
        role: string;
    }; // Holds the user's detail

    assignedTo?: string; // Holds the assigned user's ID
};

export type ThemeCycleButtonProps = {
    style?: ViewStyle;
    size?: number;
    color?: string;
};
export interface TranslationStrings {
    welcome: string;
    submitReport: string;
    myReports: string;
    profile: {
        title: string;
        role: string;
        totalReports: string;
    };
}
export interface Location {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    mapUrl: string;
}

export type LocationCoords = { lat: number; lng: number; address?: string };