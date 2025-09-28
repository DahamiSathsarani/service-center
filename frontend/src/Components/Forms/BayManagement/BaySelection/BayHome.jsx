import { useNavigate, useParams } from "react-router-dom";
import { getServiceTimeDetails } from "../../../../Api/BayManagementAPI";
import { icon } from "../../../../assets/Icons/icons";
import BayCard from "./BayCard";
import { useCallback, useEffect, useState } from "react";
import { get_service_record } from "../../../../Api/ServiceRecordAPI";

export default function BayHome() {
  const navigate = useNavigate();
  const { record_id } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [serviceRecordType, setServiceRecordType] = useState(null);
  const [bayCardArray, setBayCardArray] = useState([
    {
      img_url: icon.LubeIcon,
      img_description: "lube icon",
      bay_name: "Lube",
      type: "lube",
      status: "not_started",
      ulr: `/advisor/service-record/${record_id}/bay-selection/lube`,
    },
    {
      img_url: icon.UnderWashIcon,
      img_description: "under wash icon",
      bay_name: "U Wash",
      type: "under_wash",
      status: "not_started",
      ulr: `/advisor/service-record/${record_id}/bay-selection/uwash`,
    },
    {
      img_url: icon.WashIcon,
      img_description: "wash icon",
      bay_name: "Wash",
      type: "wash",
      status: "not_started",
      ulr: `/advisor/service-record/${record_id}/bay-selection/wash`,
    },
    {
      img_url: icon.FinishingIcon,
      img_description: "finishing icon",
      bay_name: "Finishing",
      type: "finishing",
      status: "not_started",
      ulr: `/advisor/service-record/${record_id}/bay-selection/finishing`,
    },
  ]);
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
  const getBayData = useCallback(async () => {
    try {
      const response = await getServiceTimeDetails({ record_id: record_id });
      if (response.status === 200) {
        const all_records = response.data.all_records;
        setBayCardArray((prevArray) =>
          prevArray.map((card) => {
            const matchingRecord = all_records.find(
              (record) => record.bay_type === card.type
            );
            return {
              ...card,
              status: matchingRecord ? matchingRecord.status : "not_started",
            };
          })
        );
        const record = all_records.find(
          (record) => record.status === "ONGOING"
        );
        if (record) {
          setIsFinished(true);
        }
      }
    } catch (error) {
      console.log(error);
      setBayCardArray((prevArray) =>
        prevArray.map((card) => ({ ...card, status: "not_started" }))
      );
    }
  }, [record_id]);
  useEffect(() => {
    getBayData();
    get_service_record_details();
    console.log(isFinished);
  }, [getBayData]);
  const onCancelBtn = () => {
    navigate(-1);
  };
  const onContinueBtn = () => {
    navigate(`/advisor/${record_id}/vehicleinventory/update`);
  };
  return (
    <div className="bg-background pt-6 pb-1 ">
      <div className="px-4 sm:px-10 lg:px-10 xl:px-20 2xl:px-32">
        <h3 className="font-body text-center text-mobile_sub_heading md:text-left sm:text-tab_sub_heading lg:text-sub_heading">
          Select the Bay :
        </h3>
        <div className="pt-8 pb-3 grid grid-cols-2  lg:flex flex-row w-full justify-between flex-wrap">
          {bayCardArray.map((card) => (
            <button
              disabled={
                !(card.status === "ONGOING" || card.status === "COMPLETED") &&
                isFinished
              }
              className={`${
                !(card.status === "ONGOING" || card.status === "COMPLETED") &&
                isFinished
                  ? "opacity-30 cursor-not-allowed"
                  : ""
              } ${
                serviceRecordType === "Quick Job " && card.bay_name === "Lube"
                  ? "hidden"
                  : ""
              }`}
            >
              <BayCard
                status={card.status}
                img_url={card.img_url}
                img_description={card.img_description}
                bay_name={card.bay_name}
                url={card.ulr}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row sm:justify-end my-2 md:my-4 px-4 md:pr-4">
        <button
          onClick={onCancelBtn}
          className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
          type="button"
        >
          Back
        </button>
        <button
          onClick={onContinueBtn}
          disabled={isFinished}
          className={`${
            isFinished ? "opacity-30 cursor-not-allowed" : ""
          } mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto`}
          type="submit"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
