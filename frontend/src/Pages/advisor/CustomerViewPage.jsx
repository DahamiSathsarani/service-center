import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { vehicle_search } from "../../Api/VehicleAPI";
import CustomerCreateAndView from "../../Components/Forms/CustomerCreateAndView";
import VehiclesTable from "../../Components/Tables/VehiclesTable";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import { customer_view } from "../../Api/CustomerAPI";
import VehiclesHistoryTable from "../../Components/Tables/VehiclesHistoryTable";
import { old_vehicles_search } from "../../Api/OldCustomerAPI";

export default function CustomerViewPage({ userRole }) {
  const { customer_id } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [oldVehiclesData, setOldVehiclesData] = useState([]);

  const fetchCustomerDetails = useCallback(async () => {
    try {
      const response = await customer_view({ id: customer_id });
      if (response.status === 200) {
        setCustomerData(response.data.customer);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [customer_id]);

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await vehicle_search(customer_id, "customer_id");
      console.log("Vehicle", response.data.vehicles);
      if (response.status === 200) {
        setVehiclesData(response.data.vehicles);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [customer_id]);

  const fetchOldVehicleDetails = useCallback(async () => {
    try {
      const response = await old_vehicles_search(customer_id, "customer_id");
      console.log("Old vehicles", response.data);
      if (response.status === 200) {
        setOldVehiclesData(response.data.old_vehicles);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [customer_id]);

  useEffect(() => {
    fetchCustomerDetails();
    fetchVehicleDetails();
    fetchOldVehicleDetails();
  }, [fetchCustomerDetails, fetchVehicleDetails, fetchOldVehicleDetails]);

  return (
    <div>
      <NormalBackground
        title="Customer Details"
        componentName={CustomerCreateAndView}
        type="view"
        data={customerData}
      />
      {userRole !== "1" && (
        <NormalBackground
          title="Registered Vehicles"
          componentName={VehiclesTable}
          data={vehiclesData}
        />
      )}
      {userRole !== "1" && (
        <NormalBackground
          title="Vehicles History"
          componentName={VehiclesHistoryTable}
          data={oldVehiclesData}
        />
      )}
    </div>
  );
}
