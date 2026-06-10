import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const badgeClass = (status) => {
  const map = { Applied: "badge-applied", Interview: "badge-interview", Selected: "badge-selected", Rejected: "badge-rejected" };
  return `badge ${map[status] || "badge-applied"}`;
};

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  // FIX: use /applications (token-based) instead of /applications/:userId
  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const applyJob = async (jobId) => {
    setApplying(jobId);
    try {
      const res = await API.post("/applications/apply", { jobId });
      toast.success(res.data.message || "Applied successfully!");
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying");
    } finally {
      setApplying(null);
    }
  };

  const getStatus = (jobId) => {
    const app = applications.find((a) => a.jobId?._id === jobId);
    return app ? app.status : null;
  };

  const filteredJobs = jobs.filter(j =>
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.role.toLowerCase().includes(search.toLowerCase()) ||
    (j.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const getCompanyInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <Navbar role="student" />

      <div className="page">
        <div className="page-header">
          <h1>Welcome, {user?.name?.split(" ")[0] || "Student"} 👋</h1>
          <p>CGPA: {user?.cgpa ?? "N/A"} · {applications.length} application{applications.length !== 1 ? "s" : ""} submitted</p>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-num">{jobs.length}</div>
            <div className="stat-card-label">Open Positions</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-num">{applications.length}</div>
            <div className="stat-card-label">Applied</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-num" style={{ color: "var(--accent2)" }}>
              {applications.filter(a => a.status === "Selected").length}
            </div>
            <div className="stat-card-label">Selected 🎉</div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button
            className={`btn btn-sm ${activeTab === "browse" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("browse")}
          >
            Browse Jobs ({jobs.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === "applied" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("applied")}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {/* BROWSE TAB */}
        {activeTab === "browse" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <input
                className="form-input"
                placeholder="🔍  Search by company, role, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: "420px" }}
              />
            </div>

            {filteredJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p>{search ? `No jobs matching "${search}"` : "No jobs available yet"}</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {filteredJobs.map((job) => {
                  const status = getStatus(job._id);
                  const eligible = !job.eligibility || (user?.cgpa >= job.eligibility);

                  return (
                    <div className="job-card" key={job._id}>
                      <div className="job-card-header">
                        <div>
                          <div className="company-logo">{getCompanyInitial(job.company)}</div>
                        </div>
                        {status && <span className={badgeClass(status)}>{status}</span>}
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
                          Deadline: {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                      )}

                      <div className="job-card-actions">
                        {status ? (
                          <span className={badgeClass(status)}>{status}</span>
                        ) : !eligible ? (
                          <span style={{ fontSize: "12px", color: "var(--danger)" }}>
                            CGPA too low ({job.eligibility} required)
                          </span>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => applyJob(job._id)}
                            disabled={applying === job._id}
                            style={{ width: "100%", justifyContent: "center" }}
                          >
                            {applying === job._id ? "Applying…" : "Apply Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* MY APPLICATIONS TAB */}
        {activeTab === "applied" && (
          <div>
            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>You haven't applied to any jobs yet. Browse and apply!</p>
              </div>
            ) : (
              applications.map((app) => (
                <div className="app-row" key={app._id}
                  style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                  <div>
                    <div className="app-row-name">{app.jobId?.company || "—"}</div>
                    <div className="app-row-detail">{app.jobId?.role}</div>
                  </div>
                  <div>
                    {app.jobId?.package && <div className="app-row-detail">💰 {app.jobId.package} LPA</div>}
                    {app.jobId?.location && <div className="app-row-detail">📍 {app.jobId.location}</div>}
                    {app.createdAt && (
                      <div className="app-row-detail" style={{ marginTop: "4px" }}>
                        Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    )}
                  </div>
                  <span className={badgeClass(app.status)}>{app.status}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
