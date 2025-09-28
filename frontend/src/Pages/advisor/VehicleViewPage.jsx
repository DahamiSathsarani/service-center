import React,{ useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { customer_view } from "../../Api/CustomerAPI";
import VehicleCreateAndViewForm from "../../Components/Forms/VehicleCreateAndViewForm";
import CustomerCreateAndView from "../../Components/Forms/CustomerCreateAndView";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

export default function VehicleViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
      fetchCustomerDetails();
    }, []);

  const fetchCustomerDetails = async () => {
      try {
        const response = await customer_view({'id':vehicle.customer_id}); 
        if (response.status === 200) {
          setCustomerData(response.data.customer); 
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };
  
  const handleUpdate = async() => {
    navigate(`/advisor/customer/search`, { state: { type: 'update', vehicle_number: vehicle.vehicle_number } })
  }

  const handleContinue = async() => {
    navigate(`/advisor/${vehicle.vehicle_number}/service-record/create`);
  }

  return (
    <div>
      <NormalBackground
        title="  Vehicle Details "
        componentName={VehicleCreateAndViewForm}
        type="view"
        data={vehicle}
      />
      <NormalBackground
        title="Customer Details "
        componentName={CustomerCreateAndView}
        type="view"
        data={customerData}
      />
      <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-4 mt-2 md:mt-5">
        <button
          className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn w-full sm:w-auto"
          onClick={handleUpdate}>
          Update Customer
        </button>
        <button
          className="mobile_submit-btn  md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
          onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
