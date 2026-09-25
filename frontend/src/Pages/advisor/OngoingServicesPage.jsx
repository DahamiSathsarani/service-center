import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_ongoing_records } from "../../Api/ServiceRecordAPI";
import { GoArrowRight } from "react-icons/go";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import ServiceTable from "../../Components/Tables/ServiceTable";

export default function OngoingServicesPage() {
  const [ongoingRecords, setOngoingRecords] = useState([]);
  useEffect(() => {
    fetchOngoingJobs();
  }, []);

  const fetchOngoingJobs = async (e) => {
    try {
      const response = await get_ongoing_records({ type: "all" });
      console.log("Ongoing Jobs:", response);

      if (response.data.data && response.data.user) {
        const userId = response.data.user.user_id;
        const filteredRecords = response.data.data.filter(
          (job) => job.user_id == userId
        );

        setOngoingRecords(filteredRecords);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };
  return (
    <NormalBackground
      title="Ongoing Service Records"
      componentName={ServiceTable}
      data={ongoingRecords}
      userRole={2}
    />
  );
}
