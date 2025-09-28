import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import AdvisorTable from "../../Components/Tables/AdvisorTable";
import { get_users_by_user_role } from "../../Api/UserAPI";

export default function AdvisorsViewPage() {
  const { customer_id } = useParams();
  const [advisorssData, setAdvisorsData] = useState([]);

  const fetchAdvisorDetails = useCallback(async () => {
    try {
      const response = await get_users_by_user_role(2);
      console.log("Advisors", response.data.users);

      if (response.status === 200) {
        setAdvisorsData(response.data.users); 
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  }, [customer_id]);

  useEffect(() => {
    fetchAdvisorDetails();
  }, [fetchAdvisorDetails]);

  return (
    <div>
      <NormalBackground
        title="All Advisors"
        componentName={AdvisorTable}
        data={advisorssData}
      />
    </div>
  );
}
