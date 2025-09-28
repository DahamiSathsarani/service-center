import React, { useCallback, useEffect, useState } from "react";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import { vehicle_get_all, vehicle_search } from "../../Api/VehicleAPI";
import VehicleCreateAndViewForm from "../../Components/Forms/VehicleCreateAndViewForm";
import { useParams } from "react-router-dom";

export default function VehicleUpdatePage({ userRole }) {
  const [vehiclesData, setVehiclesData] = useState([]);
  const { vehicle_number } = useParams();

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await vehicle_search(vehicle_number,"vehicle_number");
      console.log("Vehicle", response.data);

      if (response.status === 200) {
        setVehiclesData(response.data.vehicle);
      }
    } catch (error) {
      console.error("Error fetching Vehicle details:", error);
    }
  }, []);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails, userRole]);

  return (
    <NormalBackground
      title="Vehicle Details"
      componentName={VehicleCreateAndViewForm}
      type="update"
      userRole={userRole}
      data={vehiclesData}
    />
  );
}
