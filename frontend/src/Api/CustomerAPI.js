import { axiosInstance } from "./BaseAPI";

export async function customer_create(formData) {
  try {
    return await axiosInstance.post("api/customer/create", formData);
  } catch (error) {
    console.error("Customer Create Error:", error.response?.data || error);
    throw error;
  }
}

export async function customer_search(phone_number) {
  try {
    return await axiosInstance.post("api/customer/search", phone_number);
  } catch (error) {
    console.error("Customer Search Error:", error.response?.data || error);
    throw error;
  }
}

export async function customer_view(id) {
  try {
    return await axiosInstance.post("api/customer/view", id);
  } catch (error) {
    console.error("Customer View Error:", error.response?.data || error);
    throw error;
  }
}

export async function all_customers_view(id) {
  try {
    return await axiosInstance.get("api/customers/all/view");
  } catch (error) {
    console.error("Customer View Error:", error.response?.data || error);
    throw error;
  }
}

export async function update_customer(requestData) {
  try {
    return await axiosInstance.post("api/customer/update", requestData);
  } catch (error) {
    console.error("Old Customer Create Error:", error.response?.data || error);
    throw error;
  }
}