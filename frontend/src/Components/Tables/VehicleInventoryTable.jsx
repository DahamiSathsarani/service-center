import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function VehicleInventoryTable({ vehicleInventoryData, type }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(
      vehicleInventoryData?.filter((element) => element.no_of_items_in !== 0)
    );
    console.log(data);
  }, [vehicleInventoryData]);

  return (
    <div className="bg-background ">
      <div className="mt-8 flex flex-col">
        <table className="w-full table-fixed border-collapse border border-black font-body">
          <thead className="w-full">
            <tr className="bg-gray-200 text-mobile_body_label lg:text-body_label sm:text-tab_body_label w-full">
              <th className="border w-[60%] border-black px-3 py-2 text-center">Item</th>
              <th className="border border-black px-3 py-2 text-center">In</th>
              <th
                className={`${
                  type === "2" ? "" : "hidden"
                } border border-black px-3 py-2 text-center`}
              >
                Out
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((unit) => (
                <tr className="text-mobile_body lg:text-body sm:text-tab_body">
                  <td className="border border-black px-3 py-2 text-center ">
                    {unit.item}
                  </td>
                  <td className="border border-black px-3 py-2 text-center">
                    {unit.no_of_items_in}
                  </td>
                  <td
                    className={`${
                      type === "2" ? "" : "hidden"
                    } border border-black px-3 py-2 text-center`}
                  >
                    {unit.no_of_items_out}
                  </td>
                </tr>
              ))
            ) : (
              <div className="text-center w-full text-mobile_body lg:text-body sm:text-tab_body">                
                  No Vehicle Inventory                
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
