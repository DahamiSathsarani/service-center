import React from "react";
import { useParams } from "react-router-dom";
import ServiceTypeSelectForm from "../../Components/Forms/ServiceTypeSelectForm";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

export default function ServiceRecordCreatePage() {
  const { vehicle_number } = useParams();

  return (
    <div>
      <NormalBackground
        title="New Service Record"
        componentName={ServiceTypeSelectForm}
        vehicle_number={vehicle_number}
      />
    </div>
  );
}
