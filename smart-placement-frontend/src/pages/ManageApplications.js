import { useEffect, useState } from "react";
import axios from "axios";

function ManageApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApps = async () => {
    const res = await axios.get("http://localhost:5000/api/applications");
    setApplications(res.data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/applications/status/${id}`, {
      status
    });

    alert("Status updated");
    fetchApps();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Applications</h2>

      {applications.map((app) => (
        <div key={app._id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px"
        }}>
          <p>User ID: {app.userId}</p>
          <p>Job ID: {app.jobId}</p>
          <p>Status: {app.status}</p>

          <button onClick={() => updateStatus(app._id, "Selected")}>
            Select
          </button>

          <button onClick={() => updateStatus(app._id, "Rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageApplications;