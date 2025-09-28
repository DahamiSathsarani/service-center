import { axiosInstance } from "./BaseAPI";

export async function getHandoverDetails(record_id) {
  try {
    console.log("he",record_id)
    return await axiosInstance.get(`api/handover/get/${record_id}`);
  } catch (error) {
    console.log(
      "Handover  Details Getting Error",
      error.response.data || error
    );
    throw error;
  }
}
export async function setHandoverDetails(data) {
  try {
    return await axiosInstance.post("api/handover/create", data);
  } catch (error) {
    console.log(
      "Handover  Details Creating Error",
      error.response.data || error
    );
    throw error;
  }
}
