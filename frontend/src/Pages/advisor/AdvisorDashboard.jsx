import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  get_completed_records,
  get_ongoing_records,
} from "../../Api/ServiceRecordAPI";
import { GoArrowRight } from "react-icons/go";
export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const [completedRecords, setCompletedRecords] = useState([]);
  const [ongoingRecords, setOngoingRecords] = useState([]);

  const handleNewJob = async (e) => {
    navigate("/advisor/vehicle/search");
  };

  useEffect(() => {
    fetchCompletedJobs();
    fetchOngoingJobs();
  }, []);

  const fetchCompletedJobs = async (e) => {
    try {
      const response = await get_completed_records({type:'today'});
      console.log("Completed Jobs:", response);

      if (response.data.data && response.data.user) {
        const userId = response.data.user.user_id;
        const filteredRecords = response.data.data.filter(
          (job) => job.user_id === userId
        );

        setCompletedRecords(filteredRecords);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const fetchOngoingJobs = async (e) => {
    try {
      const response = await get_ongoing_records({type:'today'});
      console.log("Ongoing Jobs:", response);

      if (response.data.data && response.data.user) {
        const userId = response.data.user.user_id;
        const filteredRecords = response.data.data.filter(
          (job) => job.user_id === userId
        );

        setOngoingRecords(filteredRecords);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const clickOnCard = (url) => {
    navigate(url);
  };

  return (
    <div className="w-full">
      <div className="bg-white p-6 shadow-md rounded-lg flex justify-center sm:justify-start">
        <button className="submit-btn" onClick={handleNewJob}>
          Create New Job
        </button>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-between gap-6">
        <div className="w-full md:w-[50%] bg-white p-6 shadow-md rounded-lg mt-6">
          <h1 className="text-mobile_sub_heading md:text-tab_sub_heading lg:text-sub_heading font-heading text-center sm:text-left mb-4">
            Completed jobs
          </h1>
          <div className="bg-background p-4 flex flex-col">
            {completedRecords?.length > 0 ? (
              <div>
                {completedRecords?.map((record, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 shadow-lg rounded-xl border border-gray-200 mb-4 flex flex-col lg:flex-row items-start justify-between transition-transform hover:scale-105 duration-300"
                  >
                    <div className="mb-2 lg:mb-0">
                      <p className="text-mobile_body_bold sm:text-tab_body_bold lg:text-body_bold  text-gray-900 mb-2">
                        ✅ Vehicle: {record?.vehicle_number}
                      </p>
                      <p className="text-mobile_body_bold  px-4 rounded inline-block mt-1 bg-green-100 text-green-700">
                        {record?.status === "COMPLETED"
                          ? "COMPLETED"
                          : record?.status}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          clickOnCard(
                            `/advisor/service-record/${record?.service_no}/details/2/view`
                          );
                        }}
                        className="flex items-center px-4  bg-[#F6CD28] text-gray-900  text-mobile_body_label  rounded-lg shadow-md 
                                                hover:bg-[#ffe06f] transition-all duration-300"
                      >
                        <GoArrowRight className="me-2 " />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-mobile_body sm:text-tab_body lg:text-body text-gray-500 text-center">
                No completed jobs available.
              </p>
            )}
          </div>
        </div>
        <div className="w-full md:w-[50%] bg-white p-6 shadow-md rounded-lg mt-6">
          <h1 className="text-mobile_sub_heading md:text-tab_sub_heading lg:text-sub_heading font-heading text-center sm:text-left mb-4">
            Ongoing jobs
          </h1>
          <div className="bg-background p-4 flex flex-col">
            {ongoingRecords?.length > 0 ? (
              <div>
                {ongoingRecords.map((record, index) => {
                  const onGoingServiceTime = record?.service_times?.find(
                    (item) => item?.status === "ONGOING"
                  );
                  return (
                    <div
                      key={index}
                      className="bg-white p-5 shadow-lg rounded-xl border border-gray-200 mb-4 flex items-start justify-between transition-transform hover:scale-105 duration-300"
                    >
                      <div>
                        <p className="text-mobile_body_bold sm:text-tab_body_bold lg:text-body_bold font-semibold text-lg text-gray-900 mb-2">
                          🔄 Vehicle: {record?.vehicle_number}
                        </p>
                        <p
                          className={`text-mobile_body_bold px-4 py rounded inline-block mt-1 
                                                    ${
                                                      onGoingServiceTime?.status ===
                                                      "ONGOING"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                        >
                          {onGoingServiceTime?.bay?.bay_type === "under_wash"
                            ? "UNDER WASH"
                            : onGoingServiceTime
                            ? onGoingServiceTime.bay.bay_type.toUpperCase()
                            : "NOT IN "}{" "}
                          BAY
                        </p>
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            clickOnCard(
                              `/advisor/service-record/${record?.service_no}/bay-selection`
                            );
                          }}
                          className="flex items-center px-4  bg-[#F6CD28] text-gray-900 text-mobile_body_label rounded-lg shadow-md 
                                                    hover:bg-[#ffe06f] transition-all duration-300"
                        >
                          <GoArrowRight className="me-2 " />
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center text-mobile_body_label sm:text-tab_body_label lg:text-body_label">
                No ongoing jobs available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
