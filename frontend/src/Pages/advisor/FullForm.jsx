import { useEffect, useState, useRef } from "react";
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
import { FaTimes, FaDownload } from "react-icons/fa";
import UseInspectionTable from "../../Components/Tables/UseInspectionTable";
import html2pdf from "html2pdf.js";

export default function FullForm({ type, action }) {
  const [recordDetails, setRecordDetails] = useState([]);
  const [customerSign, setCustomerSign] = useState(false);
  const [signatureType, setSignatureType] = useState(null);
  const [finalInspection, setFinalInspection] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { record_id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const get_records = async () => {
    try {
      const response = await get_service_record({ record_id: record_id });
      if (response.status === 200) {
        setRecordDetails(response.data.record);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Error");
      console.log(error);
    }
  };

  const setFinalInspectionFunction = (data) => {
    setFinalInspection(data);
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
          navigate(`/advisor/service-record/${record_id}/bay-selection`);
        } else if (type === "2") {
          toast.success("Service is successfully completed!");
          navigate(`/advisor`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Error");
    }
  };

  const fetchTotalPrice = (price) => {
    setTotalPrice(price);
  };

  const downloadPDF = async () => {
    setIsDownloading(true);

    // Clone the content (don’t affect live DOM)
    const element = contentRef.current.cloneNode(true);

    // Remove unwanted sections from PDF
    const removeHeadings = [
      "Vehicle Damages",
      "Vehicle Handover",
      "Terms and Conditions",
    ];
    removeHeadings.forEach((title) => {
      const headings = Array.from(element.querySelectorAll("h1"));
      headings.forEach((h) => {
        if (h.textContent.trim() === title) {
          const section = h.closest("div");
          if (section) section.remove();
        }
      });
    });

    // ====== GLOBAL CONTAINER STYLING ======
    element.style.padding = "20px 24px";
    element.style.margin = "0 auto";
    element.style.background = "white";
    element.style.width = "100%";
    element.style.boxSizing = "border-box";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.lineHeight = "1.3";

    // ====== SECTION SPACING ======
    // Give consistent spacing between each block/section
    element.querySelectorAll("div").forEach((div) => {
      div.style.marginTop = "0";
      div.style.marginBottom = "0px"; // a clean gap between each section
      div.style.paddingTop = "0";
      div.style.paddingBottom = "0";
    });

   
    element.querySelectorAll("h1, h2, h3").forEach((h) => {
      h.style.marginTop = "18px"; // space before heading
      h.style.marginBottom = "12px"; // space between title and component/table
      h.style.fontWeight = "bold";
      h.style.color = "#000";
      h.style.fontSize = h.tagName === "H1" ? "18px" : "16px";
    });

    // ====== TABLES / COMPONENTS ======
    // Add breathing room below tables and fix any collapsed layout
    element.querySelectorAll("table").forEach((table) => {
      table.style.marginTop = "6px"; // space between title and table
      table.style.marginBottom = "16px"; // space after table before next section
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";
    });

    // Add consistent spacing for <p> or text sections if any
    element.querySelectorAll("p").forEach((p) => {
      p.style.marginTop = "6px";
      p.style.marginBottom = "10px";
    });

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `service_record_${recordDetails.id || record_id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 1200,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    get_records(record_id);
  }, [record_id]);

  return (
    <div>
      {/* Download Button */}
      {type === "2" &&
      <div className="flex justify-between items-center mb-4 px-2 w-[97%] md:w-[100%]">
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm ${
            isDownloading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaDownload />
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
}
      <div
        ref={contentRef}
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <NormalBackground
          title="Service Details"
          data={recordDetails}
          componentName={FullServiceDetails}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "8px",
            marginBottom: "8px",
            width: "100%",
            boxSizing: "border-box",
            gap: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "12px",
                color: "#000",
              }}
            >
              Vehicle Inventory
            </h1>
            <VehicleInventoryTable
              vehicleInventoryData={recordDetails.vehicle_inventorys}
              type={type}
            />
          </div>

          <div style={{ flex: "1 1 48%" }}>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "12px",
                color: "#000",
              }}
            >
              Service Inventory
            </h1>
            <UseInspectionTable
              serviceInventoryData={recordDetails.inspections}
              type="second"
            />
          </div>

          <div style={{ flex: "1 1 48%" }}>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "12px",
                color: "#000",
              }}
            >
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

          {/* The following sections stay visible in UI but are excluded from PDF */}
          {/* Vehicle Damages */}
          <div style={{ width: "100%", marginTop: "24px" }}>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "12px",
                color: "#000",
              }}
            >
              Vehicle Damages
            </h1>
            <div
              style={{
                border: "1px solid black",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${recordDetails.damages}`}
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "contain",
                  display: "block",
                }}
                alt="damage photo"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "24px",
            }}
          >
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "12px",
                color: "#000",
              }}
            >
              Terms and Conditions
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                border: "1px solid #ccc",
                width: "100%",
                padding: "16px",
                gap: "20px",
              }}
            >
              <ul
                style={{
                  listStyleType: "disc",
                  marginLeft: "20px",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  flex: 1,
                }}
              >
                <li>
                  I agree to pay for any addition material that may be used
                  during the service process.
                </li>
                <li>
                  I have compared the physical damages of the vehicle against
                  the body condition sheet.
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
              <div style={{ flexShrink: 0 }}>
                {recordDetails.customer_signature_start ? (
                  <div
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px 16px",
                      borderRadius: "4px",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/${recordDetails.customer_signature_start}`}
                      alt="customer signature"
                      style={{
                        width: "120px",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <button
                    className="mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn"
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

          {/* Vehicle Handover */}
          {type === "2" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "24px",
              }}
            >
              <h1
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "12px",
                  color: "#000",
                }}
              >
                Vehicle Handover
              </h1>
              <VehicleHandoverTable
                vehicleHandoverData={recordDetails.vehicle_handovers}
                record_id={record_id}
                action={action}
                finalInspection={setFinalInspectionFunction}
              />
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                  border: "1px solid #ccc",
                  padding: "16px 20px",
                  gap: "20px",
                }}
              >
                <p style={{ fontSize: "14px", flex: 1 }}>
                  I have Checked and taken delivery of my vehicle. no complaint
                </p>
                <div style={{ flexShrink: 0 }}>
                  {recordDetails.customer_signature_end ? (
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 16px",
                        borderRadius: "4px",
                      }}
                    >
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/${recordDetails.customer_signature_end}`}
                        alt="customer signature"
                        style={{
                          width: "112px",
                          height: "64px",
                          display: "block",
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      className="mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn"
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
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {action !== "view" && (
        <div className="w-full flex flex-col sm:flex-row sm:justify-end mt-2 md:mt-5">
          <button
            className="mobile_cancel-btn md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
            type="button"
            onClick={() => {
              navigate("/advisor/dashboard");
            }}
          >
            Cancel
          </button>
          <button
            className="mobile_cancel-btn md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
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
            } mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto`}
            onClick={onContinueBTn}
          >
            continue
          </button>
        </div>
      )}

      {/* Signature Modal */}
      {customerSign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[50%] md:w-[50%] h-[50%] p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-black"
              onClick={() => setCustomerSign(false)}
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
