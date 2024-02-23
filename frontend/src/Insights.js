import React, { useState, useEffect } from "react";
import BarChart from "./components/BarChart";
import axios from "axios";
import { Link } from "react-router-dom";

function Insights() {
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "Time",
        data: [],
      },
    ],
  });

  const [groupedData, setGroupedData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Time",
        data: [],
      },
    ],
  });

  const [selectedInterval, setSelectedInterval] = useState(24);

  const fetchData = async (interval) => {
    try {
      const response = await axios.get(`http://localhost:8081/data?interval=${interval}`);
      console.log("Response data:", response.data);

      const currentDate = new Date();
      const filteredData = response.data.filter((item) => {
        const startTime = new Date(item.start_time);
        return currentDate - startTime <= interval * 60 * 60 * 1000;
      });

      const labels = filteredData.map((item) => item.category_name);
      const data = filteredData.map((item) => {
        const startTime = new Date(item.start_time);
        const endTime = new Date(item.end_time);
        const timeDiff = endTime - startTime;
        return timeDiff / (60 * 1000); // Convert milliseconds to minutes
      });

      setUserData({
        labels: labels,
        datasets: [
          {
            label: "Time",
            data: data,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchGroupedData = async (interval) => {
    try {
      const response = await axios.get(`http://localhost:8081/grouped_data?interval=${interval}`);
      console.log("Grouped Data:", response.data);

      const labels = response.data.map((item) => item.category_name);
      const data = response.data.map((item) => item.total_duration);

      setGroupedData({
        labels: labels,
        datasets: [
          {
            label: "Total Time",
            data: data,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching grouped data:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedInterval); // Fetch data for the default interval (24 hours)
    fetchGroupedData(selectedInterval); // Fetch grouped data for the default interval (24 hours)
  }, [selectedInterval]);

  const handleIntervalChange = (interval) => {
    setSelectedInterval(interval);
  };

  return (
    <div className="" style={{ height: "1200px", width: "98%" }}>
      <Link to="/">Back to Home</Link>
      {/* Add buttons or other UI elements to trigger fetching data for different intervals */}
      <button
        onClick={() => handleIntervalChange(24)}
        style={{ backgroundColor: selectedInterval === 24 ? "lightblue" : "" }}
      >
        Last 24 hours
      </button>
      <button
        onClick={() => handleIntervalChange(48)}
        style={{ backgroundColor: selectedInterval === 48 ? "lightblue" : "" }}
      >
        Last 48 hours
      </button>
      <button
        onClick={() => handleIntervalChange(72)}
        style={{ backgroundColor: selectedInterval === 72 ? "lightblue" : "" }}
      >
        Last 72 hours
      </button>
      <button
        onClick={() => handleIntervalChange(168)}
        style={{ backgroundColor: selectedInterval === 168 ? "lightblue" : "" }}
      >
        Last one week
      </button>

      <div style={{ height: "600px", overflowY: "auto" }}>
        {userData && userData.labels.length > 0 ? (
          <BarChart chartData={userData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div style={{ height: "600px", overflowY: "auto" }}>
        {groupedData && groupedData.labels.length > 0 ? (
          <BarChart chartData={groupedData} />
        ) : (
          <p>Loading Grouped Data...</p>
        )}
      </div>
    </div>
  );
}

export default Insights;
