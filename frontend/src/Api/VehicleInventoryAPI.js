import { axiosInstance } from "./BaseAPI";

export async function inventory_create(formData){
    try {
        return await axiosInstance.post("api/vehicleinventory/create", formData);
    } catch (error) {
        console.error("Inventory creation error:",error.response?.data || error);
        throw error;
    }
}

export async function inventory_update(formData){
    try {
        return await axiosInstance.post("api/vehicleinventory/update", formData);
    } catch (error) {
        console.error("Inventory update error:",error.response?.data || error);
        throw error;
    }
}

export async function getInventoryByServiceNo(serviceNo) {
    try {
        return await axiosInstance.get(`api/vehicleinventory/update/${serviceNo}`);
    } catch (error) {
        console.error("Fetch inventory error:", error.response?.data || error);
        throw error;
    }
}
