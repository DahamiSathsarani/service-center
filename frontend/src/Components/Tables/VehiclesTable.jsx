import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function VehiclesTable({ data }) {
  const { customer_id } = useParams();
  const vehicles = data || [];
  const navigate = useNavigate();

  const handleAddNewVehicle = () => {
    navigate(`/advisor/customer/${customer_id}/vehicle/create`);
  };

  return (
    <div className="bg-background py-6 px-4 sm:px-6">
      <div className="flex justify-end">
        <button
          className="mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
          onClick={handleAddNewVehicle}
        >
          Add New Vehicle
        </button>
      </div>
      <div className="mt-8 flex flex-col">
        <table className="w-full table-fixed border-collapse border border-gray-300 font-body">
          <thead>
            <tr className="bg-gray-200 text-body_label">
              <th className="border px-3 py-2 text-center">Vehicle Number</th>
              <th className="border px-3 py-2 text-center">Type</th>
              <th className="border px-3 py-2 text-center">Brand</th>
              <th className="border px-3 py-2 text-center">Model</th>
              <th className="border px-3 py-2 text-center">Fuel Type</th>
              <th className="border px-3 py-2 text-center">Engine Number</th>
              <th className="border px-3 py-2 text-center">
                License Expire Date
              </th>
              <th className="border px-3 py-2 text-center">
                Insurance Expire Date
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.vehicle_number}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    navigate(
                      `/advisor/vehicle/${vehicle.vehicle_number}/view`,
                      { state: { vehicle } }
                    )
                  }
                >
                  <td className="border px-3 py-2 text-center">
                    {vehicle.vehicle_number}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.type}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.brand}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.model}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.fuel_type}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.engine_number}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.license_expire_date}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle.insurence_expire_date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t"
                >
                  No Registered Vehicles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
