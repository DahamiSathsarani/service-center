import React, { useState, useEffect, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function InspectionsTable({ data = [], onUpdate }) {
  const [updatedRows, setUpdatedRows] = useState({});
  const [selectedCodes, setSelectedCodes] = useState({});
  const [editableQuantities, setEditableQuantities] = useState({});
  const [selectedRmks, setSelectedRmks] = useState({});

  const uniqueItems = useMemo(() => {
    if (!data || data.length === 0) return [];

    return Array.from(
      new Map(
        data
          .filter((item) => item.item_name?.toLowerCase() !== "others")
          .reduce((acc, item) => {
            if (!acc.has(item.item_name)) {
              acc.set(item.item_name, {
                ...item,
                quantity: item.qty || 0,
                rmk: item.rmk || "",
                item_codes: new Set(),
                marked_item_code: "",
              });
            }

            const existing = acc.get(item.item_name);
            existing.item_codes.add(item.item_code);

            if (item.rmk) {
              existing.rmk = item.rmk;
              existing.quantity = item.qty || 0;
              existing.marked_item_code = item.item_code;
            }

            return acc;
          }, new Map())
      ).values()
    ).map((item) => ({
      ...item,
      item_codes: Array.from(item.item_codes),
      item_code: item.marked_item_code || Array.from(item.item_codes)[0] || "",
    }));
  }, [data]);

  useEffect(() => {
    const initialCodes = {};
    const initialQuantities = {};
    const initialRmks = {};

    uniqueItems.forEach((item) => {
      initialCodes[item.item_name] = item.item_code ?? "";
      initialQuantities[item.item_name] = item.quantity ?? 0;
      initialRmks[item.item_name] = item.rmk || "";
    });

    setSelectedCodes(initialCodes);
    setEditableQuantities(initialQuantities);
    setSelectedRmks(initialRmks);
  }, [uniqueItems]);

  useEffect(() => {
    const filteredUpdates = uniqueItems
      .filter((item) => editableQuantities[item.item_name] >= 1)
      .map((item) => ({
        item_name: item.item_name,
        rmk: selectedRmks[item.item_name] || "",
        item_code: selectedCodes[item.item_name] || "",
        quantity: editableQuantities[item.item_name] || 0,
      }));

    onUpdate(filteredUpdates);
  }, [selectedCodes, editableQuantities, selectedRmks, onUpdate]);

  const handleItemCodeChange = (itemName, newCode) => {
    setSelectedCodes((prev) => ({
      ...prev,
      [itemName]: newCode,
    }));
  };

  const handleQuantityChange = (itemName, value) => {
    setEditableQuantities((prev) => ({
      ...prev,
      [itemName]: value,
    }));
  };

  const handleRmkChange = (itemName, value) => {
    setSelectedRmks((prev) => ({
      ...prev,
      [itemName]: value,
    }));
  };

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="mt-8 w-full flex flex-col max-h-80 overflow-y-auto overflow-x-auto border border-black">
        <div className="max-w-full">
          <table className="min-w-full table-auto border-collapse border border-black font-body">
            <thead className="sticky top-[-5px] z-50 border border-black">
              <tr className="bg-gray-200 text-body_label">
                <th className="border border-black px-3 py-2 text-center"></th>
                <th className="border border-black px-3 py-2 text-center">
                  Name
                </th>
                <th className="border border-black px-3 py-2 text-center">
                  RMK
                </th>
                <th className="border border-black px-3 py-2 text-center">
                  Item Code
                </th>
                <th className="border border-black px-3 py-2 text-center">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {uniqueItems.length > 0 ? (
                uniqueItems.map((unit, index) => {
                  const relatedItems = data.filter(
                    (element) => element.item_name === unit.item_name
                  );
                  const itemCodes = relatedItems.map((item) => item.item_code);
                  const selectedCode = selectedCodes[unit.item_name] ?? "";
                  const selectedRmk = selectedRmks[unit.item_name] || "";

                  return (
                    <tr key={index}>
                      <td className="border border-black px-3 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-black px-3 py-2 text-start">
                        {unit.item_name}
                      </td>
                      <td className="border border-black px-1 text-center">
                        <select
                          onChange={(e) =>
                            handleRmkChange(unit.item_name, e.target.value)
                          }
                          value={selectedRmk}
                          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all"
                        >
                          {selectedRmk === "" && (
                            <option value="" disabled>
                              Select RMK
                            </option>
                          )}
                          <option value="C">C</option>
                          <option value="R">R</option>
                          <option value="I">I</option>
                          <option value="CL">CL</option>
                          <option value="T">T</option>
                          <option value="NR">NR</option>
                          <option value="OK">OK</option>
                        </select>
                      </td>
                      <td className="border border-black px-3 py-2">
                        <select
                          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all"
                          value={selectedCode || ""}
                          onChange={(e) =>
                            handleItemCodeChange(unit.item_name, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Select Item Code
                          </option>
                          {itemCodes.map((code, idx) => (
                            <option key={idx} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-black px-3 py-2 text-center">
                        <input
                          type="number"
                          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 transition-all outline-none text-center"
                          min="0"
                          value={editableQuantities[unit.item_name]}
                          onChange={(e) =>
                            handleQuantityChange(unit.item_name, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No Service Inventory Items
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
