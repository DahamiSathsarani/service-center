import React from "react";
import VehicleInventoryForm from "../../Components/Forms/VehicleInventoryForm";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

const VehicleInventory = ({ type }) => {
  return (
        <NormalBackground title="Inventory Management" componentName={VehicleInventoryForm} type={type}/>
  );
};

export default VehicleInventory;