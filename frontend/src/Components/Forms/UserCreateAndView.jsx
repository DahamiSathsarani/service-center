import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { update_user_details, user_create } from "../../Api/UserAPI";
import { images } from "../../assets/Images/images";
import { Eye, EyeOff, Pencil } from "lucide-react";

export default function UserCreateAndView({ type, data }) {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preview, setPreview] = useState(images.ProPic); // Initial profile pic

  // Handle file selection

  const [user_data, set_userData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    profile_picture: images.ProPic,
    user_role: "",
  });

  // When customerData is available, update formData
  useEffect(() => {
    if (type === "view" && data) {
      set_userData({ ...data, user_role: data.user_role.role_name });

      // Set preview image correctly
      if (data.profile_picture) {
        setPreview(data.profile_picture);
      } else {
        setPreview(images.ProPic); // Default image
      }
    }
  }, [type, data]); // Remove `user_data.profile_picture` from dependencies

  useEffect(() => {
    const userAction = JSON.parse(localStorage.getItem("userAction"));

    if (userAction) {
      if (userAction.action === "updated") {
        toast.success(`User Updated Successfully`);
      }

      localStorage.removeItem("userAction");
    }
  }, []);

  const onClickUserDetailsSave = async (e) => {
    e.preventDefault();
    let response = null;
    try {
      const formData = new FormData();
      formData.append("update_type", "user_details");
      formData.append("first_name", user_data.first_name);
      formData.append("last_name", user_data.last_name);
      formData.append("username", user_data.username);

      if (user_data.profile_picture instanceof File) {
        formData.append("profile_picture", user_data.profile_picture);
      }

      response = await update_user_details(formData);

      if (response.status === 200) {
        set_userData({ ...response.data.user });
        localStorage.setItem(
          "userAction",
          JSON.stringify({ action: "updated" })
        );
        navigate(0);
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        return toast.error(error.response.data.message);
      }
      console.log(error.message);
      const errors = error.response?.data || {};
      Object.keys(errors).forEach((key) => {
        toast.error(errors[key][0]);
      });
    }
  };

  const onClickPasswordUpdateBtn = async (e) => {
    e.preventDefault();
    try {
      const response = await update_user_details({
        update_type: "update_pw",
        ...{
          old_password: user_data.old_password,
          new_password: user_data.password,
          confirm_new_password: user_data.confirm_password,
        },
      });
      if (response.status === 200) {
        toast.success("Password Updated Successfully");
        /*  window.location.reload(); */
      }
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 500) {
        return toast.error(error.response.data.message);
      }
      console.log(error.message);
      const errors = error.response.data;
      Object.keys(errors).forEach((key) => {
        toast.error(errors[key][0]);
      });
    }
  };
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      const file = files[0];

      setPreview(URL.createObjectURL(file)); // Update preview
      set_userData((prevData) => ({
        ...prevData,
        [name]: file, // Save file for backend
      }));
    } else {
      set_userData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await user_create(user_data);
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message || "User created successfully!");
        // Reset form after successful submission
        set_userData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirm_password: "",
        });
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    }
  };
  const onCancelBtn = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="bg-background py-6 px-4 sm:px-10">
        <h3
          className={`${
            type === "view"
              ? "hidden"
              : "font-body text-center md:text-left sm:text-tab_sub_heading lg:text-sub_heading"
          }`}
        >
          User Details:
        </h3>
        <div className="mt-3 flex flex-col">
          <div
            className={`${
              type === "view"
                ? "flex flex-col sm:flex-row mb-8 relative w-full justify-center items-center md:justify-start"
                : "hidden"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              name="profile_picture"
              className="hidden"
              id="fileInput"
            />
            <div className="relative h-[5rem] w-[5rem] sm:h-[6rem] sm:w-[6rem] md:h-[7rem] md:w-[7rem] lg:w-[8rem] lg:h-[8rem]">
              <img
                src={preview}
                alt="Profile"
                className="rounded-full object-cover h-[5rem] w-[5rem] sm:h-[6rem] sm:w-[6rem] md:h-[7rem] md:w-[7rem] lg:h-[8rem] lg:w-[8rem] border-2 border-gray-300 shadow-md"
              />
              <button
                onClick={() => document.getElementById("fileInput").click()}
                className="absolute bottom-1 right-1 bg-black text-white p-1 rounded-full hover:bg-gray-800 transition duration-200"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="flex flex-col">
              {" "}
              <span className="ml-5 text-center md:text-start text-mobile_heading md:text-tab_heading lg:text-heading">
                {user_data?.username}
              </span>
              <span className="ml-5 text-center md:text-start text-mobile_sub_heading md:text-tab_sub_heading lg:text-sub_heading">
                ({user_data?.user_role})
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full justify-between mb-0 md:mb-5 ">
            <div className="h-[1.5rem] md:h-auto  flex flex-row items-center md:items-start justify-between md:flex-col w-[100%] md:w-[40%]">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>First Name</strong>
              </label>
              <input
                type="text"
                name="first_name"
                value={user_data?.first_name}
                onChange={handleChange}
                className="h-[1.5rem] md:h-[2rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
            <div className="h-[1.5rem] md:h-auto  flex flex-row items-center  md:items-start justify-between md:flex-col w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Last Name</strong>
              </label>
              <input
                type="text"
                name="last_name"
                value={user_data?.last_name}
                onChange={handleChange}
                className="h-[1.5rem] md:h-[2rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row  w-full justify-between md:mb-5 ">
            <div
              className={`${
                type === "view"
                  ? "flex flex-row md:flex-col justify-between w-[100%] md:w-[40%]  mt-3 md:mt-0"
                  : "hidden"
              }`}
            >
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Username</strong>
              </label>
              <input
                type="text"
                name="username"
                value={user_data?.username}
                onChange={handleChange}
                className="h-[1.5rem] md:h-[2rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
            <div className="flex flex-row md:flex-col justify-between w-[100%] md:w-[40%]  mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                name="email"
                value={user_data?.email}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
          </div>
          <div
            className={`${
              type === "view"
                ? "flex w-full  justify-end h-[3rem] self-end items-end"
                : "hidden"
            }`}
          >
            <button className="submit-btn " onClick={onClickUserDetailsSave}>
              Save
            </button>
          </div>
          <h3
            className={`${
              type === "view" ? "text-sub_heading mt-4 mb-3" : "hidden"
            }`}
          >
            Update Password
          </h3>
          <div
            className={`${
              type === "view"
                ? "flex flex-col md:flex-row w-full justify-between md:mb-5"
                : "hidden"
            }`}
          >
            <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Old Password</strong>
              </label>
              <span className="relative w-[60%] md:w-[100%] ">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  value={user_data?.old_password}
                  onChange={handleChange}
                  className="h-[1.5rem] md:h-[2rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full justify-between md:mb-5">
            <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong className={`${type !== "view" ? "block" : "hidden"}`}>
                  Password
                </strong>
                <strong className={`${type === "view" ? "block" : "hidden"}`}>
                  New Password
                </strong>
              </label>
              <span className="relative  w-[60%] md:w-[100%] ">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user_data?.password}
                  onChange={handleChange}
                  className="h-[1.5rem] md:h-[2rem] w-full text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </span>
            </div>
            <div className="h-[1.5rem] md:h-auto items-center  md:items-start justify-between flex flex-row md:flex-col w-[100%] md:w-[40%] mt-3 md:mt-0 ">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Confirm Password</strong>
              </label>
              <span className="relative w-[60%] md:w-[100%]">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={user_data?.confirm_password}
                  onChange={handleChange}
                  className="h-[1.5rem] md:h-[2rem] w-full text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md "
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </span>
            </div>
          </div>
          <div
            className={`${
              type === "view"
                ? "flex w-full justify-end h-[3rem] self-end items-end"
                : "hidden"
            }`}
          >
            <button className="submit-btn " onClick={onClickPasswordUpdateBtn}>
              Update Password
            </button>
          </div>
        </div>
      </div>
      {type !== "view" && (
        <div className="w-full flex flex-col sm:flex-row sm:justify-end mt-2 md:mt-5">
          <button
            className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
            type="button"
            onClick={onCancelBtn}
          >
            Cancel
          </button>
          <button
            className="mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
            onClick={handleSubmit}
          >
            Register User
          </button>
        </div>
      )}
    </div>
  );
}
