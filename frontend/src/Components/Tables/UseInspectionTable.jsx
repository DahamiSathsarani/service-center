import React, { useEffect, useState } from "react";

export default function UseInspectionTable({ serviceInventoryData }) {
  const [data, setData] = useState([]);
  const [other_data, setOtherData] = useState([]);
  useEffect(() => {
    setData(
      serviceInventoryData?.filter(
        (element) => element.service_inventory_id !== 92
      )
    );
    setOtherData(
      serviceInventoryData?.filter(
        (element) => element.service_inventory_id === 92
      )
    );
    console.log(data);
  }, [serviceInventoryData]);

  return (
    <div className="bg-background ">
      <div className="mt-8 flex flex-col">
        <table className="w-full table-fixed border-collapse border border-black font-body">
          <thead className="w-full">
            <tr className="bg-gray-200 text-mobile_body_label lg:text-body_label sm:text-tab_body_label w-full">
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Name
              </th>
              <th className="border border-black px-3 py-2 text-center">RMK</th>
              <th className="border w-[20%] border-black px-3 py-2 text-center">
                Item code
              </th>
              <th className="border border-black px-3 py-2 text-center">Qty</th>
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Total price
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              <>
                {data.map((unit, index) => (
                  <tr
                    key={index}
                    className="text-mobile_body lg:text-body sm:text-tab_body"
                  >
                    <td className="border border-black px-3 py-2 text-start">
                      {unit.service_inventory.item_name}
                    </td>
                    <td className="border border-black px-3 py-2 text-start">
                      {unit.remark}
                    </td>
                    <td className="border border-black px-3 py-2 text-start">
                      {unit.service_inventory.item_code}
                    </td>
                    <td className="border border-black px-3 py-2 text-start">
                      {unit.quantity}
                    </td>
                    <td className="border border-black px-3 py-2 text-end">
                      {`Rs. ${((Number(unit.service_inventory.price)*Number( unit.quantity))||0).toFixed(2)}`}
                    </td>
                  </tr>
                ))}

                {other_data?.length > 0 ? (
                  <tr className="text-mobile_body lg:text-body sm:text-tab_body">
                    <td className="border border-black px-3 py-2 text-start">
                      {other_data[0].item}
                    </td>
                    <td className="border border-black px-3 py-2 text-start">
                    {other_data[0].remark}
                    </td>
                    <td className="border border-black px-3 py-2 text-start">
                    {other_data[0].comment}
                    </td>
                    <td className="border border-black px-3 py-2 text-star">t
                    {other_data[0].quantity}
                    </td>
                    <td className="border border-black px-3 py-2 text-end">
                    Rs. {(Number(other_data[0].price)||0).toFixed(2)}
                    </td>
                  </tr>
                ) : null}
              </>
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-mobile_body lg:text-body sm:text-tab_body"
                >
                  No Service Inventory
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
