import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Dashboard.css"; // Import the CSS file

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [distributedLists, setDistributedLists] = useState([]);

  useEffect(() => {
    fetchDistributedLists();
  }, []);

  const fetchDistributedLists = async () => {
    try {
      const response = await axios.get(`${API_URL}/upload/getUpload`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDistributedLists(response.data.uploads);
    } catch (err) {
      console.error("Failed to fetch distributed lists", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Distributed Lists</h2>
      {distributedLists.length === 0 ? (
        <p className="no-data">No data available.</p>
      ) : (
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Phone</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {distributedLists.map((item, index) => (
                <tr key={index}>
                  <td>{item.firstName}</td>
                  <td>{item.phone}</td>
                  <td>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
