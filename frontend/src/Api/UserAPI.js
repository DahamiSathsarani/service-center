import { axiosInstance } from "./BaseAPI";

export async function user_create(formData) {
  try {
    return await axiosInstance.post("api/user/register", formData);
  } catch (error) {
    console.error("User Create Error:", error.response?.data || error);
    throw error;
  }
}
export async function user_login(formData) {
  try {
    return await axiosInstance.post("api/user/signin", formData);
  } catch (error) {
    console.error("User Login Error:", error.response?.data || error);
    throw error;
  }
}
export async function get_user_profile_details(user_id) {
  try {
    return await axiosInstance.get(`api/user/profile/${user_id}`);
  } catch (error) {
    console.error("User details Error:", error.response?.data || error);
    throw error;
  }
}
export async function update_user_details(userData) {
  try {
    return await axiosInstance.post("api/user/profile/update", userData);
  } catch (error) {
    console.error("User Update Error:", error.response?.data || error);
    throw error;
  }
}

export async function forgot_password(email) {
  try {
    return await axiosInstance.post("api/user/forgot-password", email);
  } catch (error) {
    console.error("User Forgot Password Error:", error.response?.data || error);
    throw error;
  }
}

export async function reset_password(params) {
  try {
    return await axiosInstance.post("api/user/reset-password", params);
  } catch (error) {
    console.error("User Reset Password Error:", error.response?.data || error);
    throw error;
  }
}

export async function get_users_by_user_role(params) {
  try {
    return await axiosInstance.get(`api/user/get/${params}`);
  } catch (error) {
    console.error("Getting Users Error:", error.response?.data || error);
    throw error;
  }
}

export async function user_delete(user_id) {
  try {
    return await axiosInstance.put(`api/user/delete/${user_id}`);
  } catch (error) {
    console.error("Deleting Users Error:", error.response?.data || error);
    throw error;
  }
}

export async function user_activate(user_id) {
  try {
    return await axiosInstance.put(`api/user/activate/${user_id}`);
  } catch (error) {
    console.error("Activating Users Error:", error.response?.data || error);
    throw error;
  }
}
