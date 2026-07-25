import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiCheck, FiPlus } from "react-icons/fi";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async () => {
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:5000/login",
                {
                    email,
                    password
                }
            );
            alert(response.data.message);
            navigate("/dashboard");
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#eaf2ff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 20px"
            }}>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    maxWidth: "1100px",
                    minHeight: "620px",
                    background: "#fff",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
                }}>

                {/* Left Panel */}
                <div
                    style={{
                        flex: "1",
                        background: "linear-gradient(160deg, #6fa1f5 0%, #4f7fe8 100%)",
                        padding: "48px 40px",
                        display: "flex",
                        flexDirection: "column",
                        color: "#fff",
                        minWidth: "300px"
                    }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "60px" }}>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <FiPlus size={18} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "20px" }}>ResumeIQ</span>
                    </div>

                    {/* Headline */}
                    <h2 style={{ fontWeight: 700, fontSize: "30px", lineHeight: "1.3", marginBottom: "28px" }}>
                        Hire smarter with AI screening
                    </h2>

                    {/* Bullets */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FiCheck size={16} />
                            <span>AI-ranked candidate shortlists in seconds</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FiCheck size={16} />
                            <span>Automatic resume-to-job matching</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FiCheck size={16} />
                            <span>Bias-aware, explainable scoring</span>
                        </div>
                    </div>

                    <div style={{ flex: 1 }} />

                    <div style={{ fontSize: "14px", opacity: 0.85 }}>
                        Trusted by recruiting teams worldwide
                    </div>
                </div>

                {/* Right Panel */}
                <div
                    style={{
                        flex: "1.1",
                        padding: "56px 56px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: "320px"
                    }}>
                    {/* Badge */}
                    <div
                        style={{
                            display: "inline-block",
                            alignSelf: "flex-start",
                            background: "#eaf2ff",
                            color: "#3b6fe0",
                            fontWeight: 600,
                            fontSize: "13px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            marginBottom: "20px"
                        }}>
                        HR Portal
                    </div>

                    <h2 style={{ fontWeight: 700, fontSize: "32px", color: "#122a5e", marginBottom: "8px" }}>
                        Welcome back
                    </h2>
                    <p style={{ color: "#6b7280", marginBottom: "32px" }}>
                        Sign in to manage jobs, applicants, and screening results.
                    </p>

                    {/* Email */}
                    <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                        Work email
                    </label>
                    <div className="input-group mb-3">
                        <span className="input-group-text bg-white">
                            <FiMail color="#8a94a6" />
                        </span>
                        <input
                            type="email"
                            className="form-control py-2"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ borderLeft: "none" }}
                        />
                    </div>

                    {/* Password */}
                    <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                        Password
                    </label>
                    <div className="input-group mb-3">
                        <span className="input-group-text bg-white">
                            <FiLock color="#8a94a6" />
                        </span>
                        <input
                            type="password"
                            className="form-control py-2"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ borderLeft: "none" }}
                        />
                    </div>

                    {/* Remember me */}
                    <div className="mb-4">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="rememberMe" style={{ color: "#4b5563" }}>
                                Remember me
                            </label>
                        </div>
                    </div>

                    {/* Sign in button */}
                    <button
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{
                            background: "#4f7fe8",
                            color: "#fff",
                            fontWeight: 600,
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            marginBottom: "20px"
                        }}
                        onClick={login}
                        disabled={loading}>
                        {loading ? "Signing In..." : "Sign in"} <FiArrowRight />
                    </button>

                    <div className="text-center">
                        <span style={{ color: "#6b7280" }}>Don't have an account? </span>
                        <button
                            className="btn btn-link p-0"
                            style={{ color: "#4f7fe8", fontWeight: 600, textDecoration: "none" }}
                            onClick={() => navigate("/register")}>
                            Create one
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;