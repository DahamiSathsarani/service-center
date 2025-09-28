import React, { useCallback, useEffect, useState } from "react";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import { vehicle_get_all } from "../../Api/VehicleAPI";
import VehicleTable from "../../Components/Tables/VehicleTable";

export default function VehicleViewPage({ userRole }) {
  const [vehiclesData, setVehiclesData] = useState([]);

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await vehicle_get_all();
      console.log("Vehicles", response.data.vehicle);

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
    <div>
      <NormalBackground
        title="All Vehicles"
        componentName={VehicleTable}
        data={vehiclesData}
        userRole={userRole}
      />
    </div>
  );
}
