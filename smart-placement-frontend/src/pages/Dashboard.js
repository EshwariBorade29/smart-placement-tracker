import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    package: "",
    location: "",
    eligibility: ""
  });

  const token = localStorage.getItem("token");

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add Job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/jobs", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Job added successfully!");

      // Clear form
      setForm({
        company: "",
        role: "",
        package: "",
        location: "",
        eligibility: ""
      });

      fetchJobs();

    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message || "Error adding job");
      } else {
        alert("Server error");
      }
    }
  };

  // Delete Job
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Job deleted");
      fetchJobs();

    } catch (err) {
      console.log(err);
      alert("Error deleting job");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
  <div>
    {/* Navbar */}
    <div className="navbar">
      <h2>Placement Portal</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>

    <div className="container">

      {/* Add Job */}
      <div className="card">
        <h3>Add Job</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
          />

          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
          />

          <input
            name="package"
            placeholder="Package"
            value={form.package}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            name="eligibility"
            placeholder="Min CGPA"
            value={form.eligibility}
            onChange={handleChange}
          />

          <button type="submit">Add Job</button>
        </form>
      </div>

      {/* Job List */}
      <div className="card">
        <h3>Your Jobs</h3>

        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h4>{job.company}</h4>
              <p>{job.role}</p>
              <p>Package: {job.package}</p>
              <p>Location: {job.location}</p>

              <button onClick={() => handleDelete(job._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  </div>
);
}

export default Dashboard;
