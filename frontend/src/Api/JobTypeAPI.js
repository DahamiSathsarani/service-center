import { axiosInstance } from "./BaseAPI";


export async function getAllJobTypes() {
    try {
        return await axiosInstance.get("api/jobtypes/getAll");
    } catch (error) {
      console.error("Job Types Fetching Error:", error.response?.data || error);
        throw error;
    }
}

export async function getSubJobTypes() {
  try {
    return await axiosInstance.get("api/jobtypes/getSubJobTypes");
  } catch (error) {
    console.error("Sub Job Types Fetching Error:", error.response?.data || error);
    throw error;
  }
}
