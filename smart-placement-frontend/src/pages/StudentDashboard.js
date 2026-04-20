import { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch jobs
  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:5000/api/jobs", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobs(res.data);
  };

  // Fetch applications
  const fetchApplications = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/applications/${userId}`
    );
    setApplications(res.data);
  };

 // eslint-disable-next-line
useEffect(() => {
  fetchJobs();
  fetchApplications();
}, []);

  // Apply job
  const applyJob = async (jobId) => {
    const res = await axios.post(
      "http://localhost:5000/api/applications/apply",
      { userId, jobId }
    );

    alert(res.data.message);
    fetchApplications();
  };

  // Check status
  const getStatus = (jobId) => {
    const app = applications.find((a) => a.jobId === jobId);
    return app ? app.status : null;
  };

  <h4>Total Jobs Applied: {applications.length}</h4>
  
  return (
  <div>
    {/* Navbar */}
    <div className="navbar">
      <h2>Student Dashboard</h2>
    </div>

    <div className="container">

      {/* Stats */}
      <div className="card">
        <h3>Total Jobs Applied: {applications.length}</h3>
      </div>

      {/* Jobs */}
      <div className="card">
        <h3>Available Jobs</h3>

        {jobs.map((job) => (
          <div className="job-card" key={job._id}>
            <h4>{job.company}</h4>
            <p><b>{job.role}</b></p>
            <p>₹{job.package} LPA</p>
            <p>{job.location}</p>

            {getStatus(job._id) ? (
              <div className={`status ${getStatus(job._id)}`}>
                {getStatus(job._id)}
              </div>
            ) : (
              <button onClick={() => applyJob(job._id)}>
                Apply
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  </div>
);
}

export default StudentDashboard;