import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cgpa: ""
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
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful!");
      window.location.href = "/login";
      console.log(res.data);
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message || "Error signing up");
      } else {
        alert("Server not responding or network error");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
        <input name="email" placeholder="Email" onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
        <input name="cgpa" placeholder="CGPA" onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />

        <button type="submit" style={{ width: "100%" }}>
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;