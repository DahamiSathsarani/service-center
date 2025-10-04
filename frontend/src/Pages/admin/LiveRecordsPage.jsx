import { useEffect, useState, useRef  } from "react";
import { get_ongoing_records } from "../../Api/ServiceRecordAPI";

export default function LiveRecordsPage() {
  const [ongoingRecords, setOngoingRecords] = useState([]);
  const pageRef = useRef();

  useEffect(() => {
    fetchOngoingJobs();
    const interval = setInterval(fetchOngoingJobs, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchOngoingJobs = async () => {
    try {
      const response = await get_ongoing_records();
      if (response.data.data) {
        setOngoingRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ongoing jobs:", error);
    }
  };

  const enterFullScreen = () => {
    if (pageRef.current) {
      if (pageRef.current.requestFullscreen) {
        pageRef.current.requestFullscreen();
      } else if (pageRef.current.webkitRequestFullscreen) {
        pageRef.current.webkitRequestFullscreen();
      } else if (pageRef.current.msRequestFullscreen) {
        pageRef.current.msRequestFullscreen();
      }
    }
  };

  const stages = ["lube", "under_wash", "wash", "finish"];
  const grouped = {};
  stages.forEach((stage) => {
    grouped[stage] = ongoingRecords.filter((record) =>
      record?.service_times?.some(
        (t) => t.status === "ONGOING" && t.bay?.bay_type === stage
      )
    );
  });

  return (
    <div ref={pageRef} className="w-full min-h-screen bg-gray-900 text-white p-10 overflow-auto">

        <div className="flex justify-end mb-6">
            <button
                onClick={enterFullScreen}
                className="bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition-all"
                >
                Go Fullscreen
            </button>
        </div>
        <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
            Service Progress Display
        </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div
            key={stage}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-4 text-center uppercase text-yellow-300">
              {stage.replace("_", " ")}
            </h2>

            {grouped[stage]?.length > 0 ? (
              <div className="grid gap-4">
                {grouped[stage].map((record, i) => (
                  <div
                    key={i}
                    className="bg-yellow-500 text-gray-900 font-bold text-2xl py-4 rounded-lg text-center shadow-md hover:scale-105 transition-all"
                  >
                    {record.vehicle_number}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center text-lg">
                No vehicles
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
