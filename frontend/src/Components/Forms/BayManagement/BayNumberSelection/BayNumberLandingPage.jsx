import { useEffect, useState } from "react";
import BayNumberCard from "./BayNumberCard";
import { FaSignInAlt, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Inspection from "../../../../Pages/advisor/Inspection";
import { get_service_record } from "../../../../Api/ServiceRecordAPI";

export default function BayNumberLandingPage({
  data,
  onClickInBtn,
  onClickOutBtn,
}) {
  const [selectedBay, setSelectedBay] = useState(null);
  const [isInspectionOpen, setInspectionOpen] = useState(false); // State to manage modal visibility
  const navigate = useNavigate();
  const { record_id } = useParams();
  const [serviceRecordType, setServiceRecordType] = useState(null);
  useEffect(() => {
    console.log(data.allDetails);
    get_service_record_details();
  }, [data, record_id]);

  if (!data) {
    return <p>Loading...</p>;
  }
  const get_service_record_details = async () => {
    try {
      const response = await get_service_record({ record_id: record_id });
      if (response.status === 200) {
        setServiceRecordType(
          response.data.record.service_records_package[0].package.job_type
            .job_type
        );
      }
    } catch (error) {
      console.log(error.response.data.message || "Internal Server Error");
    }
  };
  const onClickContinueBtn = () => {
    navigate(`/advisor/service-record/${record_id}/bay-selection`);
  };

  return (
    <div>
      <div className="px-4 md:px-6 lg:px-14 py-10 w-full flex flex-col sm:flex-row justify-center items-center bg-background">
        {(data.allDetails || []).map((bay, index) => (
          <BayNumberCard
            key={index}
            isSelected={selectedBay === bay.bay_id}
            onSelect={() => setSelectedBay(bay.bay_id)}
            bay={bay}
            serviceTimeRecord={data.serviceTimeRecord}
            isDisabled={
              data.serviceTimeRecord !== null &&
              data.serviceTimeRecord.bay_id !== bay.bay_id
            }
            isEnabled={
              data.serviceTimeRecord !== null &&
              data.serviceTimeRecord.bay_id === bay.bay_id
            }
          />
        ))}
      </div>
      <div
        className={`${
          data.serviceTimeRecord === null
            ? "sm:justify-end"
            : "sm:justify-between"
        } w-full flex flex-col sm:flex-row items-center my-2 md:my-4 px-4 md:pr-4`}
      >
        {data.serviceTimeRecord !== null && (
          <button
            disabled={serviceRecordType !== "Full Service"}
            className={`${
              serviceRecordType === "Full Service"
                ? ""
                : "opacity-30 cursor-not-allowed"
            } mobile_cancel-btn md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0`}
            type="button"
            onClick={() => setInspectionOpen(true)} // Open modal on click
          >
            Inspection
          </button>
        )}
        {data.serviceTimeRecord !== null && (
          <div className="py-3 flex flex-col w-[20rem]">
            <span className="flex w-full justify-center py-2 text-center bg-[#fff6c1] font-body text-body_label border border-primary items-center">
              <FaSignInAlt className="mr-3 text-[15px]" />
              In at : {data.serviceTimeRecord.in_time}
            </span>
            {data.serviceTimeRecord?.status === "COMPLETED" && (
              <span className="flex w-full justify-center py-2 text-center bg-[#f8c0bd] mt-3 text-body_label font-body border border-danger items-center">
                <FaSignOutAlt className="mr-3 text-[15px]" />
                Out at : {data.serviceTimeRecord.out_time}
              </span>
            )}
          </div>
        )}
        <div>
          {data.serviceTimeRecord === null && (
            <button
              className={`${
                selectedBay === null ? "opacity-30 cursor-not-allowed" : ""
              } mobile_submit-btn md:tab_submit-btn lg:submit-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0`}
              type="button"
              onClick={() => onClickInBtn(selectedBay, "in")}
            >
              IN
            </button>
          )}
          {data.serviceTimeRecord?.status === "ONGOING" && (
            <button
              className="mobile_danger-btn md:tab_danger-btn lg:danger-btn w-full sm:w-auto"
              type="submit"
              onClick={() => onClickOutBtn()}
            >
              OUT
            </button>
          )}
          {data.serviceTimeRecord?.status === "COMPLETED" && (
            <button
              className="mobile_submit-btn md:tab_submit-btn lg:submit-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
              type="button"
              onClick={onClickContinueBtn}
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* MODAL FOR INSPECTION */}
      {isInspectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[80%] md:w-[80%] h-[80%] p-6 rounded-lg shadow-lg relative">
            <button
              className={` absolute top-2 right-2 text-xl font-bold text-black`}
              onClick={() => setInspectionOpen(false)} // Close modal
            >
              <FaTimes />
            </button>
            <Inspection />
          </div>
        </div>
      )}
    </div>
  );
}
