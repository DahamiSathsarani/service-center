import { axiosInstance } from "./BaseAPI";

export async function getServiceTimeDetails(record_id) {
  try {
    return await axiosInstance.post(
      "api/baymanagement/getInformation",
      record_id
    );
  } catch (error) {
    console.log("Service Time Get Details Error", error.response.data || error);
    throw error;
  }
}

export async function getAllBayDetails(bay_type) {
  try {
    return await axiosInstance.get(`api/baymanagement/getDetails/${bay_type}`);
  } catch (error) {
    console.log("Bay Details Get Error", error.response.data || error);
    throw error;
  }
}
export async function getAllBayTypeDetails(bay_type, record_id) {
  try {
    return await axiosInstance.post(
      `api/baymanagement/getTypeDetails/${bay_type}`,
      record_id
    );
  } catch (error) {
    console.log(
      "Related Type Bay Details Get Error",
      error.response.data || error
    );
    throw error;
  }
}
export async function createBayRecord(data, bay_type) {
  try {
    return axiosInstance.post(`api/baymanagement/create/${bay_type}`, data);
  } catch (error) {
    console.log("Bay Record Create Error", error.response.data || error);
    throw error;
  }
}
export async function updateBayRecord(data, bay_type) {
  try {
    return axiosInstance.post(`api/baymanagement/update/${bay_type}`, data);
  } catch (error) {
    console.log("Bay Record Update Error", error.response.data || error);
    throw error;
  }
}
