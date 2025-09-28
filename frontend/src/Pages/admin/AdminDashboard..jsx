import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { get_completed_records, get_stats } from "../../Api/ServiceRecordAPI";
import dayjs from "dayjs";

export default function AdminDashboard() {
    const [count, setCount] = useState();
    const [totalRevenue, setTotalRevenue] = useState();
    const [popularService, setPopularService] = useState();
    const [chartData, setChartData] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const groupRecordsByMonth = (records, year) => {
        const filteredRecords = records.filter(record => 
            dayjs(record.date).format("YYYY") === String(year)
        );
    
        const monthCounts = filteredRecords.reduce((acc, record) => {
            const month = dayjs(record.date).format("MMM"); 
    
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += 1;
    
            return acc;
        }, {});
    
        const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
        const completeMonthCounts = allMonths.map(month => ({
            month,
            jobs: monthCounts[month] || 0, 
        }));
    
        return completeMonthCounts;
    };

    useEffect(() => {
        if (fromDate && toDate) {
            fetchStats();
        } else {
            getCompletedJobs();
        }
    }, [fromDate, toDate]);

    const checkMaxJobType = async (records) => {
        // Create a mapping of job_name counts
        const jobNameCounts = records.reduce((acc, record) => {
            record.service_records_package.forEach(pkg => {
                const jobName = pkg.package?.job_name; 
                if (jobName) {
                    acc[jobName] = (acc[jobName] || 0) + 1;
                }
            });
            return acc;
        }, {});

        console.log("Job Name Counts:", jobNameCounts);

        let maxJobName = null;
        let maxCount = 0;

        Object.entries(jobNameCounts).forEach(([jobName, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxJobName = jobName;
            }
        });

        console.log("Most Frequent Job Name:", maxJobName, "Count:", maxCount);

        setCount(records.length);
        setTotalRevenue(
            records.reduce(
                (sum, record) => sum + (parseFloat(record.price) || 0), 0
            )
        );
        setPopularService(maxJobName);
    }

    const getCompletedJobs = async () => {
        const response = await get_completed_records();
        console.log("completed jobs", response);
    
        if (response.status === 200) {
            const records = response.data.data;
            checkMaxJobType(records);
            const currentYear = dayjs().format("YYYY");
            const groupedCounts = groupRecordsByMonth(records, currentYear);
            setChartData(groupedCounts);
            setRecentJobs(records);
        }
    };
    
    const fetchStats = async () => {
        const formData = {
            from_date: fromDate,
            to_date: toDate
        };

        const response = await get_stats(formData);
        // console.log("filtered jobs", response);

        if (response.status === 200) {
            const records = response.data.data;
            checkMaxJobType(records);
        }
    };

    return (
        <div className="w-full p-6">
            <div className="flex gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">From Date</label>
                    <input 
                        type="date" 
                        value={fromDate} 
                        onChange={(e) => setFromDate(e.target.value)} 
                        className="border p-2 rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">To Date</label>
                    <input 
                        type="date" 
                        value={toDate} 
                        onChange={(e) => setToDate(e.target.value)} 
                        className="border p-2 rounded-md w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-2 border-blue-500 text-blue-500 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold">Total Jobs</h2>
                    <p className="text-3xl font-bold mt-2">{count}</p>
                </div>

                <div className="border-2 border-green-500 text-green-500 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold">Total Revenue</h2>
                    <p className="text-xl xl:text-3xl font-bold mt-2"> {Number(totalRevenue || 0).toLocaleString("en-LK", { style: "currency", currency: "LKR" })}</p>
                </div>

                <div className="border-2 border-yellow-500 text-yellow-500 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold">Popular Service Package</h2>
                    <p className="text-2xl font-bold mt-2">{popularService}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                <h2 className="text-xl font-bold mb-4">Jobs Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="jobs" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Customer</th>
                            <th className="border border-gray-300 p-2">Vehicle Number</th>
                            <th className="border border-gray-300 p-2">Service Package</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentJobs.map((job) => (
                            <tr key={job.service_no} className="text-center">
                                <td className="border border-gray-300 p-2"> {job?.customer?.first_name} {job?.customer?.last_name}</td>
                                <td className="border border-gray-300 p-2">{job?.vehicle_number}</td>
                                <td className="border border-gray-300 p-2">{job?.service_records_package[0]?.package?.job_type?.job_type}</td>
                                <td className="border border-gray-300 p-2">{job?.date}</td>
                                <td className={`border border-gray-300 p-2 font-semibold ${job?.status === "COMPLETED" ? "text-green-600" : job?.status === "ONGOING" ? "text-red-600" : "text-yellow-600"}`}>
                                    {job.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
