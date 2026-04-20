function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/dashboard";
    return null;
  }

  return children;
}

export default PublicRoute;