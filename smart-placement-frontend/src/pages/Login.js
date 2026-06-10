import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleTab = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back! 🎉");
      window.location.href = res.data.user.role === "student" ? "/student" : "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          Land your<br />
          <span>dream job</span><br />
          from campus
        </h2>
        <p className="auth-sub">
          Connect directly with top recruiters, track your applications,
          and manage your entire placement process in one streamlined portal.
        </p>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon">🏢</div>
            Browse hundreds of verified job listings
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">📊</div>
            Real-time application status tracking
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">🔒</div>
            Secure, role-based access control
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h3 className="auth-form-title">Sign in</h3>
          <p className="auth-form-sub">Welcome back — pick your role to continue</p>

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
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", marginTop: "8px", padding: "12px" }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="auth-footer">
            New to PlaceMe? <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
