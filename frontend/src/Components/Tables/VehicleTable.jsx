import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { vehicle_update } from "../../Api/VehicleAPI";
import TableSearch from "../Common/TableSearch";
import useTableSearch from "../../Hooks/useTableSearch";

export default function VehicleTable({ data }) {
  const vehicles = data || [];
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredData } = useTableSearch(data || [], [
    'vehicle_number'
  ])

  useEffect(() => {
    console.log("hh", vehicles);
  }, [data]);
  const handleCreateNewVehicle = () => {
    navigate(`/admin/vehicle/create`);
  };

  const handleEditVehicle = (vehicle_number) => {
    navigate(`/admin/vehicle/${vehicle_number}/update`);
  };

  const handleActiveInactiveVehicle = async (vehicle_number, status) => {
    try {
      const response = await vehicle_update({
        vehicle_number: vehicle_number,
        status: status,
      });
      if (response?.status === 200) {
        console.log(response.data.customer);
        toast.success("Vehicle status is Changed Successfully");
        navigate(0);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Internal Error");
    }
  };

  return (
    <div className="bg-background  py-6 px-4 sm:px-6  xl:px-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-auto">
                <button
                  className="mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
                  onClick={handleCreateNewVehicle}
                >
                  Create New Vehicle
                </button>
              </div>
              <div className="w-full sm:w-64">
                <TableSearch 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder="Search Vehicle..."
                />
              </div>
            </div>
      <div className="mt-8 flex flex-col">
        <div>
          <table className="w-full table-fixed border-collapse border border-gray-300 font-body min-w-[1024px]">
            <thead>
              <tr className="bg-gray-200 text-body_label">
                <th className="border px-3 py-2 text-center">Vehicle Number</th>
                <th className="border px-3 py-2 text-center">Vehicle Brand</th>
                <th className="border  px-3 py-2 text-center">Vehicle Model</th>
                <th className="border px-3 py-2 text-center">Customer Name</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((vehicle) => {
                  return (
                    <tr key={vehicle?.vehicle_number}>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {vehicle?.vehicle_number}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {vehicle?.brand}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md">
                        {vehicle?.model}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {vehicle?.customer?.first_name}{" "}
                        {vehicle?.customer?.last_name}
                      </td>
                      <td className="border px-3 py-2 flex justify-center items-center h-[6rem] text-sm xl:text-md">
                        <button
                          className={`${
                            vehicle?.status === "ACTIVE"
                              ? "bg-green-100 text-green-500 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                              : vehicle.status === "INACTIVE"
                              ? "bg-red-100 text-red-500 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                              : "bg-gray-200 text-gray-700 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                          }`}
                        >
                          {vehicle?.status}
                        </button>
                      </td>
                      <td className="border px-3 py-2 text-center flex-col xl:flex-row space-y-2 xl:space-y-0 justify-center space-x-2 font-bold">
                        <button
                          onClick={() =>
                            handleEditVehicle(vehicle?.vehicle_number)
                          }
                          disabled={vehicle?.status === "INACTIVE"}
                          className={`${
                            vehicle?.status === "INACTIVE"
                              ? "opacity-55 cursor-not-allowed"
                              : ""
                          } bg-blue-700 hover:bg-blue-700 text-white py-1 mb-1 px-3 rounded text-sm`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleActiveInactiveVehicle(
                              vehicle?.vehicle_number,
                              vehicle?.status === "ACTIVE"
                                ? "INACTIVE"
                                : "ACTIVE"
                            )
                          }
                          className={`${
                            vehicle?.status === "ACTIVE"
                              ? "bg-red-500 hover:bg-red-500 text-white w-[80px]"
                              : "bg-green-500 hover:bg-green-500 text-white w-[80px]"
                          } py-1 px-3 rounded text-sm `}
                        >
                          {vehicle?.status === "ACTIVE" ? "Delete" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t">
                    {searchTerm ? "No matching vehicle found" : "No Registered Vehicles"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
