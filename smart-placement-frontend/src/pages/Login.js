import { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // 🔥 SAVE TOKEN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);

      alert("Login successful!");
      window.location.href = "/dashboard";
      console.log(res.data);

    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message || "Login failed");
      } else {
        alert("Server error");
      }
    }
  };

  return (
  <div style={{ maxWidth: "400px", margin: "50px auto" }}>
    <h2>Login</h2>

    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

      <button type="submit" style={{ width: "100%" }}>
        Login
      </button>
    </form>
  </div>
);
}

export default Login;