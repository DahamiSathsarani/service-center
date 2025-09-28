import React from "react";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import Inspection from "./Inspection";
import { useNavigate, useParams } from "react-router-dom";


export default function InspectionBeginPage() {
  const navigate = useNavigate();
  const { record_id } = useParams();
  return (
    <div>
      <NormalBackground
        title="Inspections"
        componentName={Inspection}
        data="1"
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
            navigate(`/advisor/service-record/${record_id}/details/1`);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
