import { useNavigate } from "react-router-dom";
import { Building2, FileText, ArrowRight, Plus } from "lucide-react";

function Home() {
    const navigate = useNavigate();
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #eaf2ff 0%, #f5f9ff 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px 20px"
            }}>
            <div style={{ width: "100%", maxWidth: "1000px", textAlign: "center" }}>

                {/* Badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#ffffff",
                        border: "1px solid #dbe7fb",
                        color: "#3b6fe0",
                        fontWeight: 600,
                        fontSize: "14px",
                        padding: "8px 18px",
                        borderRadius: "30px",
                        marginBottom: "28px"
                    }}>
                    <Plus size={16} />
                    AI-Powered Recruitment Platform
                </div>

                {/* Heading */}
                <h1
                    className="fw-bold"
                    style={{
                        fontSize: "56px",
                        lineHeight: "1.15",
                        color: "#122a5e",
                        marginBottom: "24px"
                    }}>
                    Smart Resume Screening System
                </h1>

                {/* Subtitle */}
                <p
                    className="mx-auto mb-5"
                    style={{
                        maxWidth: "680px",
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#5b6472"
                    }}>
                    Simplify recruitment with intelligent resume screening and precise
                    candidate matching, so your team hires the right people faster.
                </p>

                {/* Cards */}
                <div className="row justify-content-center g-4">
                    {/* HR Portal */}
                    <div className="col-md-5">
                        <div
                            className="text-start h-100"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e7edf7",
                                borderRadius: "20px",
                                padding: "32px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                            }}>
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "#eaf2ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px"
                                }}>
                                <Building2 size={22} color="#3b6fe0" />
                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    color: "#7ea3e8",
                                    marginBottom: "6px"
                                }}>
                                FOR RECRUITERS
                            </div>

                            <h3
                                className="fw-bold mb-3"
                                style={{ color: "#122a5e", fontSize: "24px" }}>
                                HR Portal
                            </h3>

                            <p className="text-muted mb-4">
                                Post jobs, review applicants, and explore AI screening
                                results in one streamlined workspace.
                            </p>

                            <button
                                className="btn d-inline-flex align-items-center gap-2"
                                style={{
                                    background: "#4f7fe8",
                                    color: "#fff",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    padding: "10px 20px",
                                    textDecoration: "underline",
                                    border: "none"
                                }}
                                onClick={() => navigate("/login")}>
                                Login as HR <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Applicant Portal */}
                    <div className="col-md-5">
                        <div
                            className="text-start h-100"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e7edf7",
                                borderRadius: "20px",
                                padding: "32px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                            }}>
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "#eaf2ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px"
                                }}>
                                <FileText size={22} color="#3b6fe0" />
                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    color: "#7ea3e8",
                                    marginBottom: "6px"
                                }}>
                                FOR CANDIDATES
                            </div>

                            <h3
                                className="fw-bold mb-3"
                                style={{ color: "#122a5e", fontSize: "24px" }}>
                                Applicant Portal
                            </h3>

                            <p className="text-muted mb-4">
                                Upload your resume, apply to open roles, and get
                                instantly matched to the right opportunities.
                            </p>

                            <button
                                className="btn d-inline-flex align-items-center gap-2"
                                style={{
                                    background: "#4f7fe8",
                                    color: "#fff",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    padding: "10px 20px",
                                    textDecoration: "underline",
                                    border: "none"
                                }}
                                onClick={() => navigate("/apply")}>
                                Apply Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;