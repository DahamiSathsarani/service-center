import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import TableSearch from "../Common/TableSearch";
import useTableSearch from "../../Hooks/useTableSearch";
import { FaTrash } from "react-icons/fa";
import { delete_log } from "../../Api/LogAPI";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function LogTable({ data }) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredData } = useTableSearch(data || [], [
    'action_type',
    'model'
  ]);

  const onDelete = async (logId) => {
    const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    buttonsStyling: true, 
    customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded'
    }
    });

    if (result.isConfirmed) {
        try {
        const res = await delete_log(logId);
        console.log("res", res);
        if (res.status === 200) {
            toast.success("Log Deleted Successfully");
            // navigate(0);
        }
    
        } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete log");
        }
    }
    };

  return (
    <div className="bg-background  py-6 px-4 sm:px-6  xl:px-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-auto">
          
        </div>
        <div className="w-full sm:w-64">
          <TableSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Log..."
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div>
          <table className="w-full table-fixed border-collapse border border-gray-300 font-body min-w-[1024px]">
            <thead>
              <tr className="bg-gray-200 text-body_label">
                <th className="border px-3 py-2 text-center">Action Type</th>
                <th className="border px-3 py-2 text-center">Description</th>
                <th className="border px-3 py-2 text-center">Model</th>
                <th className="border px-3 py-2 text-center">Timestamp</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((log) => (
                  <tr key={log.log_id}>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                      {log.action_type}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                      {log.description}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md">
                      {log.model}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                      {log.timestamp}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => onDelete(log.log_id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Log"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t">
                    {searchTerm ? "No matching log found" : "No Logs"}
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
