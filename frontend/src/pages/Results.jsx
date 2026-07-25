import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FiCheck, FiX, FiMail } from "react-icons/fi";

function Results() {
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/analysis-results");
            setResults(response.data);
            if (response.data.length > 0) {
                setSelected(response.data[0]);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to load results.");
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    };

    const advanceToInterview = async () => {
        if (!selected) return;
        try {
            setUpdating(true);
            await axios.put(
                `http://127.0.0.1:5000/applicants/${selected.applicant_id}/status`,
                { status: "Interview" }
            );
            alert(`${selected.applicant_name} moved to Interview stage.`);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    const contactCandidate = () => {
        if (!selected?.applicant_email) return;
        window.location.href = `mailto:${selected.applicant_email}`;
    };

    return (
        <>
            <Navbar />
            <div style={{ background: "#f4f8ff", minHeight: "100vh" }}>
                <div className="container py-5">
                    <div className="mb-5">
                        <h1 className="fw-bold" style={{ color: "#163b88", fontSize: "40px" }}>
                            AI Screening Results
                        </h1>
                        <p className="text-muted" style={{ fontSize: "18px" }}>
                            Detailed, explainable match analysis for screened candidates.
                        </p>
                    </div>

                    <div className="row">
                        {/* LEFT SIDE */}
                        <div className="col-lg-4 mb-4">
                            <div className="card p-4" style={{ borderRadius: "22px" }}>
                                <h4 className="fw-bold mb-4" style={{ color: "#163b88" }}>
                                    Screened candidates
                                </h4>

                                {results.length === 0 ? (
                                    <p className="text-muted">No screened candidates yet.</p>
                                ) : (
                                    results.map((result) => (
                                        <div
                                            key={result.id}
                                            onClick={() => setSelected(result)}
                                            className="d-flex justify-content-between align-items-center mb-3"
                                            style={{
                                                cursor: "pointer",
                                                border: selected?.id === result.id
                                                    ? "2px solid #7db7ff"
                                                    : "1px solid #edf2f7",
                                                borderRadius: "16px",
                                                padding: "18px",
                                                transition: ".3s"
                                            }}>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    style={{
                                                        width: "45px",
                                                        height: "45px",
                                                        borderRadius: "50%",
                                                        background: "#edf5ff",
                                                        color: "#4f7fe8",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        fontWeight: "700",
                                                        flexShrink: 0
                                                    }}>
                                                    {getInitials(result.applicant_name)}
                                                </div>
                                                <div className="ms-3">
                                                    <div className="fw-bold">{result.applicant_name}</div>
                                                    <small className="text-muted">{result.job_title}</small>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    color: "#16a34a",
                                                    fontWeight: "700",
                                                    fontSize: "22px"
                                                }}>
                                                {result.match_score}%
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="col-lg-8 mb-4">
                            {selected && (
                                <div className="card p-5" style={{ borderRadius: "22px" }}>
                                    <div className="row align-items-center">
                                        <div className="col-md-3 text-center">
                                            <div
                                                style={{
                                                    width: "170px",
                                                    height: "170px",
                                                    borderRadius: "50%",
                                                    border: "12px solid #16a34a",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    margin: "auto"
                                                }}>
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize: "40px",
                                                            fontWeight: "700",
                                                            color: "#16a34a"
                                                        }}>
                                                        {selected.match_score}%
                                                    </div>
                                                    <div className="text-muted">Match</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <h2 className="fw-bold" style={{ color: "#163b88" }}>
                                                {selected.applicant_name}
                                            </h2>
                                            <h5 className="text-muted mb-2">{selected.job_title}</h5>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: "#eaf2ff",
                                                    color: "#3b6fe0",
                                                    fontSize: "14px",
                                                    padding: "8px 16px"
                                                }}>
                                                {selected.recommendation}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mt-5">
                                        <div className="col-lg-6">
                                            <div className="card p-4" style={{ background: "#f8fbff", borderRadius: "18px" }}>
                                                <h4 className="fw-bold mb-4" style={{ color: "#163b88" }}>
                                                    Match summary
                                                </h4>
                                                <div className="mb-4">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <strong>Resume Similarity</strong>
                                                        <span>{selected.match_score}%</span>
                                                    </div>
                                                    <div className="progress" style={{ height: "10px" }}>
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${selected.match_score}%`,
                                                                background: "#16a34a"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-1">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <strong>Matching Skills</strong>
                                                        <span>
                                                            {selected.matching_skills
                                                                ? selected.matching_skills.split(",").filter(s => s.trim()).length
                                                                : 0}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <strong>Missing Skills</strong>
                                                        <span>
                                                            {selected.missing_skills
                                                                ? selected.missing_skills.split(",").filter(s => s.trim()).length
                                                                : 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="card p-4" style={{ background: "#f8fbff", borderRadius: "18px" }}>
                                                <h4 className="fw-bold mb-4" style={{ color: "#163b88" }}>
                                                    Keyword Match
                                                </h4>
                                                <h6 className="text-success mb-3">MATCHED</h6>
                                                <div className="mb-4">
                                                    {selected.matching_skills && selected.matching_skills.trim() ? (
                                                        selected.matching_skills.split(",").map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="badge me-2 mb-2"
                                                                style={{
                                                                    background: "#dcfce7",
                                                                    color: "#15803d",
                                                                    padding: "10px 15px",
                                                                    fontSize: "14px"
                                                                }}>
                                                                <FiCheck className="me-1" />
                                                                {skill.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-muted">None</p>
                                                    )}
                                                </div>
                                                <h6 className="text-danger mb-3">MISSING</h6>
                                                <div>
                                                    {selected.missing_skills && selected.missing_skills.trim() ? (
                                                        selected.missing_skills.split(",").map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="badge me-2 mb-2"
                                                                style={{
                                                                    background: "#fee2e2",
                                                                    color: "#dc2626",
                                                                    padding: "10px 15px",
                                                                    fontSize: "14px"
                                                                }}>
                                                                <FiX className="me-1" />
                                                                {skill.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-muted">None</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="d-flex gap-3 mt-4">
                                        <button
                                            className="btn d-flex align-items-center gap-2"
                                            style={{
                                                background: "#4f7fe8",
                                                color: "#fff",
                                                fontWeight: 600,
                                                borderRadius: "10px",
                                                padding: "12px 24px",
                                                border: "none"
                                            }}
                                            onClick={advanceToInterview}
                                            disabled={updating}>
                                            <FiCheck size={16} />
                                            {updating ? "Updating..." : "Advance to interview"}
                                        </button>
                                        <button
                                            className="btn d-flex align-items-center gap-2"
                                            style={{
                                                background: "#fff",
                                                border: "1px solid #e2e8f0",
                                                color: "#122a5e",
                                                fontWeight: 600,
                                                borderRadius: "10px",
                                                padding: "12px 24px"
                                            }}
                                            onClick={contactCandidate}>
                                            <FiMail size={16} />
                                            Contact candidate
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Results;