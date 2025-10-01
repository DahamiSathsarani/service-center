import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { customer_create, update_customer } from "../../Api/CustomerAPI";
import {
  create_update_new_customer,
  update_new_customer,
} from "../../Api/OldCustomerAPI";

export default function CustomerCreateAndView({
  type,
  data,
  button,
  vehicle_number,
  userRole,
  status,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    dob: "",
    house_number: "",
    street_name: "",
    city: "",
    state: 1,
  });

  // When customerData is available, update formData
  useEffect(() => {
    if (type === "view" && data) {
      setFormData({ ...data });
    }
  }, [data, type, userRole]);

  const sriLankanProvinces = [
    "Central Province",
    "Eastern Province",
    "North Central Province",
    "Northern Province",
    "North Western Province",
    "Sabaragamuwa Province",
    "Southern Province",
    "Uva Province",
    "Western Province",
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 🔒 Validate DOB
  const isDobValid = () => {
    if (formData.dob) {
      const selectedDate = new Date(formData.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate >= today) {
        toast.error("Date of Birth must be before today!");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate DOB
    if (!isDobValid()) return;

    try {
      const response = await customer_create(formData);
      if (response.status === 200) {
        toast.success(
          response.data.message || "Customer created successfully!"
        );
        if (userRole === "1") {
          navigate(`/admin/customers`);
        } else {
          navigate(
            `/advisor/customer/${response.data.customer.customer_id}/vehicle/create/`
          );
        }
      } else {
        toast.error( "Something went wrong!");
      }
    } catch (error) {
       
        toast.error(error.response?.data?.message || "Something went wrong!");
      
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // validate DOB
    if (!isDobValid()) return;

    if (status === "update") {
      const requestUpdateData = {
        ...formData,
        status: status,
      };
      try {
        const response = await update_customer(requestUpdateData);
        if (response.status === 200) {
          toast.success(
            response.data.message || "Customer updated successfully!"
          );
          navigate(0);
        } else {
          toast.error( "Something went wrong!");
        }
      } catch (error) {
        
          toast.error("Something went wrong!");
        
      }
    } else {
      try {
        if (type === "view" && status !== "update") {
          const requestData = {
            vehicle_number: vehicle_number,
            customer_id: data?.customer_id,
            type: "onlyUpdate",
          };

          const response = await update_new_customer(requestData);

          if (response.status === 200) {
            toast.success(
              response.data.message || "Customer updated successfully!"
            );
            navigate(
              `/advisor/vehicle/${response.data.updatedVehicle.vehicle_number}/view`,
              { state: { vehicle: response.data.updatedVehicle } }
            );
          } else {
            toast.error( "Something went wrong!");
          }
        } else {
          const requestData = {
            ...formData,
            vehicle_number: vehicle_number,
            type: "create&update",
          };
          const response = await update_new_customer(requestData);

          if (response.status === 200) {
            toast.success(
              response.data.message || "Customer updated successfully!"
            );
            navigate(
              `/advisor/vehicle/${response.data.updatedVehicle.vehicle_number}/view`,
              { state: { vehicle: response.data.updatedVehicle } }
            );
          } else {
            toast.error( "Something went wrong!");
          }
        }
      } catch (error) {
       
          toast.error( "Something went wrong!");
        
      }
    }
  };

  const onCancelBtn = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-background py-6 px-4 sm:px-10">
        <div className="mt-3 flex flex-col">
          {/* --- Name Fields --- */}
          <div className="flex flex-col md:flex-row w-full justify-between mb-0 md:mb-5 ">
            <div className="h-[1.5rem] md:h-auto  flex flex-row items-center md:items-start justify-between md:flex-col w-[100%] md:w-[40%]">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>First Name</strong>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
            <div className="h-[1.5rem] md:h-auto  flex flex-row items-center  md:items-start justify-between md:flex-col w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Last Name</strong>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
          </div>

          {/* --- Mobile + Email --- */}
          <div className=" flex flex-col md:flex-row w-full justify-between md:mb-5 ">
            <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Mobile No</strong>
              </label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
            <div className="h-[1.5rem] md:h-auto items-center  md:items-start justify-between flex flex-row md:flex-col w-[100%] md:w-[40%] mt-3 md:mt-0 ">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[60%] md:w-[100%]"
              />
            </div>
          </div>

          {/* --- DOB --- */}
          <div className="flex flex-row w-full justify-start md:mb-5 ">
            <div className="flex flex-row md:flex-col justify-between w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Date of Birth</strong>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                max={new Date().toISOString().split("T")[0]} // prevent future dates
                className="h-[1.5rem] md:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>
          </div>

          {/* --- Address --- */}
          <div className="flex flex-col w-full justify-between mt-3 md:mt-0 mb-2">
            <label className="mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
              <strong>Address</strong>
            </label>
            <div className="flex flex-col md:flex-row justify-between w-full md:mb-4">
              <input
                type="text"
                name="house_number"
                value={formData.house_number}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] outline text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline-1 outline-[#616161] px-6 rounded-md w-[100%] md:w-[40%] mb-3"
                placeholder="House Number"
              />
              <input
                type="text"
                name="street_name"
                value={formData.street_name}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] text-mobile_body_labelsm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[100%] md:w-[40%] mb-3"
                placeholder="Street Name"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full md:mb-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[100%] md:w-[40%] mb-3"
                placeholder="City"
              />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={type === "view" && status !== "update"}
                className="h-[1.5rem] md:h-[2.5rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[100%] md:w-[40%] mb-3"
              >
                {sriLankanProvinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {type !== "view" && button !== "update" && (
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
            type="submit"
          >
            Register Customer
          </button>
        </div>
      )}
      {button === "update" && (
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
            onClick={handleUpdate}
          >
            Update New Customer
          </button>
        </div>
      )}
    </form>
  );
}
