import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user) {
    return <Navigate to={user.role === "student" ? "/student" : "/dashboard"} replace />;
  }

  return children;
}

export default PublicRoute;
