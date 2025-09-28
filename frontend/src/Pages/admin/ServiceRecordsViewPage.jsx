import React, { useCallback, useEffect, useState } from "react";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import CustomerTable from "../../Components/Tables/CustomerTable";
import { get_all_records } from "../../Api/ServiceRecordAPI";
import ServiceTable from "../../Components/Tables/ServiceTable";

export default function ServiceRecordViewPage({ userRole }) {
  const [recordsData, setRecordsData] = useState([]);

  const fetchRecordsDetails = useCallback(async () => {
    try {
      const response = await get_all_records();
      console.log("Records", response.data.records);

      if (response.status === 200) {
        setRecordsData(response.data.records);
      }
    } catch (error) {
      console.error("Error fetching records details:", error);
    }
  }, []);

  useEffect(() => {
    fetchRecordsDetails();
  }, [fetchRecordsDetails]);

  return (
    <div>
      <NormalBackground
        title="All Service Records"
        componentName={ServiceTable}
        data={recordsData}
        userRole={1}
      />
    </div>
  );
}
