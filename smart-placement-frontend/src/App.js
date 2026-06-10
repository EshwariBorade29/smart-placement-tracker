import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ManageApplications from "./pages/ManageApplications";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute><Signup /></PublicRoute>
        } />

        {/* ADMIN ROUTES */}
        <Route path="/dashboard" element={
          <PrivateRoute role="admin"><Dashboard /></PrivateRoute>
        } />
        <Route path="/manage" element={
          <PrivateRoute role="admin"><ManageApplications /></PrivateRoute>
        } />

        {/* STUDENT ROUTES */}
        <Route path="/student" element={
          <PrivateRoute role="student"><StudentDashboard /></PrivateRoute>
        } />

        <Route path="*" element={
          <div style={{ textAlign: "center", padding: "80px", color: "var(--text2)" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "48px", color: "var(--text)" }}>404</h2>
            <p style={{ color: "var(--text2)", marginBottom: "24px" }}>This page doesn't exist.</p>
            <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>← Go Home</a>
          </div>
        } />
        
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ background: "#0e1521", border: "1px solid rgba(99,140,210,0.2)" }}
      />
    </Router>
  );
}

export default App;
