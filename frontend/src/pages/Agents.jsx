import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Agents.css"; // Import the CSS file

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Agents = () => {
  const token = useSelector((state) => state.auth.token);
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_URL}/agents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(response.data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  const handleInputChange = (e) => {
    setNewAgent({ ...newAgent, [e.target.name]: e.target.value });
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_URL}/agents/add`, newAgent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setNewAgent({ name: "", email: "", phone: "", password: "" });
      fetchAgents();
    } catch (err) {
      setError("Error adding agent. Try again.");
    }
  };

  return (
    <div className="agents-container">
      <h2 className="agents-title">Agent Management</h2>

      {error && <p className="error-message">{error}</p>}

      <form className="agents-form" onSubmit={handleAddAgent}>
        <input type="text" name="name" placeholder="Name" value={newAgent.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={newAgent.email} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newAgent.phone} onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" value={newAgent.password} onChange={handleInputChange} required />
        <button type="submit">Add Agent</button>
      </form>

      <h3 className="agents-list-title">Agent List</h3>
      <ul className="agents-list">
        {agents.map((agent) => (
          <li key={agent._id} className="agent-item">
            <span className="agent-name">{agent.name}</span>
            <span className="agent-email">{agent.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Agents;
