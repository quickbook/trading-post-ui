import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/api/dashboard/summary")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading dashboard:", err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>📈 Dashboard</h2>
      <p>Total API Calls: {data.totalCalls}</p>
      <p>Top API: {data.topApi}</p>
    </div>
  );
}