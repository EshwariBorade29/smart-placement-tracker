import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", cgpa: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleTab = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Please fill all required fields");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">🎯</div>
          <span className="auth-brand-name">PlaceMe</span>
        </div>

        <h2 className="auth-headline">
          Join thousands<br />
          of students<br />
          <span>getting placed</span>
        </h2>
        <p className="auth-sub">
          Sign up in under a minute. Browse jobs, apply instantly,
          and get notified when recruiters update your status.
        </p>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">⚡</div>
            One-click job applications
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🔔</div>
            Instant status notifications
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">📋</div>
            Complete application history
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h3 className="auth-form-title">Create account</h3>
          <p className="auth-form-sub">Set up your profile to get started</p>

          <div className="role-tabs">
            <button
              className={`role-tab ${form.role === "student" ? "active" : ""}`}
              onClick={() => handleRoleTab("student")}
              type="button"
            >
              🎓 Student
            </button>
            <button
              className={`role-tab ${form.role === "admin" ? "active" : ""}`}
              onClick={() => handleRoleTab("admin")}
              type="button"
            >
              🛡️ Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
            </div>

            {form.role === "student" && (
              <div className="form-group">
                <label className="form-label">CGPA (out of 10)</label>
                <input
                  className="form-input"
                  name="cgpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.5"
                  value={form.cgpa}
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", marginTop: "8px", padding: "12px" }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
