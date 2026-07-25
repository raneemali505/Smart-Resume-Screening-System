import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
    FiBriefcase,
    FiUsers,
    FiPlus,
    FiStar,
    FiCheckCircle
} from "react-icons/fi";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, applicantsRes] = await Promise.all([
                    axios.get("http://127.0.0.1:5000/dashboard-stats"),
                    axios.get("http://127.0.0.1:5000/recent-applicants")
                ]);
                setStats(statsRes.data);
                setApplicants(applicantsRes.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    };

    const statCards = stats ? [
        {
            icon: <FiBriefcase size={22} color="#4f7fe8" />,
            value: stats.active_jobs,
            label: "Active Jobs"
        },
        {
            icon: <FiUsers size={22} color="#4f7fe8" />,
            value: stats.total_applicants,
            label: "Total Applicants"
        },
        {
            icon: <FiPlus size={22} color="#4f7fe8" />,
            value: stats.screened,
            label: "Screened by AI"
        },
        {
            icon: <FiStar size={22} color="#4f7fe8" />,
            value: stats.shortlisted,
            label: "Shortlisted"
        }
    ] : [];

    return (
        <>
            <Navbar />
            <div style={{ background: "#f4f8ff", minHeight: "100vh" }}>
                <div className="container py-5">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold" style={{ color: "#122a5e", fontSize: "34px" }}>
                                Dashboard
                            </h1>
                            <p className="text-muted mb-0">
                                Here's what's happening with your recruitment pipeline.
                            </p>
                        </div>
                        <button
                            className="btn d-flex align-items-center gap-2"
                            style={{
                                background: "#4f7fe8",
                                color: "#fff",
                                fontWeight: 600,
                                borderRadius: "10px",
                                padding: "12px 20px",
                                border: "none"
                            }}
                            onClick={() => navigate("/jobs")}>
                            <FiBriefcase size={18} />
                            <span style={{ textDecoration: "underline" }}>Post a new job</span>
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-muted">Loading dashboard data...</p>
                    ) : (
                        <>
                            {/* Stat cards */}
                            <div className="row g-4 mb-4">
                                {statCards.map((s, i) => (
                                    <div className="col-6 col-lg-3" key={i}>
                                        <div
                                            style={{
                                                background: "#fff",
                                                borderRadius: "18px",
                                                padding: "24px",
                                                height: "100%",
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                            }}>
                                            <div
                                                style={{
                                                    width: "44px",
                                                    height: "44px",
                                                    borderRadius: "12px",
                                                    background: "#eaf2ff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginBottom: "18px"
                                                }}>
                                                {s.icon}
                                            </div>
                                            <div className="fw-bold" style={{ fontSize: "28px", color: "#122a5e" }}>
                                                {s.value}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: "14px" }}>
                                                {s.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent applicants */}
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: "18px",
                                    padding: "28px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0" style={{ color: "#122a5e" }}>
                                        Recent applicants
                                    </h5>
                                    <button
                                        className="btn btn-link p-0"
                                        style={{ color: "#4f7fe8", fontWeight: 600, textDecoration: "none" }}
                                        onClick={() => navigate("/applicants")}>
                                        View all
                                    </button>
                                </div>

                                {applicants.length === 0 ? (
                                    <p className="text-muted mb-0">No applicants yet.</p>
                                ) : (
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr style={{ fontSize: "12px", color: "#9aa5b1" }}>
                                                <th className="fw-semibold border-0">CANDIDATE</th>
                                                <th className="fw-semibold border-0">AI SCORE</th>
                                                <th className="fw-semibold border-0">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applicants.map((a) => (
                                                <tr key={a.id} style={{ borderColor: "#f1f4f8" }}>
                                                    <td className="border-0 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    borderRadius: "50%",
                                                                    background: "#eaf2ff",
                                                                    color: "#4f7fe8",
                                                                    fontWeight: 700,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}>
                                                                {getInitials(a.name)}
                                                            </div>
                                                            <div>
                                                                <div className="fw-semibold" style={{ color: "#122a5e" }}>
                                                                    {a.name}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: "13px" }}>
                                                                    {a.job_title}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0 py-3">
                                                        {a.match_score !== null ? (
                                                            <span
                                                                style={{
                                                                    background: "#e8f8ee",
                                                                    color: "#16a34a",
                                                                    fontWeight: 600,
                                                                    fontSize: "13px",
                                                                    padding: "5px 12px",
                                                                    borderRadius: "20px"
                                                                }}>
                                                                {a.match_score}% match
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">—</span>
                                                        )}
                                                    </td>
                                                    <td className="border-0 py-3 text-muted d-flex align-items-center gap-2">
                                                        <FiCheckCircle
                                                            color={a.status === "Screened" ? "#16a34a" : "#9aa5b1"}
                                                        />
                                                        {a.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
export default Dashboard;