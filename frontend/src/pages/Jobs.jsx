import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FiBriefcase, FiSearch, FiUsers, FiArrowRight, FiPlusCircle } from "react-icons/fi";

function Jobs() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [department, setDepartment] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoadingJobs(true);
            const response = await axios.get("http://127.0.0.1:5000/jobs");
            setJobs(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingJobs(false);
        }
    };

    const createJob = async () => {
        if (!title || !description || !requiredSkills) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("http://127.0.0.1:5000/jobs", {
                title,
                description,
                required_skills: requiredSkills,
                user_id: 1,
                department,
                employment_type: employmentType,
                status: "Open"
            });
            alert(response.data.message);
            setTitle("");
            setDescription("");
            setRequiredSkills("");
            setDepartment("");
            setEmploymentType("");
            setShowForm(false);
            loadJobs();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create job.");
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        Open: { bg: "#e8f8ee", color: "#16a34a" },
        Paused: { bg: "#fef6e7", color: "#d97706" },
        Closed: { bg: "#f1f4f8", color: "#6b7280" }
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Navbar />
            <div style={{ background: "#f4f8ff", minHeight: "100vh" }}>
                <div className="container py-5">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold" style={{ color: "#122a5e", fontSize: "34px" }}>
                                Jobs
                            </h1>
                            <p className="text-muted mb-0">
                                Manage your open roles and track applicants per position.
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
                            onClick={() => setShowForm(!showForm)}>
                            <FiBriefcase size={18} />
                            {showForm ? "Close" : "Create job"}
                        </button>
                    </div>

                    {/* Create job form (toggle) */}
              {showForm && (
    <div
        className="mb-4"
        style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "#122a5e", fontSize: "20px" }}>
            <FiPlusCircle size={20} />
            Create New Job
        </h5>

        <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
            Job Title
        </label>
        <input
            className="form-control mb-3"
            placeholder="e.g. Senior Frontend Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "12px 14px", borderRadius: "10px" }}
        />

        <div className="row g-3 mb-3">
            <div className="col-md-6">
                <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                    Department
                </label>
                <input
                    className="form-control"
                    placeholder="e.g. Engineering"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "10px" }}
                />
            </div>
            <div className="col-md-6">
                <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                    Employment Type
                </label>
                <input
                    className="form-control"
                    placeholder="e.g. Full-time, Remote"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    style={{ padding: "12px 14px", borderRadius: "10px" }}
                />
            </div>
        </div>

        <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
            Job Description
        </label>
        <textarea
            className="form-control mb-3"
            rows="5"
            placeholder="Describe the role, responsibilities, and expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: "12px 14px", borderRadius: "10px", resize: "vertical" }}
        />

        <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
            Required Skills
        </label>
        <input
            className="form-control mb-4"
            placeholder="Python, Flask, SQL..."
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            style={{ padding: "12px 14px", borderRadius: "10px" }}
        />

        <div className="d-flex gap-3">
            <button
                className="btn"
                style={{
                    background: "#4f7fe8",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "10px 28px",
                    border: "none"
                }}
                onClick={createJob}
                disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
            </button>
            <button
                className="btn"
                style={{
                    background: "#fff",
                    color: "#6b7280",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "10px 28px",
                    border: "1px solid #e2e8f0"
                }}
                onClick={() => setShowForm(false)}>
                Cancel
            </button>
        </div>
    </div>
)}

                    {/* Search + filters */}
                    <div
                        className="d-flex flex-wrap gap-3 align-items-center mb-4"
                        style={{
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "20px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                        }}>
                        <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
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
                                placeholder="Search job titles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: "40px" }}
                            />
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                            {["All", "Open", "Paused", "Closed"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className="btn"
                                    style={{
                                        background: statusFilter === s ? "#4f7fe8" : "#fff",
                                        color: statusFilter === s ? "#fff" : "#122a5e",
                                        border: statusFilter === s ? "none" : "1px solid #e2e8f0",
                                        fontWeight: 600,
                                        borderRadius: "10px",
                                        padding: "8px 18px"
                                    }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job cards */}
                    {loadingJobs ? (
                        <p className="text-muted">Loading jobs...</p>
                    ) : filteredJobs.length === 0 ? (
                        <p className="text-muted">No jobs found.</p>
                    ) : (
                        <div className="row g-4">
                            {filteredJobs.map((job) => {
                                const statusStyle = statusColors[job.status] || statusColors.Open;
                                return (
                                    <div key={job.id} className="col-lg-4 col-md-6">
                                        <div
                                            style={{
                                                background: "#fff",
                                                borderRadius: "18px",
                                                padding: "24px",
                                                height: "100%",
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                            }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div
                                                    style={{
                                                        width: "44px",
                                                        height: "44px",
                                                        borderRadius: "12px",
                                                        background: "#eaf2ff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}>
                                                    <FiBriefcase size={20} color="#4f7fe8" />
                                                </div>
                                                <span
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        fontWeight: 600,
                                                        fontSize: "13px",
                                                        padding: "5px 14px",
                                                        borderRadius: "20px"
                                                    }}>
                                                    {job.status}
                                                </span>
                                            </div>

                                            <h5 className="fw-bold mb-1" style={{ color: "#122a5e" }}>
                                                {job.title}
                                            </h5>
                                            {job.department && (
                                                <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                    {job.department}
                                                </p>
                                            )}

                                            {job.employment_type && (
                                                <div className="mb-3">
                                                    {job.employment_type.split(",").map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="me-2"
                                                            style={{
                                                                background: "#f1f4f8",
                                                                color: "#4b5563",
                                                                fontSize: "13px",
                                                                fontWeight: 500,
                                                                padding: "4px 12px",
                                                                borderRadius: "20px"
                                                            }}>
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <hr style={{ margin: "16px 0" }} />

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-2 text-muted">
                                                    <FiUsers size={16} />
                                                    <span>{job.applicant_count} applicants</span>
                                                </div>
                                                <button
                                                    className="btn btn-sm d-flex align-items-center gap-1"
                                                    style={{
                                                        border: "1px solid #e2e8f0",
                                                        color: "#122a5e",
                                                        fontWeight: 600,
                                                        borderRadius: "8px"
                                                    }}
                                                    onClick={() => navigate(`/applicants?job_id=${job.id}`)}>
                                                    View <FiArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default Jobs;