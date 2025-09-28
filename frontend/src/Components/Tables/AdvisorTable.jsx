import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { user_activate, user_delete } from "../../Api/UserAPI";
import TableSearch from "../Common/TableSearch";
import useTableSearch from "../../Hooks/useTableSearch";

export default function AdvisorTable({ data }) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredData } = useTableSearch(data || [], [
    'first_name',
    'email'
  ]);

  useEffect(() => {
    const userAction = JSON.parse(localStorage.getItem('userAction'));

    if (userAction) {
      if (userAction.action === 'deleted') {
        toast.success(`User Deleted Successfully`);
      } else if (userAction.action === 'activated') {
        toast.success(`User Activated Successfully`);
      }

      localStorage.removeItem('userAction');
    }
  }, []);

  const handleCreateNewAdvisor = () => {
    navigate(`/admin/user/create`);
  };

  
  const handleEdit = (id) => {
    navigate(`profile/${id}`);
  };

  
  const handleDelete = async (id) => {
    try {
      const response = await user_delete(id);
      console.log("deleted user", response.data);
      if (response.status === 200) {
        // Store a flag in localStorage indicating the success
        localStorage.setItem('userAction', JSON.stringify({ action: 'deleted', userId: id }));
        
        navigate(0);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.response);
      toast.error("Error Deleting User");
    }
  };
  
  const handleActivate = async (id) => {
    try {
      const response = await user_activate(id);
      console.log("activated user", response.data);
      if (response.status === 200) {
        // Store a flag in localStorage indicating the success
        localStorage.setItem('userAction', JSON.stringify({ action: 'activated', userId: id }));
  
        navigate(0);
      }
    } catch (error) {
      console.error("Error fetching user details:", error.response);
      toast.error("Error Activating User");
    }
  };
  

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(dateString));
  };
  
  return (
    <div className="bg-background py-6 px-4 xl:px-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-auto">
          <button
            className="mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
            onClick={handleCreateNewAdvisor}
          >
            Create New Advisor
          </button>
        </div>
        <div className="w-full sm:w-64">
          <TableSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search advisors..."
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div>
          <table className="w-full table-fixed border-collapse border border-gray-300 font-body min-w-[1024px]">
            <thead>
              <tr className="bg-gray-200 text-body_label">
                <th className="border px-3 py-2 text-center">Profile</th>
                <th className="border px-3 py-2 text-center">First Name</th>
                <th className="border px-3 py-2 text-center">Last Name</th>
                <th className="border px-3 py-2 text-center">Username</th>
                <th className="border px-3 py-2 text-center">Email</th>
                <th className="border px-3 py-2 text-center">Created At</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
            {filteredData.length > 0 ? (
                filteredData.map((advisor) => (
                  <tr
                    key={advisor.user_id}
                  >
                    <td className="border px-3 py-2 text-center">
                      {advisor.profile_picture ? (
                        <img
                          src={`${advisor.profile_picture}`}
                          alt="Profile"
                          className="w-10 h-10 rounded-full mx-auto object-cover cursor-pointer"
                          onClick={() => navigate(`profile/${advisor.user_id}`)}
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`profile/${advisor.user_id}`)}>
                      {advisor.first_name}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`profile/${advisor.user_id}`)}>
                      {advisor.last_name}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`profile/${advisor.user_id}`)}>
                      {advisor.username}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md">
                      {advisor.email}
                    </td>
                    <td className="border px-3 py-2 text-center text-sm xl:text-md">
                      {formatDate(advisor.created_at)}
                    </td>
                    <td className="border px-3 py-2 flex justify-center items-center text-sm xl:text-md">
                      <div
                        className={`${
                          advisor.status === "ACTIVE"
                            ? "bg-green-100 text-green-500 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                            : advisor.status === "INACTIVE"
                            ? "bg-red-100 text-red-500 px-4 py-1 roundedl text-mobile_body_bold w-[80px]"
                            : "bg-gray-200 text-gray-700 px-4 py-1 rounded text-mobile_body_bold w-[80px]"
                        }`}
                      >
                        {advisor.status}
                      </div>
                    </td>
                    <td className="border px-3 py-2 text-center flex-col xl:flex-row space-y-2 xl:space-y-0 justify-center space-x-2 font-bold">
                      <button
                        onClick={() => handleEdit(advisor.user_id)}
                        className="bg-blue-700 hover:bg-blue-700 text-white mb-1 py-1 px-3 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (advisor.status === "ACTIVE") {
                            handleDelete(advisor.user_id);
                          } else if (advisor.status === "INACTIVE") {
                            handleActivate(advisor.user_id);
                          }
                        }}
                        className={`${
                          advisor.status === "ACTIVE"
                            ? "bg-red-500 hover:bg-red-500 text-white w-[80px]"
                            : "bg-green-500 hover:bg-green-500 text-white w-[80px]"
                        } py-1 px-3 rounded text-sm`}
                      >
                        {advisor.status === "ACTIVE" ? "Delete" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-3 text-center text-sm text-gray-500 font-semibold bg-gray-100 border-t">
                    {searchTerm ? "No matching advisors found" : "No Registered Advisors"}
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
