import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_completed_records } from "../../Api/ServiceRecordAPI";
import { GoArrowRight } from "react-icons/go";
import ServiceTable from "../../Components/Tables/ServiceTable";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";

export default function ServiceRecordsPage() {
  const [completedRecords, setCompletedRecords] = useState([]);
  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async (e) => {
    try {
      const response = await get_completed_records({type:'all'});
      console.log("Completed Jobs:", response);
      if (response.data && response.data.data) {
        setCompletedRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  return (
    <NormalBackground
      title="Service Records"
      componentName={ServiceTable}
      data={completedRecords}
      userRole={2}
    />
  );
}
