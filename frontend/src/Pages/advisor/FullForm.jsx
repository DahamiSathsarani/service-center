import { useEffect, useState } from "react";
import FullServiceDetails from "../../Components/Forms/FullServiceDetails";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import SignaturePad from "../../Components/Canvas/SignaturePad";
import {
  get_service_record,
  update_record_details,
} from "../../Api/ServiceRecordAPI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import VehicleInventoryTable from "../../Components/Tables/VehicleInventoryTable";
import TotalPriceTable from "../../Components/Tables/TotalPriceTable";
import VehicleHandoverTable from "../../Components/Tables/VehicleHandoverTable";
import { FaTimes } from "react-icons/fa";
import UseInspectionTable from "../../Components/Tables/UseInspectionTable";

export default function FullForm({ type, action }) {
  const [recordDetails, setRecordDetails] = useState([]);
  const [customerSign, setCustomerSign] = useState(false);
  const [signatureType, setSignatureType] = useState(null);
  const [finalInspection, setFinalInspection] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { record_id } = useParams();
  const navigate = useNavigate();
  const get_records = async () => {
    try {
      const response = await get_service_record({ record_id: record_id });
      if (response.status == 200) {
        setRecordDetails(response.data.record);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Internal Error");
      console.log(error);
    }
  };
  const setFinalInspectionFunction = (data) => {
    setFinalInspection(data);
    console.log(data);
  };

  const jobType = recordDetails?.service_records_package?.[0]?.package?.job_type?.job_type;

  const onContinueBTn = async () => {
    try {
      const response = await update_record_details(
        { type: type, price: totalPrice },
        record_id
      );
      if (response.status === 200) {
        if (type === "1") {
          if (response.status === 200) {
            navigate(`/advisor/service-record/${record_id}/bay-selection`);
          }
        } else if (type === "2") {
          toast.success("Service is successfully completed!");
          navigate(`/advisor`);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message || "Internal Error");
    }
  };
  const fetchTotalPrice = (price) => {
    setTotalPrice(price);
  };
  useEffect(() => {
    get_records(record_id);
  }, [record_id]);

  return (
    <div>
      <NormalBackground
        title="Service Details"
        data={recordDetails}
        componentName={FullServiceDetails}
      />
      <div className="flex flex-col bg-white px-2  w-[97%] md:w-[100%] sm:p-6 shadow-md rounded-lg mb-2">
        <div className="flex  justify-between ">
          <div className="w-[45%]">
            <h1 className="font-bold text-center md:text-start text-black font-sub_heading text-mobile_sub_heading sm:text-tab_sub_heading lg:text-sub_heading">
              Vehicle Inventory
            </h1>
            <VehicleInventoryTable
              vehicleInventoryData={recordDetails.vehicle_inventorys}
              type={type}
            />
          </div>

          <div className="w-[45%]">
            <h1 className="font-bold text-center md:text-start text-black font-sub_heading text-mobile_sub_heading sm:text-tab_sub_heading lg:text-sub_heading mb-3">
              Vehicle Damages
            </h1>
            <div className="border border-black rounded">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${recordDetails.damages}`}
                className="w-[25rem] h-[15rem]"
                alt="damage photo"
              />
            </div>
          </div>
        </div>
        <div className="flex  justify-between mt-3">
          <div className="w-[45%]">
            <h1 className="font-bold text-center md:text-start text-black font-sub_heading text-mobile_sub_heading sm:text-tab_sub_heading lg:text-sub_heading">
              Service Inventory
            </h1>
            <UseInspectionTable
              serviceInventoryData={recordDetails.inspections}
              type="second"
            />
          </div>
          <div className="w-[40%]">
            <h1 className="font-bold text-center md:text-start text-black font-sub_heading text-mobile_sub_heading sm:text-tab_sub_heading lg:text-sub_heading mb-3">
              Amount
            </h1>
            <TotalPriceTable
              totalPriceData={{
                package: recordDetails.service_records_package,
                inspection: recordDetails.inspections,
              }}
              getTotalPrice={fetchTotalPrice}
            />
          </div>
        </div>
        <div className="flex flex-col mt-3">
          <h1 className="font-bold text-center md:text-start text-black font-sub_heading text-mobile_sub_heading sm:text-tab_sub_heading lg:text-sub_heading mb-3">
            Terms and Conditions
          </h1>
          <div className="flex justify-start items-end border w-full px-4 py-3">
            <ul className="list-disc ml-5 text-mobile_body_label md:text-tab_body_label lg:text-body_label me-10">
              <li>
                I agree to pay for any addition material that may be used during
                the service process.
              </li>
              <li>
                I have compared the physical damages of the vehicle against the
                body condition sheet.
              </li>
              <li>
                All valuables have been removed from the vehicle.(money,mobile
                phone etc)
              </li>
              <li>
                The management of EasyCare will not be held responsible for
                losses of any personal belongings.
              </li>
              <li>
                I have read and understood the customs notice given by the
                service adviser.
              </li>
            </ul>
            <div>
              {recordDetails.customer_signature_start ? (
                <div className="border py-2 px-4 rounded">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${recordDetails.customer_signature_start}`}
                    alt="customer signature"
                  />
                </div>
              ) : (
                <button
                  className="mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn "
                  onClick={() => {
                    setCustomerSign(true);
                    setSignatureType("first");
                  }}
                >
                  Customer Signature
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={`${type === "2" ? "flex flex-col mt-3" : "hidden"}`}>
          <h1 className="font-bold text-center md:text-start text-black font-sub_heading text-mobile_sub_heading sm:text-tab_sub_heading lg:text-sub_heading mb-3">
            Vehicle Handover
          </h1>
          <VehicleHandoverTable
            vehicleHandoverData={recordDetails.vehicle_handovers}
            jobType={jobType}
            record_id={record_id}
            action={action}
            finalInspection={setFinalInspectionFunction}
          />
          <div className="flex w-full justify-start items-center mt-5 border py-4 px-5">
            <p>I have Checked and taken delivery of my vehicle. no complaint</p>
            <div className="ms-10">
              {recordDetails.customer_signature_end ? (
                <div className="border py-2 px-4 rounded">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${recordDetails.customer_signature_end}`}
                    alt="customer signature"
                    className="w-[7rem] h-[4rem]"
                  />
                </div>
              ) : (
                <button
                  className="mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn "
                  onClick={() => {
                    setCustomerSign(true);
                    setSignatureType("second");
                  }}
                >
                  Customer Signature
                </button>
              )}
            </div>
          </div>
        </div>
        {action !== "view" && (    
          <div className="w-full flex flex-col sm:flex-row sm:justify-end mt-2 md:mt-5">
            <button
              className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
              type="button"
              onClick={() => {
                navigate('/advisor/dashboard');
              }}
            >
              Cancel
            </button>
            <button
              className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </button>
            <button
              disabled={
                (!recordDetails.customer_signature_start && type === "1") ||
                (!recordDetails.customer_signature_end && type === "2") ||
                (!finalInspection && type === "2")
              }
              className={`${
                (!recordDetails.customer_signature_start && type === "1") ||
                (!recordDetails.customer_signature_end && type === "2") ||
                (!finalInspection && type === "2")
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto`}
              onClick={onContinueBTn}
            >
              continue
            </button>
          </div>
        )}
      </div>
      {customerSign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[50%] md:w-[50%] h-[50%] p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-black"
              onClick={() => setCustomerSign(false)} // Close modal
            >
              <FaTimes />
            </button>
            <div className="w-full h-full flex justify-center items-center">
              <SignaturePad type={signatureType} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
