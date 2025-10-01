import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import LogTable from "../../Components/Tables/LogTable";
import { all_logs } from "../../Api/LogAPI";

export default function LogsViewPage({ userRole }) {
  const { customer_id } = useParams();
  const [logsData, setLogsData] = useState([]);

  const fetchLogDetails = useCallback(async () => {
    try {
      const response = await all_logs();
      console.log("Logs", response.data.logs);

      if (response.status === 200) {
        setLogsData(response.data.logs);

      }
    } catch (error) {
      console.error("Error fetching log details:", error);
    }
  }, []);

  useEffect(() => {
    fetchLogDetails();
  }, [fetchLogDetails, userRole]);

  return (
    <div>
      <NormalBackground
        title="All Logs"
        componentName={LogTable}
        data={logsData}
        userRole={userRole}
      />
    </div>
  );
}
