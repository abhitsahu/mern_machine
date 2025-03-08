import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./UploadCSV.css"; // Import the CSS file

const API_URL = import.meta.env.VITE_BACKEND_URL;

const UploadCSV = () => {
  const token = useSelector((state) => state.auth.token);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/upload/csv`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ File uploaded and tasks distributed successfully!");
    } catch (err) {
      setMessage("❌ Upload failed. Try again.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload CSV</h2>
      {message && <p className="upload-message">{message}</p>}
      <form className="upload-form" onSubmit={handleUpload}>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadCSV;
