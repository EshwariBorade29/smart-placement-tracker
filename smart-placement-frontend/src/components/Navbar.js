import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      background: "#282c34",
      color: "white"
    }}>
      <h3>Placement Portal</h3>

      <div>
        <Link to="/dashboard" style={{ color: "white", marginRight: "10px" }}>
          TNP
        </Link>

        <Link to="/student" style={{ color: "white", marginRight: "10px" }}>
          Student
        </Link>

        <Link to="/login" style={{ color: "white", marginRight: "10px"  }}>
          Login
        </Link>

        <Link to="/manage" style={{ color: "white", marginRight: "10px" }}>
          Manage
        </Link>
      </div>
    </div>
  );
}

export default Navbar;