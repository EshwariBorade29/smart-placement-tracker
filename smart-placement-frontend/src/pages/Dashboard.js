import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: "", role: "", package: "", location: "", eligibility: "", deadline: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Error fetching jobs");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return toast.error("Company and Role are required");

    setSubmitting(true);
    try {
      await API.post("/jobs", form);
      toast.success("Job posted successfully!");
      setForm({ company: "", role: "", package: "", location: "", eligibility: "", deadline: "" });
      fetchJobs();
    } catch {
      toast.error("Error adding job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job? All applications will be affected.")) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job removed");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting job");
    }
  };

  const getCompanyInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <Navbar role="admin" />

      <div className="page">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Post new opportunities and manage existing listings</p>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-num">{jobs.length}</div>
            <div className="stat-card-label">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-num">
              {[...new Set(jobs.map(j => j.company))].length}
            </div>
            <div className="stat-card-label">Companies</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-num">
              {jobs.filter(j => j.deadline && new Date(j.deadline) > new Date()).length}
            </div>
            <div className="stat-card-label">Open Deadlines</div>
          </div>
        </div>

        <div className="two-col">
          {/* ADD JOB FORM */}
          <div className="card">
            <div className="card-title">
              <div className="card-icon" style={{ background: "rgba(79,142,247,0.12)" }}>➕</div>
              Post New Job
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" name="company" placeholder="e.g. Google" value={form.company} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Role / Position *</label>
                <input className="form-input" name="role" placeholder="e.g. Software Engineer" value={form.role} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Package (LPA)</label>
                <input className="form-input" name="package" type="number" placeholder="e.g. 12" value={form.package} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" name="location" placeholder="e.g. Bangalore" value={form.location} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Min. CGPA Required</label>
                <input className="form-input" name="eligibility" type="number" step="0.1" min="0" max="10" placeholder="e.g. 7.5" value={form.eligibility} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input className="form-input" name="deadline" type="date" value={form.deadline} onChange={handleChange} style={{ colorScheme: "dark" }} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: "100%", justifyContent: "center" }}>
                {submitting ? "Posting…" : "Post Job"}
              </button>
            </form>
          </div>

          {/* JOB LIST */}
          <div>
            <div className="card-title" style={{ marginBottom: "16px" }}>
              <div className="card-icon" style={{ background: "rgba(56,217,169,0.12)" }}>📋</div>
              Current Listings
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏢</div>
                <p>No jobs posted yet. Add one using the form.</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <div className="job-card" key={job._id}>
                    <div className="job-card-header">
                      <div>
                        <div className="company-logo">{getCompanyInitial(job.company)}</div>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>
                        Delete
                      </button>
                    </div>

                    <div>
                      <div className="job-card-title">{job.company}</div>
                      <div className="job-card-role">{job.role}</div>
                    </div>

                    <div className="job-meta">
                      {job.package && <span className="meta-chip package">💰 {job.package} LPA</span>}
                      {job.location && <span className="meta-chip location">📍 {job.location}</span>}
                      {job.eligibility && <span className="meta-chip cgpa">⭐ {job.eligibility}+ CGPA</span>}
                    </div>

                    {job.deadline && (
                      <div style={{ fontSize: "12px", color: "var(--text3)" }}>
                        Deadline: {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
