import { useEffect, useState } from "react";
import {
  create_and_update_inspection,
  get_inspection,
  getAllServiceInventries,
} from "../../Api/ServiceInventriesAPI";
import { toast } from "react-toastify";
import InspectionsTable from "../../Components/Tables/InspectionsTable";
import { useNavigate, useParams } from "react-router-dom";

export default function Inspection({ data, type }) {
  const [service_inventries, setServiceInventries] = useState([]);
  const [serviceInventryData, setServiceInventryData] = useState([]);
  const [inventory_type, setInventoryType] = useState("oil_fluid"); // Default type
  const [updatedInspection, setUpdatedInspection] = useState([]);
  const { record_id } = useParams();
  const [otherInspections, setOtherInspections] = useState({
    other_item_name: "",
    other_quantity: "",
    other_rmk: "C",
    other_comment: "",
  });

  const navigate = useNavigate();

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

  // ✅ Fetch inspection data AFTER inventories are loaded
  const get_service_inspection = async () => {
    try {
      const response = await get_inspection({ service_no: record_id });

      if (response.status === 200) {
        if (response.data.inspection_items) {
          console.log(
            "response.data.inspection_items",
            response.data.inspection_items
          );

          // ✅ Update service inventories
          setServiceInventries((prevInventories) =>
            prevInventories.map((item) => {
              const inspectionItem = response.data.inspection_items.find(
                (unit) =>
                  unit.service_inventory_id === item.service_inventory_id
              );

              return inspectionItem
                ? {
                    ...item,
                    qty: inspectionItem.quantity,
                    rmk: inspectionItem.remark,
                  }
                : item;
            })
          );

          // ✅ Check if `service_inventory_id === 92` exists & update `otherInspections`
          const item92 = response.data.inspection_items.find(
            (item) => item.service_inventory_id === 92
          );

          if (item92) {
            console.log("item92", item92);
            setOtherInspections({
              other_item_name: item92.item || "",
              other_quantity: item92.quantity || "",
              other_rmk: item92.remark || "C",
              other_comment: item92.comment || "",
              other_price: item92.price || "",
            });
          }
        }
        console.log("ttt", otherInspections);
      }
    } catch (error) {
      console.error("Error fetching service inspection:", error);
    }
  };

  // ✅ Fetch data once when component loads
  useEffect(() => {
    const fetchData = async () => {
      await get_all_service_inventries(); //  Fetch inventories first

      if (record_id) {
        await get_service_inspection(); //  Then fetch inspection data
      }
    };

    fetchData();
  }, [record_id]); //  Only runs when `service_no` changes

  // ✅ Filter data when inventory type changes
  useEffect(() => {
    const other_items = service_inventries.filter(
      (item) => item.service_inventory_id === 92
    );
    const filteredItems = service_inventries.filter(
      (item) => item.service_inventory_id !== 92 && item.type === inventory_type
    );
    setServiceInventryData(filteredItems);
    setOtherInspections(other_items);
    console.log("otherInspections", otherInspections);
  }, [inventory_type, service_inventries, record_id]);
  //other section change handle
  const changeHandle = (e) => {
    const { name, value } = e.target;
    setOtherInspections((prev) => ({
      ...prev, // Preserve existing values
      [name]: value, // Update the changed field
    }));
  };

  useEffect(() => {
        const userAction = JSON.parse(localStorage.getItem('userAction'));
    
        if (userAction) {
          if (userAction.action === 'success') {
            toast.success(`Items added successfully`);
          } 
    
          localStorage.removeItem('userAction');
        }
    }, []);

  // ✅ Submit Data
  const onSubmitData = async () => {
    try {
      // Ensure all fields exist, even if empty
      const formattedOtherInspections = {
        other_item_name: otherInspections.other_item_name || "",
        other_quantity: otherInspections.other_quantity || "",
        other_rmk: otherInspections.other_rmk || "C",
        other_comment: otherInspections.other_comment || "",
        other_price: otherInspections.other_price || "",
      };

      const response = await create_and_update_inspection({
        inspections: updatedInspection,
        others: formattedOtherInspections,
        record_id: record_id,
        type: type,
      });

      if (response.status === 200) {
        localStorage.setItem('userAction', JSON.stringify({ action: 'success' }));
/*         navigate(0);
 */      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="h-full pb-5">
      <div className="w-full h-full">
        <h2
          className={`${
            data === "1" ? "hidden" : ""
          } text-xl font-bold text-center`}
        >
          Inspection
        </h2>
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
            <div
              className={`${
                data === "1" ? "mt-0" : "mt-3"
              } flex flex-col w-full items-center`}
            >
              <InspectionsTable
                className="overflow-hidden"
                data={serviceInventryData}
                onUpdate={setUpdatedInspection}
              />
              <div className="flex mt-3 w-full justify-between items-end px-4 sm:px-6">
                {/* Others Input Fields */}
                <div className="flex w-full flex-col">
                  <p className="text-body_label mb-2">Others</p>
                  <div className="flex w-full justify-between">
                    <div className="flex flex-col w-[10rem] me-3">
                      <label className="text-mobile_body_label sm:text-body_label lg:text-body_label">
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="text-mobile_body_label sm:text-body_label lg:text-body_label w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center mr-5"
                        placeholder="Item Name"
                        name="other_item_name"
                        value={otherInspections.other_item_name}
                        onChange={changeHandle}
                      />
                    </div>
                    <div className="flex flex-col w-[8rem] me-3">
                      <label className="text-mobile_body_label sm:text-body_label lg:text-body_label">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="text-mobile_body_label sm:text-body_label lg:text-body_label w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center mr-5"
                        placeholder="Quantity"
                        name="other_quantity"
                        value={otherInspections.other_quantity}
                        onChange={changeHandle}
                      />
                    </div>
                    <div className="flex flex-col w-[5rem] me-3">
                      <label className="text-mobile_body_label sm:text-body_label lg:text-body_label">
                        Remark
                      </label>
                      <select
                        onChange={changeHandle}
                        name="other_rmk"
                        value={otherInspections.other_remark}
                        className="text-mobile_body_label sm:text-body_label lg:text-body_label w-full rounded-md border  border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all"
                      >
                        <option value="C">C</option>
                        <option value="R">R</option>
                        <option value="I">I</option>
                        <option value="CL">CL</option>
                        <option value="T">T</option>
                        <option value="NR">NR</option>
                        <option value="OK">OK</option>
                      </select>
                    </div>
                    <div className="flex flex-col w-[8rem] me-3">
                      <label className="text-mobile_body_label sm:text-body_label lg:text-body_label">
                        Price
                      </label>
                      <input
                        type="number"
                        value={otherInspections.other_price}
                        className="text-mobile_body_label sm:text-body_label lg:text-body_label w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center"
                        placeholder="Price"
                        name="other_price"
                        onChange={changeHandle}
                      />
                    </div>
                    <div className="flex flex-col w-[14rem] me-3">
                      <label className="text-mobile_body_label sm:text-body_label lg:text-body_label">
                        Comment
                      </label>
                      <input
                        type="text"
                        value={otherInspections.other_comment}
                        className="text-mobile_body_label sm:text-body_label lg:text-body_label w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center"
                        placeholder="Comment"
                        name="other_comment"
                        onChange={changeHandle}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end px-4 sm:px-6">
                <button className="submit-btn mt-4" onClick={onSubmitData}>
                  Submit
                </button>
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
