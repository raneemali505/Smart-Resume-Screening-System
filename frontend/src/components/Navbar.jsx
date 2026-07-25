import { Link, useLocation } from "react-router-dom";
import {
    FiHome,
    FiBriefcase,
    FiUsers,
    FiBarChart2,
    FiLogOut
} from "react-icons/fi";
function Navbar() {
    const location = useLocation();
    return (
        <div className="container mt-4">
            <nav
                className="navbar navbar-expand-lg px-4 py-3"
                style={{
                    background: "linear-gradient(90deg,#1d4ed8,#2563eb)",
                    borderRadius: "18px",
                    boxShadow: "0 10px 25px rgba(37,99,235,.25)"
                }}
            >
                <Link
                    className="navbar-brand text-white fw-bold fs-4"
                    to="/dashboard"
                >
                    AI Resume Matching
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >
                    <div className="navbar-nav ms-auto align-items-center">
                        <Link
                            className={`nav-link text-white mx-2 ${
                                location.pathname === "/dashboard"
                                    ? "fw-bold"
                                    : ""
                            }`}
                            to="/dashboard"
                        >
                            <FiHome className="me-2" />
                            Dashboard
                        </Link>
                        <Link
                            className={`nav-link text-white mx-2 ${
                                location.pathname === "/jobs"
                                    ? "fw-bold"
                                    : ""
                            }`}
                            to="/jobs"
                        >
                            <FiBriefcase className="me-2" />
                            Jobs
                        </Link>
                        <Link
                            className={`nav-link text-white mx-2 ${
                                location.pathname === "/applicants"
                                    ? "fw-bold"
                                    : ""
                            }`}
                            to="/applicants"
                        >
                            <FiUsers className="me-2" />
                            Applicants
                        </Link>
                        <Link
                            className={`nav-link text-white mx-2 ${
                                location.pathname === "/results"
                                    ? "fw-bold"
                                    : ""
                            }`}
                            to="/results"
                        >
                            <FiBarChart2 className="me-2" />
                            Results
                        </Link>
                        <Link
                            to="/"
                            className="btn btn-light ms-3"
                            style={{
                                borderRadius: "10px",
                                fontWeight: "600",
                                color: "#2563eb"
                            }}
                        >
                            <FiLogOut className="me-2" />
                            Logout
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}
export default Navbar;