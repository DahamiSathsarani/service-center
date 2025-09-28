import { axiosInstance } from "./BaseAPI";

export async function update_new_customer(requestData) {
  try {
    return await axiosInstance.post("api/old-customer/create", requestData);
  } catch (error) {
    console.error("Old Customer Create Error:", error.response?.data || error);
    throw error;
  }
}

export async function old_vehicles_search(searchValue, type) {
  try {
    let endpoint;
    switch (type) {
      case "vehicle_number":
        endpoint = `api/old-customer/search-by-vehicle/${searchValue}`;
        break;
      case "customer_id":
        endpoint = `api/old-customer/search-by-customer/${searchValue}`;
        break;
      default:
        throw new Error("Invalid search type");
    }
    const response = await axiosInstance.get(endpoint);
    return response;
  } catch (error) {
    console.error(
      "Vehicle Search Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}