import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import CustomerTable from "../../Components/Tables/CustomerTable";
import { all_customers_view } from "../../Api/CustomerAPI";

export default function CustomersViewPage({ userRole }) {
  const { customer_id } = useParams();
  const [customersData, setCustomersData] = useState([]);

  const fetchCustomerDetails = useCallback(async () => {
    try {
      const response = await all_customers_view();
      console.log("Advisors", response.data.customers);

      if (response.status === 200) {
        setCustomersData(response.data.customers);

      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [customer_id]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails, userRole]);

  return (
    <div>
      <NormalBackground
        title="All Customers"
        componentName={CustomerTable}
        data={customersData}
        userRole={userRole}
      />
    </div>
  );
}
