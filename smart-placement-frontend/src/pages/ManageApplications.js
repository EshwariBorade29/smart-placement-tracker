import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const STATUS_OPTIONS = ["Applied", "Interview", "Selected", "Rejected"];

const badgeClass = (status) => {
  const map = { Applied: "badge-applied", Interview: "badge-interview", Selected: "badge-selected", Rejected: "badge-rejected" };
  return `badge ${map[status] || "badge-applied"}`;
};

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await API.get("/applications");
      setApplications(res.data);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/status/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchApps();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <>
      <Navbar role="admin" />

      <div className="page">
        <div className="page-header">
          <h1>Manage Applications</h1>
          <p>Review and update student application statuses</p>
        </div>

        {/* STATS */}
        <div className="stats-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "24px" }}>
          {STATUS_OPTIONS.map(s => (
            <div className="stat-card" key={s}
              style={{ cursor: "pointer", borderColor: filter === s ? "var(--accent)" : "" }}
              onClick={() => setFilter(s === filter ? "All" : s)}
            >
              <div className="stat-card-num">{counts[s] || 0}</div>
              <div className="stat-card-label">
                <span className={badgeClass(s)}>{s}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["All", ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(s)}
            >
              {s} {s !== "All" && `(${counts[s] || 0})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state"><p>Loading applications…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No applications {filter !== "All" ? `with status "${filter}"` : "found"}.</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div className="app-row" key={app._id}>
              {/* STUDENT INFO */}
              <div>
                <div className="app-row-name">{app.userId?.name || "Unknown Student"}</div>
                <div className="app-row-detail">{app.userId?.email} · CGPA {app.userId?.cgpa ?? "N/A"}</div>
              </div>

              {/* JOB INFO */}
              <div>
                <div className="app-row-name">{app.jobId?.company || "—"}</div>
                <div className="app-row-detail">
                  {app.jobId?.role}
                  {app.jobId?.package ? ` · ${app.jobId.package} LPA` : ""}
                  {app.jobId?.location ? ` · ${app.jobId.location}` : ""}
                </div>
              </div>

              {/* STATUS */}
              <span className={badgeClass(app.status)}>{app.status}</span>

              {/* ACTIONS */}
              <div className="app-actions">
                {app.status !== "Interview" && (
                  <button className="btn btn-sm btn-ghost" onClick={() => updateStatus(app._id, "Interview")}
                    style={{ color: "var(--accent3)", borderColor: "rgba(247,201,79,0.3)" }}>
                    Interview
                  </button>
                )}
                {app.status !== "Selected" && (
                  <button className="btn btn-sm btn-success" onClick={() => updateStatus(app._id, "Selected")}>
                    Select
                  </button>
                )}
                {app.status !== "Rejected" && (
                  <button className="btn btn-sm btn-danger" onClick={() => updateStatus(app._id, "Rejected")}>
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ManageApplications;
