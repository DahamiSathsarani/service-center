import { axiosInstance } from "./BaseAPI";

export async function getAllServiceInventries() {
  try {
    return await axiosInstance.get("api/serviceinventries/getall");
  } catch (error) {
    console.log("Service Inventries Get Error", error.response.data || error);
    throw error;
  }
}
export async function create_and_update_inspection(items) {
  try {
    return await axiosInstance.post("api/inspection/items", items);
  } catch (error) {
    console.log("Inspection Items Set Error", error.response.data || error);
    throw error;
  }
}

export async function get_inspection(items) {
  try {
    return await axiosInstance.post("api/inspection/items/get", items);
  } catch (error) {
    console.log("Inspection Items get Error", error.response.data || error);
    throw error;
  }
}

export async function createServiceInventory(item) {
  try {
    return await axiosInstance.post("api/serviceinventries", item);
  } catch (error) {
    console.log("Create Inventory Error", error.response.data || error);
    throw error;
  }
}

export async function updateServiceInventory(id, item) {
  try {
    return await axiosInstance.put(`api/serviceinventories/${id}`, item);
  } catch (error) {
    console.log("Update Inventory Error", error.response.data || error);
    throw error;
  }
}

export async function deleteServiceInventory(id) {
  try {
    return await axiosInstance.delete(`api/serviceinventories/${id}`);
  } catch (error) {
    console.log("Delete Inventory Error", error.response.data || error);
    throw error;
  }
}