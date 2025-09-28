import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import CameraCapture from "../../Components/Camera/CameraCapture";

export default function TakePhotoPage() {
    const navigate = useNavigate();
    const { service_no } = useParams();

  return (
    <div>
        <NormalBackground
            title="Take Damage Photos"
            componentName={CameraCapture}
            service_no={service_no}
        />

    <div
        className= "flex w-full mt-5 justify-end" 
      >
        <button
          className="cancel-btn me-5"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
        <button
          className="submit-btn"
          onClick={() => {
            navigate(`/advisor/${service_no}/vehicleinventory/create`);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
