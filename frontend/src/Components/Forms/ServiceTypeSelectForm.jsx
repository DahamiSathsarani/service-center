import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getAllJobTypes } from "../../Api/JobTypeAPI";
import { getSubJobTypes } from "../../Api/JobTypeAPI";
import { service_record_package_mapping_create } from "../../Api/ServiceRecordPackageMappingAPI";
import { get_previous_odometer } from "../../Api/ServiceRecordAPI";
import { toast } from "react-toastify";

export default function ServiceTypeSelectForm({ vehicle_number }) {
  const navigate = useNavigate();

  const [jobTypes, setJobTypes] = useState([]);
  const [subJobTypes, setSubJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [specificSubJobTypes, setSpecificSubJobTypes] = useState([]);
  const [selectedSubJobTypes, setSelectedSubJobTypes] = useState([]);
  const [note, setNote] = useState("");
  const [odometer, setOdometer] = useState("");
  const [lastOdometer, setLastOdometer] = useState("");
  const [odometerWarning, setOdometerWarning] = useState("");

  useEffect(() => {
    getJobTypes();
    getAllSubJobTypes();
    getPreviousOdometer();
  }, []);

  const getJobTypes = async () => {
    try {
      const response = await getAllJobTypes();
      // console.log("API Response:", response);

      if (response.data && response.data.job_types) {
        setJobTypes(response.data.job_types);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const getAllSubJobTypes = async () => {
    try {
      const response = await getSubJobTypes();
      // console.log("Sub API Response:", response);

      if (response.data && response.data.sub_job_types) {
        setSubJobTypes(response.data.sub_job_types);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const getPreviousOdometer = async () => {
    try {
      const response = await get_previous_odometer(vehicle_number);
      console.log("Last Odometer record:", response.data.data.odometer);

      if (response.data && response.data.data) {
        setLastOdometer(response.data.data.odometer);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const handleJobTypeChange = (e) => {
    const selectedJobId = parseInt(e.target.value);
    console.log("selectedJobId", selectedJobId);
    setSelectedJobType(selectedJobId);
    getSubJobTypesById(selectedJobId);
  };

  const getSubJobTypesById = (id) => {
    const subJobData = subJobTypes[id];
    console.log("subJobData", subJobData);

    if (subJobData.length > 1) {
      const validSubJobData = subJobData.filter((option) => option !== null);
      setSpecificSubJobTypes(
        validSubJobData.length > 0 ? validSubJobData : null
      );
    } else {
      setSpecificSubJobTypes(null);
    }
  };

  const handleCheckboxChange = (option) => {
    setSelectedSubJobTypes((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((item) => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const handleOdometerChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value)) {
      setOdometer(value);

      if (lastOdometer && Number(value) < Number(lastOdometer)) {
        setOdometerWarning("Odometer value is less than the previous reading.");
      } else {
        setOdometerWarning("");
      }
    }
  };

  const handleNext = async () => {
    try {
      const jobTypesData = {
        jobType: selectedJobType,
        subJobTypes: selectedSubJobTypes,
        vehicle_number: vehicle_number,
        note: note || null,
        odometer: odometer,
      };

      console.log("Sending data:", jobTypesData);

      const response = await service_record_package_mapping_create(
        jobTypesData
      );
      if (response.status === 201) {
        navigate(
          `/advisor/service-record/${response.data.service_record.service_no}/damage-marking`
        );
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error);
      }
      console.error("Error submitting data:", error);
    }
  };

  const onCancelBtn = () => {
    navigate(-1);
  };

  return (
    <div className="bg-background p-4 md:p-6 mx-auto rounded-xl shadow-lg">
      {lastOdometer && (
        <div className="flex items-center mb-4 py-3 rounded-md">
          <p className="text-gray-700 font-semibold mr-2">Previous Odometer:</p>
          <p className="text-gray-900 font-medium">{lastOdometer} km</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Odometer:
        </label>
        <input
          type="text"
          name="odometer"
          value={odometer}
          onChange={handleOdometerChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Odometer"
        />
        {odometerWarning && (
          <p className="text-red-500 text-sm">{odometerWarning}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Select Service Type:
        </label>
        <select
          value={selectedJobType}
          onChange={handleJobTypeChange}
          className="w-full p-2 border rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select service type</option>
          {jobTypes.map((job) => (
            <option key={job.id} value={job.id}>
              {job.job_type}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mt-6">
        {specificSubJobTypes && specificSubJobTypes.length > 0 ? (
          <>
            <p className="font-semibold text-gray-700 mb-2">
              Select Sub-Options:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specificSubJobTypes.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={
                      Array.isArray(selectedSubJobTypes) &&
                      selectedSubJobTypes.includes(option)
                    }
                    onChange={() => handleCheckboxChange(option)}
                    className="accent-blue-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-md">
            <p className="text-gray-500">No sub types available</p>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-6">
        <label className="text-gray-700 font-semibold mb-2">
          Additional Notes:
        </label>
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add any additional notes"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row sm:justify-end mt-4 gap-2">
        <button
          className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0 transition"
          type="button"
          onClick={onCancelBtn}
        >
          Cancel
        </button>
        <button
          disabled={selectedJobType === 2 && !(selectedSubJobTypes.length > 0)}
          className={`${
            selectedJobType === 2 && !(selectedSubJobTypes.length > 0)
              ? "cursor-not-allowed opacity-15"
              : ""
          } mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto px-4 py-2 font-semibold transition`}
          type="submit"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
