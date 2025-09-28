import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerCreateAndView from "../../Components/Forms/CustomerCreateAndView";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import { customer_view } from "../../Api/CustomerAPI";

export default function AddNewCustomerPage({ userRole }) {
  const { customer_id } = useParams();
  const { vehicle_number } = useParams();
  const [customerData, setCustomerData] = useState(null);

  const fetchCustomerDetails = useCallback(async () => {
    try {
      const response = await customer_view({ id: customer_id });
      if (response.status === 200) {
        setCustomerData(response.data.customer);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [customer_id]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  return (
    <div>
      <NormalBackground
        title="Customer Details"
        componentName={CustomerCreateAndView}
        type="create"
        status={userRole === "1" ? "update" : undefined}
        button="update"
        data={customerData}
        vehicle_number={vehicle_number}
      />
    </div>
  );
}
