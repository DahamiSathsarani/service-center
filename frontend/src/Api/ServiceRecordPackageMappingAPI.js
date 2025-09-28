import { axiosInstance } from "./BaseAPI";

export async function service_record_package_mapping_create(jobTypesData) {
  try {
    return await axiosInstance.post("api/serviceRecord-Package/create", jobTypesData);
  } catch (error) {
    console.error("Service Record Package Mapping Create Error:", error.response?.data || error);
    throw error;
  }
}
