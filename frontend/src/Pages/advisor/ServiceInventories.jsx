import { useCallback, useEffect, useState } from "react";
import { getAllServiceInventries } from "../../Api/ServiceInventriesAPI";
import { toast } from "react-toastify";
import InspectionsTable from "../../Components/Tables/InspectionsTable";

export default function ServiceInventories() {
  const [service_inventries, setServiceInventries] = useState([]);
  const [serviceInventryData, setServiceInventryData] = useState([]);
  const [inventory_type, setInventoryType] = useState("oil_fluid"); // Default type

  useEffect(() => {
    const get_all_service_inventries = async () => {
      try {
        const response = await getAllServiceInventries();
        if (response.status === 200) {
          setServiceInventries(response.data.inventries || []);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data || "Error fetching data");
      }
    };
    get_all_service_inventries();
  }, []);
  useEffect(() => {
    if (service_inventries.length > 0) {
      const filteredItems = service_inventries.filter(
        (item) => item.type === inventory_type
      );
      setServiceInventryData(filteredItems);
    }
  }, [inventory_type, service_inventries]);

  return (
    <div className="h-full pb-5">
      <div className="w-full h-full">
        <h2 className="text-xl font-bold text-center">Inspection</h2>
        {service_inventries.length > 0 ? (
          <div className="flex w-full h-full">
            {/* Sidebar Buttons */}
            <div className="flex w-[20%] flex-col justify-start border-r pr-3 border-r-black h-full">
              {[
                { type: "oil_fluid", label: "Oil & Fluids" },
                { type: "filters", label: "Filters" },
                { type: "mechanical", label: "Mechanical" },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  className={`${
                    inventory_type === type ? "shadow-lg bg-primary" : ""
                  } px-6 border py-3 font-semibold rounded-lg shadow-inner transition-all duration-300 hover:shadow-md active:shadow-none mb-3`}
                  onClick={() => setInventoryType(type)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Main Table */}
            <div className="mt-3 flex flex-col w-full items-center">
              <InspectionsTable
                className="overflow-hidden"
                data={serviceInventryData}
              />
              <div className="flex mt-3 w-full justify-between items-end px-4 sm:px-6">
                {/* Others Input Fields */}
                <div className="flex flex-col">
                  <p className="text-body_label mb-2">Others</p>
                  <div className="flex">
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center mr-5"
                      placeholder="item name"
                    />
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center"
                      placeholder="quantity"
                    />
                  </div>
                </div>
                <button className="submit-btn mt-4">Submit</button>
              </div>
            </div>
          </div>
        ) : (
          <p>Fetching Service Inventories...</p>
        )}
      </div>
    </div>
  );
}
