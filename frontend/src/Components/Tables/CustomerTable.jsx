import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { update_customer } from "../../Api/CustomerAPI";
import { toast } from "react-toastify";
import TableSearch from "../Common/TableSearch";
import useTableSearch from "../../Hooks/useTableSearch";

export default function CustomerTable({ data }) {
  const customers = data || [];
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredData } = useTableSearch(data || [], [
    'first_name',
    'mobile_number'
  ]);

  const handleCreateNewCustomer = () => {
    navigate(`/admin/customer/mobile-number`);
  };

  const handleEditCustomer = (customer_id) => {
    navigate(`/admin/customer/${customer_id}/update`);
  };

  const handleActiveInactiveCustomer = async (customer_id, status) => {
    try {
      const response = await update_customer({
        customer_id: customer_id,
        status: status,
      });
      if (response?.status === 200) {
        console.log(response.data.customer);
        toast.success("Customer Status is Changed Successfully");
        navigate(0);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Internal Error");
    }
  };

  return (
    <div className="bg-background  py-6 px-4 sm:px-6  xl:px-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-auto">
          <button
            className="mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
            onClick={handleCreateNewCustomer}
          >
            Create New Customer
          </button>
        </div>
        <div className="w-full sm:w-64">
          <TableSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Customer..."
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div>
          <table className="w-full table-fixed border-collapse border border-gray-300 font-body min-w-[1024px]">
            <thead>
              <tr className="bg-gray-200 text-body_label">
                <th className="border px-3 py-2 text-center">First Name</th>
                <th className="border px-3 py-2 text-center">Last Name</th>
                <th className="border w-[25%] px-3 py-2 text-center">Email</th>
                <th className="border px-3 py-2 text-center">
                  Telephone Number
                </th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((customer) => (
                  <tr key={customer.user_id}>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                      {customer.first_name}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                      {customer.last_name}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md">
                      {customer.email}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100">
                      {customer.mobile_number}
                    </td>
                    <td className="border px-3  py-2 flex justify-center items-center h-[6rem] text-sm xl:text-md">
                      <button
                        className={`${customer.status === "ACTIVE"
                          ? "bg-green-100 text-green-500 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                          : customer.status === "INACTIVE"
                            ? "bg-red-100 text-red-500 px-4 py-1 roundedl text-mobile_body_bold w-[80px]"
                            : "bg-gray-200 text-gray-700 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                          }`}
                      >
                        {customer.status}
                      </button>
                    </td>
                    <td className="border px-3 py-2 text-center flex-col xl:flex-row space-y-2 xl:space-y-0 justify-center space-x-2 font-bold">
                      <button
                        onClick={() => handleEditCustomer(customer.customer_id)}
                        className={`${customer.status === "INACTIVE"
                          ? "opacity-55 cursor-not-allowed"
                          : ""
                          } bg-blue-700 hover:bg-blue-700 text-white py-1 mb-1 px-3 rounded text-sm`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (customer.status === "ACTIVE") {
                            handleActiveInactiveCustomer(
                              customer.customer_id,
                              "INACTIVE"
                            );
                          } else if (customer.status === "INACTIVE") {
                            handleActiveInactiveCustomer(
                              customer.customer_id,
                              "ACTIVE"
                            );
                          }
                        }}
                        className={`${customer.status === "ACTIVE"
                          ? "bg-red-500 hover:bg-red-500 text-white w-[80px]"
                          : "bg-green-500 hover:bg-green-500 text-white w-[80px]"
                          } py-1 px-3 rounded text-sm `}
                      >
                        {customer.status === "ACTIVE" ? "Delete" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t">
                    {searchTerm ? "No matching customer found" : "No Registered Customers"}
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
