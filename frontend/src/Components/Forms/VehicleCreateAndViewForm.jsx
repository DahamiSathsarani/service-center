import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vehicle_create, vehicle_update } from "../../Api/VehicleAPI";

export default function VehicleCreateAndViewForm({ type, data, userRole }) {
  const { customer_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_number: "",
    type: "",
    brand: "",
    model: "",
    fuel_type: "",
    engine_number: "",
    license_expire_date: "",
    insurence_expire_date: "",
    customer_id: customer_id,
    mobile_number: "",
  });

  useEffect(() => {
    if ((type === "view" || type === "update") && data) {
      setFormData({ ...data, mobile_number: data?.customer?.mobile_number });
    }
  }, [type, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fuelTypes = ["PETROL", "DIESEL"];

  const vehicleTypes = ["CAR", "SUV", "VAN", "PVAN", "LORRY"];

  const createVehicleDetails = async (e) => {
    e.preventDefault();

    try {
      console.log("formData", formData);
      const response = await vehicle_create({
        ...formData,
        userRole: userRole || null,
      });
      console.log(response);
      if (response.status === 201) {
        toast.success(response.data.message || "Vehicle created successfully!");
        navigate(
          `/advisor/${response.data.vehicle.vehicle_number}/service-record/create`
        );
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
  const updateVehicleDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await vehicle_update(formData);
      if (response.status === 200) {
        toast.success("Vehicle Details Updated Successfully");
        navigate(0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Error");
    }
  };
  const onCancelBtn = () => {
    navigate(-1);
  };

  return (
    <form>
      <div className="bg-background py-6 px-4 sm:px-10">
        <div className="mt-3 flex flex-col">
          <div className="flex flex-col md:flex-row w-full justify-between mb-0 md:mb-5">
            <div className="h-[1.5rem] md:h-auto  flex flex-row items-center md:items-start justify-between md:flex-col w-[100%] md:w-[40%]">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Vehicle Number</strong>
              </label>
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                disabled={type === "view" || type==='update'}
                className="h-[1.5rem] md:h-[2rem] 2xl:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>

            <div className="h-[1.5rem] md:h-auto flex flex-row items-center md:items-start justify-between md:flex-col w-[100%] md:w-[40%] mt-3 md:mt-0">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Vehicle Type</strong>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[60%] md:w-[100%] "
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                {vehicleTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className=" flex flex-col md:flex-row w-full justify-between md:mb-5">
            <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Vehicle Brand</strong>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] 2xl:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>

            <div className="h-[1.5rem] md:h-auto items-center  md:items-start justify-between flex flex-row md:flex-col w-[100%] md:w-[40%] mt-3">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Vehicle Model</strong>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] 2xl:h-[2.5rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[60%] md:w-[100%]"
              />
            </div>
          </div>

          <div className=" flex flex-col md:flex-row w-full justify-between md:mb-5">
            <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Fuel Type</strong>
              </label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[60%] md:w-[100%] "
              >
                <option value="" disabled>
                  Select Fuel Type
                </option>
                {fuelTypes.map((fuel_type, index) => (
                  <option key={index} value={fuel_type}>
                    {fuel_type}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[1.5rem] md:h-auto items-center  md:items-start justify-between flex flex-row md:flex-col w-[100%] md:w-[40%] mt-3">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Engine Number</strong>
              </label>
              <input
                type="text"
                name="engine_number"
                value={formData.engine_number}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] 2xl:h-[2.5rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[60%] md:w-[100%]"
              />
            </div>
          </div>

          <div className=" flex flex-col md:flex-row w-full justify-between md:mb-5">
            <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>License Expiration Date</strong>
              </label>
              <input
                type="date"
                name="license_expire_date"
                value={formData.license_expire_date}
                onChange={handleChange}
                disabled={type === "view" }
                className="h-[1.5rem] md:h-[2rem] 2xl:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
              />
            </div>

            <div className="h-[1.5rem] md:h-auto items-center  md:items-start justify-between flex flex-row md:flex-col w-[100%] md:w-[40%] mt-3">
              <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                <strong>Insurance Expiration Date</strong>
              </label>
              <input
                type="date"
                name="insurence_expire_date"
                value={formData.insurence_expire_date}
                onChange={handleChange}
                disabled={type === "view"}
                className="h-[1.5rem] md:h-[2rem] 2xl:h-[2.5rem] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md w-[60%] md:w-[100%]"
              />
            </div>
          </div>
          {userRole == 1 && (
            <div className=" flex flex-col md:flex-row w-full justify-start  md:mb-5">
              <div className="h-[1.5rem] md:h-auto  flex flex-row md:flex-col items-center  md:items-start justify-between w-[100%] md:w-[40%] mt-3 md:mt-0">
                <label className="md:mb-2 text-mobile_body_label sm:text-tab_body_label lg:text-body_label text-label">
                  <strong>Customer Mobile No</strong>
                </label>
                <input
                  type="text"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className="h-[1.5rem] md:h-[2.5rem] w-[60%] md:w-[100%] text-mobile_body_label sm:text-tab_body_label lg:text-body_label outline outline-1 outline-[#616161] px-6 rounded-md"
                />
              </div>
            </div>
          )}
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
          {type !== "update" && (
            <button
              className="mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
              onClick={createVehicleDetails}
            >
              Register Vehicle
            </button>
          )}
          {type === "update" && (
            <button
              className="mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
              onClick={updateVehicleDetails}
            >
              Update Vehicle
            </button>
          )}
        </div>
      )}
    </form>
  );
}
