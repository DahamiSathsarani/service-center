import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function VehiclesHistoryTable({ data }) {
  const vehicles = data || [];
  const navigate = useNavigate();

  return (
    <div className="bg-background py-6 px-4 sm:px-6">
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
                    {vehicle?.vehicle_number}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle?.vehicle?.type}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle?.vehicle?.brand}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle?.vehicle?.model}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle?.vehicle?.fuel_type}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {vehicle?.vehicle?.engine_number}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t"
                >
                  No Old Vehicles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
