import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-bg-glow" />

      <div className="home-badge">Campus Placement Portal</div>

      <h1 className="home-title">
        Your Career<br />
        <span>Starts Here</span>
      </h1>

      <p className="home-sub">
        Browse top companies, apply in one click, and track every step
        of your placement journey — all in one place.
      </p>

      <div className="home-btns">
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Sign In →
        </button>
        <button className="btn btn-ghost" onClick={() => navigate("/signup")}>
          Create Account
        </button>
      </div>

      <div className="home-stats">
        <div className="stat-item">
          <div className="stat-num">120+</div>
          <div className="stat-label">Companies</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">1.4k</div>
          <div className="stat-label">Students Placed</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">98%</div>
          <div className="stat-label">Satisfaction</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
