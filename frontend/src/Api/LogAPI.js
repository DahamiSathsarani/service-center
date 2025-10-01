import { axiosInstance } from "./BaseAPI";

export async function all_logs() {
  try {
    return await axiosInstance.get("api/logs/getall");
  } catch (error) {
    console.error("Logs View Error:", error.response?.data || error);
    throw error;
  }
}

export async function delete_log(logId) {
  try {
    return await axiosInstance.delete(`api/logs/delete/${logId}`);
  } catch (error) {
    console.error("Delete Log Error:", error.response?.data || error);
    throw error;
  }
}