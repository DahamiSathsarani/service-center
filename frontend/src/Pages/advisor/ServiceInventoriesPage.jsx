import { useEffect, useState } from "react";
import { getAllServiceInventries } from "../../Api/ServiceInventriesAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ServiceInventoryTable from "../../Components/Tables/ServiceInventoryTable";

export default function ServiceInventoriesPage() {
  const [service_inventries, setServiceInventries] = useState([]);
  const [serviceInventryData, setServiceInventryData] = useState([]);
  const [inventory_type, setInventoryType] = useState("oil_fluid"); // Default type
  const { record_id } = useParams();

  // ✅ Fetch service inventories first
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

  // ✅ Fetch data once when component loads
  useEffect(() => {
    const fetchData = async () => {
      await get_all_service_inventries(); //  Fetch inventories first
    };
    fetchData();
  }, [record_id]); //  Only runs when `service_no` changes

  // ✅ Filter data when inventory type changes
  useEffect(() => {
    const filteredItems = service_inventries.filter(
      (item) => item.service_inventory_id !== 92 && item.type === inventory_type
    );
    setServiceInventryData(filteredItems);
  }, [inventory_type, service_inventries, record_id]);
  const serviceInventoryElement = (
    <div className="h-full pb-5">
      <div className="w-full h-full">
        {service_inventries.length > 0 ? (
          <div className="flex w-full h-full">
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
            <div className="mt-3 flex flex-col w-full items-center">
              <ServiceInventoryTable
                className="overflow-hidden"
                data={serviceInventryData}
              />
            </div>
          </div>
        ) : (
          <p>Fetching Service Inventories...</p>
        )}
      </div>
    </div>
  );
  return (
    <div>
      <h1 className="font-bold text-center md:text-start text-black font-heading text-mobile_heading sm:text-tab_heading lg:text-heading mb-4 mt-5">
        Service Inventories
      </h1>
      <div className="bg-white px-2 py-3 w-[97%] md:w-[100%] sm:p-6 shadow-md rounded-lg mb-2">
        {serviceInventoryElement}
      </div>
    </div>
  );
}
