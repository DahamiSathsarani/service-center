import { axiosInstance } from "./BaseAPI";

export const createNotification = async (message) => {
    try {
        const response = await axiosInstance.post("/notifications/create", {
            message,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const response = await axiosInstance.get("/api/notifications");
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

export const getUnreadNotificationCount = async () => {
    try {
        const response = await axiosInstance.get("/api/notifications/unread-count");
        return response.data.count;
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await axiosInstance.post(`/api/notifications/mark-as-read/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};