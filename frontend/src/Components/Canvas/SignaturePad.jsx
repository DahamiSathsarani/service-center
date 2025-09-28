import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { set_e_signature } from "../../Api/ServiceRecordAPI";
import { useNavigate, useParams } from "react-router-dom";
import { setHandoverDetails } from "../../Api/VehicleHandoverAPI";

export default function SignaturePad({ data, type }) {
  const sigCanvas = useRef(null);
  const [signature, setSignature] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { record_id } = useParams();
  // Function to clear the signature pad
  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignature(null);
    }
  };
  const setESignature = async (signature) => {
    if (signature) {
      try {
        if (type === "first" || type === "second") {
          const response = await set_e_signature({
            service_no: record_id,
            type: type,
            signature: signature,
          });
          if (response.status === 200) {
            toast.success("E signature Add successfully");
            navigate(0);
          }
        } else if (type === "wheels_inspect" || type === "final_finishing") {
          const now = new Date();
          const formattedTime = `${String(now.getHours()).padStart(
            2,
            "0"
          )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
            now.getSeconds()
          ).padStart(2, "0")}`;

          console.log(formattedTime);

          const response = await setHandoverDetails({
            service_no: record_id,
            type: type,
            signature: signature,
            data: data,
            time: formattedTime,
          });
          if (response.status === 200) {
            toast.success("E signature Add successfully");
            navigate(0);
          }
        }
      } catch (error) {
        toast.error(error.response.data.message || "Internal Error");
      }
    }
  };
  // Function to save the signature as an image (base64) and send to API
  const saveSignature = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      toast.error("Please provide a signature first.");
      return;
    }

    try {
      setIsSaving(true);

      // Ensure getTrimmedCanvas is available before calling it
      let trimmedCanvas;
      if (sigCanvas.current.getTrimmedCanvas) {
        trimmedCanvas = sigCanvas.current
          .getTrimmedCanvas()
          .toDataURL("image/png");
      } else {
        trimmedCanvas = sigCanvas.current.toDataURL("image/png");
      }

      setSignature(trimmedCanvas);

      // Send signature to API
      setESignature(trimmedCanvas);
    } catch (error) {
      toast.error("Error capturing signature.");
      console.error("Signature Save Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // API call function
  const setCustomerESignature = async (signatureData) => {
    try {
      const response = await set_e_signature({
        type,
        signature: signatureData,
      });

      if (response.status === 200) {
        toast.success("E-Signature added successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to save signature.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal error occurred.");
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 600,
          height: 200,
          className: "signature-canvas border rounded-md",
          willReadFrequently: true, // Add this line to optimize read operations
        }}
      />
      <div className="flex justify-end mt-3">
        <button onClick={clearSignature} className="cancel-btn h-[2.5rem] mr-3">
          Clear
        </button>
        <button
          onClick={saveSignature}
          className="submit-btn h-[2.5rem]"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
