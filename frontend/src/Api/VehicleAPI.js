import { axiosInstance } from "./BaseAPI";

export async function vehicle_search(searchValue, type) {
  try {
    let endpoint;
    switch (type) {
      case "vehicle_number":
        endpoint = "api/vehicle/search";
        break;
      case "customer_id":
        endpoint = "api/vehicle/search-by-customer";
        break;
      default:
        throw new Error("Invalid search type");
    }
    const response = await axiosInstance.post(endpoint, { value: searchValue });
    return response;
  } catch (error) {
    console.error(
      "Vehicle Search Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function vehicle_create(formData) {
  try {
    return await axiosInstance.post("api/vehicle/create", formData);
  } catch (error) {
    console.error("Vehicle Create Error:", error.response?.data || error);
    throw error;
  }
}

export async function vehicle_get_all() {
  try {
    return await axiosInstance.get("api/vehicle/getAll");
  } catch (error) {
    console.error("Get all Vehicles Error:", error.response?.data || error);
    throw error;
  }
}

export async function vehicle_update(formData) {
  try {
    return await axiosInstance.post("api/vehicle/update", formData);
  } catch (error) {
    console.error("Vehicle Update Error:", error.response?.data || error);
    throw error;
  }
}
