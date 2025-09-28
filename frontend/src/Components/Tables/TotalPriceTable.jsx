import { useEffect, useState } from "react";

export default function TotalPriceTable({ totalPriceData,getTotalPrice}) {
  const [inspectionPrices, setInspectionPrices] = useState(0); // Start from 0
  const [totalPackage, setTotalPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    if (totalPriceData?.inspection) {
      const totalInspectionPrice = totalPriceData.inspection.reduce(
        (sum, item) => sum + item.quantity * item.service_inventory.price,
        0
      );
      setInspectionPrices(totalInspectionPrice);
    }
    if (totalPriceData?.package?.length > 0) {
      const totalPackagePrice = totalPriceData.package.reduce(
        (sum, item) => sum + (Number(item.package?.price) || 0),
        0 // Initial value
      );
      setTotalPackage(totalPackagePrice);
    }

    console.log("Total Package Price:", totalPrice);
  }, [totalPriceData]);
  useEffect(() => {
    const total=totalPackage + inspectionPrices
    setTotalPrice(totalPackage + inspectionPrices);
    getTotalPrice(total);
  }, [totalPackage, inspectionPrices]);
  
  return (
    <div className="bg-background">
      <div className="mt-8 flex flex-col">
        <table className="w-full table-fixed border-collapse border border-black font-body">
          <thead className="w-full">
            <tr className="bg-gray-200 text-mobile_body_label lg:text-body_label sm:text-tab_body_label w-full">
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Name
              </th>
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Total price
              </th>
            </tr>
          </thead>
          <tbody>
            {totalPriceData.package?.length > 0 ? (
              <>
                {totalPriceData?.package.map((unit, index) => (
                  <tr
                    key={index}
                    className="text-mobile_body lg:text-body sm:text-tab_body"
                  >
                    <td className="border border-black px-3 py-2 text-start">
                      {`${unit.package?.job_type?.job_type || ""} - ${
                        unit.package?.job_name || ""
                      }`}
                    </td>
                    <td className="border border-black px-3 py-2 text-end">
                      {`Rs. ${(Number(unit.package?.price) || 0).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
                <tr className="text-mobile_body lg:text-body sm:text-tab_body">
                  <td className="border border-black px-3 py-2 text-start">
                    Total Inspections
                  </td>
                  <td className="border border-black px-3 py-2 text-end">
                    Rs. {(Number(inspectionPrices) || 0).toFixed(2)}
                  </td>
                </tr>
                <tr className="text-mobile_body lg:text-body sm:text-tab_body">
                  <td className="border border-black px-3 py-2 text-start">
                    Total Amount
                  </td>
                  <td className="border border-black px-3 py-2 text-end">
                    Rs.{" "}
                    {(
                      Number(inspectionPrices) + Number(totalPackage) ?? 0
                    ).toFixed(2)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="text-center text-mobile_body lg:text-body sm:text-tab_body"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
