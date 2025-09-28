import React from "react";
import { useLocation } from "react-router-dom";
import CustomerCreateAndView from "../../Components/Forms/CustomerCreateAndView";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

export default function CustomerCreatePage({userRole}) {
  const location = useLocation();
  const type = location.state?.type;

  return (
    <NormalBackground
      title="Customer Details"
      componentName={CustomerCreateAndView}
      userRole={userRole}
      type={type}
    />
  );
}
