import { axiosInstance } from "./BaseAPI";

export async function damage_image_upload(formData) {
  try {
    return await axiosInstance.post(
      "api/service-record/update_damages",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error("Damage Image Upload Error:", error.response?.data || error);
    throw error;
  }
}

export async function get_service_record(formData) {
  try {
    return await axiosInstance.post("api/service-record/details", formData);
  } catch (error) {
    console.error(
      "Service Records Getting Error:",
      error.response?.data || error
    );
    throw error;
  }
}

export async function set_e_signature(formData) {
  try {
    return await axiosInstance.post("api/service-record/signature", formData);
  } catch (error) {
    console.error("E signature Set Error:", error.response?.data || error);
    throw error;
  }
}

export async function update_record_details(formData, id) {
  try {
    return await axiosInstance.post(
      `api/service-record/update/${id}`,
      formData
    );
  } catch (error) {
    console.error(
      " Set Record Details Update Error:",
      error.response?.data || error
    );
    throw error;
  }
}

export async function get_completed_records(data) {
  try {
    return await axiosInstance.post(`api/service-record/getCompleted`, data);
  } catch (error) {
    console.error(
      " Set Record Details Update Error:",
      error.response?.data || error
    );
    throw error;
  }
}

export async function get_ongoing_records(data) {
  try {
    return await axiosInstance.post(`api/service-record/getOngoing`, data);
  } catch (error) {
    console.error(
      " Set Record Details Update Error:",
      error.response?.data || error
    );
    throw error;
  }
}

export async function get_previous_odometer(vehicle_number) {
  try {
    return await axiosInstance.get(
      `api/service-record/getPreviousOdometer/${vehicle_number}`
    );
  } catch (error) {
    console.error(
      "Get Previous Odometer Error:",
      error.response?.data || error
    );
    throw error;
  }
}

export async function get_stats(formData) {
  try {
    return await axiosInstance.post(`api/service-record/getStats`, formData);
  } catch (error) {
    console.error("Get Stats Error:", error.response?.data || error);
    throw error;
  }
}

export async function get_all_records() {
  try {
    return await axiosInstance.get(`api/service-records/get_all`);
  } catch (error) {
    console.error("Getting All Records  Error:", error.response?.data || error);
    throw error;
  }
}
