import { axiosInstance } from "./BaseAPI";

export async function create_damage_images(formData) 
{
  try {
    return await axiosInstance.post(
      "api/damages/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error("Damage Image Saving Error:", error.response?.data || error);
    throw error;
  }
}