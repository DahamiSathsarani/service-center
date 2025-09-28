import React from "react";
import VehicleCreateAndViewForm from "../../Components/Forms/VehicleCreateAndViewForm";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

export default function VehicleCreatePage({ userRole }) {
  return (
    <NormalBackground
      title="Register New Vehicle"
      componentName={VehicleCreateAndViewForm}
      type="create"
      userRole={userRole}
    />
  );
}
