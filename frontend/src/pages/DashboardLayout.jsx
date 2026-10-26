import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice.js";

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="welcome-text">Welcome, {user?.username}</div>
      </header>
      <nav className="dashboard-nav">
        <NavLink to="/dashboard" end className="nav-link d-inline">
          Home
        </NavLink>
        <NavLink to="/dashboard/quiz" className="nav-link d-inline">
          Quiz
        </NavLink>
        <NavLink to="/dashboard/article" className="nav-link d-inline">
          Article
        </NavLink>
        <button type="button" className="nav-link d-inline btn btn-link p-0 border-0" onClick={onLogout}>
          Logout
        </button>
      </nav>
      <Outlet />
    </div>
  );
}
