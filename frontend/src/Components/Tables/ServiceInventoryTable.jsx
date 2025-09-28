import "react-toastify/dist/ReactToastify.css";
import TableSearch from "../Common/TableSearch";
import useTableSearch from "../../Hooks/useTableSearch";

export default function ServiceInventoryTable({ data }) {
  const { searchTerm, setSearchTerm, filteredData } = useTableSearch(data || [], [
    'item_name',
    'item_code'
  ]);


  return (
    <div className="w-full px-2 md:px-4 lg:px-6">
      <div className="md:hidden text-xs text-gray-500 mb-2 text-center">
        Scroll horizontally to view all columns
      </div>
      <div className="flex justify-start items-center mb-6 flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <TableSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Inventory Item..."
          />
        </div>
      </div>

      <div className="w-full flex flex-col max-h-[calc(100vh-300px)] md:max-h-80 overflow-y-auto overflow-x-auto border border-black">
        <div className="max-w-full min-w-[600px] md:min-w-0">
          <table className="min-w-full table-auto border-collapse border border-black font-body">
            <thead className="sticky top-[-5px] border border-black">
              <tr className="bg-gray-200 text-body_label">
                <th className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">#</th>
                <th className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">Item Name</th>
                <th className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">Item Code</th>
                <th className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">Unit Price</th>
                <th className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((unit, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">{index + 1}</td>
                    <td className="border border-black px-2 py-1 md:px-3 md:py-2 text-start">{unit.item_name}</td>
                    <td className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">{unit.item_code}</td>
                    <td className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">{unit.price}</td>
                    <td className="border border-black px-2 py-1 md:px-3 md:py-2 text-center">{unit.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t">
                    {searchTerm ? "No matching inventory item found" : "No Inventory Items"}
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