import React, { useState, useEffect } from "react";
import {
  inventory_create,
  inventory_update,
  getInventoryByServiceNo,
} from "../../Api/VehicleInventoryAPI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get_service_record } from "../../Api/ServiceRecordAPI";

const VehicleInventoryForm = ({ type }) => {
  const navigate = useNavigate();
  const { service_no } = useParams();
  const [serviceRecordType, setServiceRecordType] = useState(null);

  const inventoryItems = [
    "Jacks",
    "Jack Leaver",
    "Spare Wheel",
    "Wheel Brace",
    "Inflator and Gum",
    "Rubber Carpets",
    "Fabric Carpets",
    "3M Carpets",
    "Other Carpets",
  ];

  const [formData, setFormData] = useState({
    service_no: service_no || "",
    items: inventoryItems.map((item) => ({
      item,
      no_of_items_in: 0,
      no_of_items_out: 0,
    })),
  });
  const get_service_record_details = async () => {
    try {
      const response = await get_service_record({ record_id: service_no });
      if (response.status === 200) {
        setServiceRecordType(
          response.data.record.service_records_package[0].package.job_type
            .job_type
        );
      }
    } catch (error) {
      console.log(error.response.data.message || "Internal Server Error");
    }
  };
 
  // Fetch inventory data when in update mode and service_no is provided
  useEffect(() => {
    get_service_record_details();
    if (type === "update" && service_no) {
      const fetchInventory = async () => {
        try {
          const response = await getInventoryByServiceNo(service_no);
          if (response.data) {
            const updatedItems = response.data.inventory
              .map((i) => ({
                item: i.item,
                no_of_items_in: i.no_of_items_in,
                no_of_items_out: i.no_of_items_out || 0,
              }))
              .filter((i) => i.no_of_items_in > 0);

            setFormData({ service_no, items: updatedItems });
          }
        } catch (error) {
          toast.error("Failed to fetch inventory data");
        }
      };
      fetchInventory();
    }
  }, [service_no, type]);

  // Handle increment/decrement
  const handleIncrement = (index, field) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] += 1;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleDecrement = (index, field) => {
    const updatedItems = [...formData.items];
    if (updatedItems[index][field] > 0) {
      updatedItems[index][field] -= 1;
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Being Sent:", formData); // Debugging
    try {
      let response;
      if (type === "create") {
        response = await inventory_create(formData);
      } else if (type === "update") {
        response = await inventory_update(formData);
      }
      console.log(response.status,"response.status")
      if (response.status === 200) {
        toast.success( "Records updated successfully");
        if (type === "create") {
          if (serviceRecordType === "Full Service") {
            navigate(`/advisor/service-record/${service_no}/service-inventory`);
          } else {
            navigate(`/advisor/service-record/${service_no}/details/1`);
          }
        } else if (type === "update") {
          navigate(`/advisor/service-record/${service_no}/details/2`);
        }
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.log("test")
      if (error.response && error.response.status === 422) {
        const errors = error.response.data;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg px-6 py-2"
    >
      <div className="space-y-6 items-center align-middle">
        <div className="grid grid-cols-3 gap-8 font-bold text-gray-700 border-b pb-2">
          <div>Item</div>
          <div className={`${type === "update" ? "hidden" : "block"}`}>No of Items In</div>
          <div className={`${type === "update" ? "block" : "hidden"}`}>
            No of Items Out
          </div>
        </div>

        {formData.items.map((itemData, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-8 items-center text-gray-700 border-b-2 pb-2"
          >
            <div className="text-gray-800">{itemData.item}</div>

           {type === "create" && (
            <div className="flex items-center text-center space-x-6">
                <>
                  <button
                    type="button"
                    onClick={() => handleDecrement(index, "no_of_items_in")}
                    className="px-3 py-1 border-amber-500 border-2 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-center items-center w-4 font-bold">
                    {itemData.no_of_items_in}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(index, "no_of_items_in")}
                    className="px-3 py-1 bg-amber-500 rounded-md border-amber-500 border-2"
                  >
                    +
                  </button>
                </>
            </div>
           )}

            {type === "update" && (
              <div className="flex items-center text-center space-x-6">
                <>
                  <button
                    type="button"
                    onClick={() => handleDecrement(index, "no_of_items_out")}
                    className="px-3 py-1 border-amber-500 border-2 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-center w-4 font-bold">
                    {itemData.no_of_items_out}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(index, "no_of_items_out")}
                    className="px-3 py-1 bg-amber-500 rounded-md border-amber-500 border-2"
                  >
                    +
                  </button>
                </>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </div>
    </form>
  );
};

export default VehicleInventoryForm;
