import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import TableSearch from "../Common/TableSearch";
import useTableSearch from "../../Hooks/useTableSearch";


export default function ServiceTable({ data, userRole }) {
  const records = data || [];
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredData } = useTableSearch(data || [], [
    'service_no',
    'vehicle_number'
  ])

  const handleRecordDetailPage = (record_id, status) => {
    if (status === "COMPLETED") {
      if (userRole === 2) {
        navigate(`/advisor/service-record/${record_id}/details/2/view`);
      } else if (userRole === 1) {
        navigate(`/admin/service-record/${record_id}/details/2/view`);
      }
    } else {
      if (userRole === 2) {
        navigate(`/advisor/service-record/${record_id}/bay-selection`);
      } else if (userRole === 1) {
        navigate(`/admin/service-record/${record_id}/details/1/view`);
      }
    }
  };

  return (
    <div className="bg-background  py-6 px-4 sm:px-6  xl:px-6 overflow-x-auto">
      <div className="w-full mb-1 sm:w-auto">
        <TableSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search Service Record..."
        />
      </div>
      <div className="mt-8 flex flex-col">

        <div>
          {filteredData.length > 0 ? (
            <table className="w-full table-fixed border-collapse border border-gray-300 font-body min-w-[1024px]">
              <thead className="w-full">
                <tr className="bg-gray-200 text-body_label ">
                  <th className="border px-3 py-2 text-center">
                    Service Record Number
                  </th>
                  <th className="border px-3 py-2 text-center">
                    Customer Name
                  </th>
                  <th className="border px-3 py-2 text-center">
                    Contact Number
                  </th>
                  <th className="border  px-3 py-2 text-center">
                    Vehicle Number
                  </th>
                  <th className="border px-3 py-2 text-center">Date</th>
                  <th className="border px-3 py-2 text-center">Total Price</th>
                  <th className="border px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record) => {
                  return (
                    <tr
                      key={record.service_no}
                      onClick={() => {
                        handleRecordDetailPage(
                          record.service_no,
                          record.status
                        );
                      }}
                    >
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {record?.service_no}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {record?.customer?.first_name} {record?.customer?.last_name}
                      </td>
                       <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {record?.customer?.mobile_number}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md">
                        {record?.vehicle_number}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {record?.date}
                      </td>
                      <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                        {record?.price}
                      </td>
                      <td className="border px-3 py-2 flex justify-center items-center h-[6rem] text-sm xl:text-md">
                        <button
                          className={`${record?.status === "ONGOING"
                            ? "bg-green-100 text-green-500 px-4 py-1 rounded text-mobile_body_bold w-[100px]"
                            : record.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-500 px-4 py-1 rounded text-mobile_body_bold w-[100px]"
                              : "bg-red-100 text-red-500 px-4 py-1 rounded text-mobile_body_bold w-[100px]"
                            }`}
                        >
                          {record?.status}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">
              {searchTerm ? "No matching advisors found" : "No Registered Advisors"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
