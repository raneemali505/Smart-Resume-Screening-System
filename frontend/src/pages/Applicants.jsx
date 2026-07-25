import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
function Applicants() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    useEffect(() => {
        loadApplicants();
    }, []);
    const loadApplicants = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://127.0.0.1:5000/applicants"
            );
            setApplicants(response.data);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to load applicants."
            );
        } finally {
            setLoading(false);
        }
    };
    const updateStatus = async (applicantId, newStatus) => {
        try {
            await axios.put(
                `http://127.0.0.1:5000/applicants/${applicantId}/status`,
                {
                    status: newStatus
                }
            );
            setApplicants((prev) =>
                prev.map((a) =>
                    a.id === applicantId
                        ? { ...a, status: newStatus }
                        : a
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update status."
            );
        }
    };
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    };
    const statusColors = {
        New: {
            bg: "#f1f4f8",
            color: "#6b7280"
        },
        Screened: {
            bg: "#eaf2ff",
            color: "#3b6fe0"
        },
        Interview: {
            bg: "#fef6e7",
            color: "#d97706"
        },
        Offer: {
            bg: "#e8f8ee",
            color: "#16a34a"
        }
    };
    const getMatchColor = (score) => {
        if (score >= 80) return "#16a34a";
        if (score >= 60) return "#d97706";
        return "#dc2626";
    };
    const exportCSV = () => {
        const headers = [
            "Name",
            "Email",
            "Applied For",
            "Experience",
            "AI Match",
            "Status"
        ];
        const rows = filteredApplicants.map((a) => [
            a.name,
            a.email,
            a.job_title,
            a.experience_years
                ? `${a.experience_years} yrs`
                : "—",
            a.match_score !== null
                ? `${a.match_score}%`
                : "—",
            a.status
        ]);
        const csvContent =
            [headers, ...rows]
                .map((row) =>
                    row.map((v) => `"${v}"`).join(",")
                )
                .join("\n");
        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv"
            }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "applicants.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
    const filteredApplicants = applicants.filter((a) => {
        const matchesSearch =
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            (a.job_title || "")
                .toLowerCase()
                .includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "All" ||
            a.status === statusFilter;
        return matchesSearch && matchesStatus;

    });
    return (
        <>
            <Navbar />
            <div
                style={{
                    background: "#f4f8ff",
                    minHeight: "100vh"
                }}
            >
                <div className="container py-5">
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h1
                                className="fw-bold"
                                style={{
                                    color: "#122a5e",
                                    fontSize: "34px"
                                }}
                            >
                                Applicants
                            </h1>
                            <p className="text-muted mb-0">
                                All candidates across your open positions, ranked by AI match score.
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn d-flex align-items-center gap-2"
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e2e8f0",
                                    color: "#122a5e",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    padding: "10px 18px"
                                }}
                                onClick={() =>
                                    setShowFilters(!showFilters)
                                }
                            >
                                <FiFilter size={16} />
                                Filters
                            </button>
                            <button
                                className="btn d-flex align-items-center gap-2"
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e2e8f0",
                                    color: "#122a5e",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    padding: "10px 18px"
                                }}
                                onClick={exportCSV}
                            >
                                <FiDownload size={16} />
                                Export
                            </button>
                        </div>
                    </div>
                                        {showFilters && (
                        <div
                            className="mb-4 d-flex gap-2 flex-wrap"
                            style={{
                                background: "#fff",
                                borderRadius: "14px",
                                padding: "16px 20px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                            }}
                        >
                            {["All", "New", "Screened", "Interview", "Offer"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className="btn btn-sm"
                                    style={{
                                        background: statusFilter === s ? "#4f7fe8" : "#f1f4f8",
                                        color: statusFilter === s ? "#fff" : "#4b5563",
                                        fontWeight: 600,
                                        borderRadius: "8px",
                                        padding: "6px 16px",
                                        border: "none"
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                    <div
                        className="mb-4"
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "20px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <FiSearch
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9aa5b1"
                                }}
                            />
                            <input
                                className="form-control"
                                placeholder="Search by name or role..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    paddingLeft: "40px",
                                    padding: "12px 12px 12px 40px",
                                    borderRadius: "10px"
                                }}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "10px 28px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                        }}
                    >
                        {loading ? (
                            <p className="text-muted py-4">
                                Loading applicants...
                            </p>
                        ) : filteredApplicants.length === 0 ? (
                            <p className="text-muted py-4">
                                No applicants found.
                            </p>
                        ) : (
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr style={{ fontSize: "12px", color: "#9aa5b1" }}>
                                        <th className="border-0 py-3">CANDIDATE</th>
                                        <th className="border-0 py-3">APPLIED FOR</th>
                                        <th className="border-0 py-3">EXPERIENCE</th>
                                        <th className="border-0 py-3">AI MATCH</th>
                                        <th className="border-0 py-3">STAGE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplicants.map((a) => {
                                        const statusStyle =
                                            statusColors[a.status] || statusColors.New;
                                        return (
                                            <tr key={a.id}>
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
                                                            }}
                                                        >
                                                            {getInitials(a.name)}
                                                        </div>
                                                        <div>
                                                            <div
                                                                className="fw-semibold"
                                                                style={{ color: "#122a5e" }}
                                                            >
                                                                {a.name}
                                                            </div>
                                                            <div
                                                                className="text-muted"
                                                                style={{ fontSize: "13px" }}
                                                            >
                                                                {a.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-0 py-3">
                                                    {a.job_title || "—"}
                                                </td>
                                                <td className="border-0 py-3">
                                                    {a.experience_years
                                                        ? `${a.experience_years} yrs`
                                                        : "—"}
                                                </td>
                                                <td className="border-0 py-3">
                                                    {a.match_score !== null ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div
                                                                style={{
                                                                    width: "80px",
                                                                    height: "6px",
                                                                    background: "#eef2f7",
                                                                    borderRadius: "6px",
                                                                    overflow: "hidden"
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: `${a.match_score}%`,
                                                                        height: "100%",
                                                                        background: getMatchColor(a.match_score)
                                                                    }}
                                                                />
                                                            </div>
                                                            <span
                                                                className="fw-semibold"
                                                                style={{
                                                                    color: getMatchColor(a.match_score)
                                                                }}
                                                            >
                                                                {a.match_score}%
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border-0 py-3">
                                                    <select
                                                        value={a.status}
                                                        onChange={(e) =>
                                                            updateStatus(a.id, e.target.value)
                                                        }
                                                        style={{
                                                            background: statusStyle.bg,
                                                            color: statusStyle.color,
                                                            border: "none",
                                                            borderRadius: "20px",
                                                            padding: "6px 12px",
                                                            fontWeight: 600,
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <option value="New">New</option>
                                                        <option value="Screened">Screened</option>
                                                        <option value="Interview">Interview</option>
                                                        <option value="Offer">Offer</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Applicants;