import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiPlus } from "react-icons/fi";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const register = async () => {
        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:5000/register",
                {
                    username,
                    email,
                    password,
                    company
                }
            );
            alert(response.data.message);
            navigate("/login");
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Registration Failed"
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
                    minHeight: "660px",
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
                    <h2 style={{ fontWeight: 700, fontSize: "28px", lineHeight: "1.3", marginBottom: "28px" }}>
                        Create your HR account
                    </h2>

                    {/* Bullets */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <FiCheck size={16} style={{ marginTop: "3px" }} />
                            <span>Set up your recruiting workspace in minutes</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FiCheck size={16} />
                            <span>Invite your hiring team</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FiCheck size={16} />
                            <span>Start screening resumes with AI today</span>
                        </div>
                    </div>

                    <div style={{ flex: 1 }} />

                    <div style={{ fontSize: "14px", opacity: 0.85 }}>
                        No credit card required
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
                        Get started
                    </div>

                    <h2 style={{ fontWeight: 700, fontSize: "30px", color: "#122a5e", marginBottom: "8px" }}>
                        Create an account
                    </h2>
                    <p style={{ color: "#6b7280", marginBottom: "28px" }}>
                        Set up your recruiter profile to begin screening candidates.
                    </p>

                    {/* Full name + Company */}
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                                Full name
                            </label>
                            <input
                                type="text"
                                className="form-control py-2"
                                placeholder="Sarah Chen"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="col-6">
                            <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                                Company
                            </label>
                            <input
                                type="text"
                                className="form-control py-2"
                                placeholder="Acme Inc."
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Work email */}
                    <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                        Work email
                    </label>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control py-2"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                        Password
                    </label>
                    <div className="mb-4">
                        <input
                            type="password"
                            className="form-control py-2"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Create account button */}
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
                        onClick={register}
                        disabled={loading}>
                        {loading ? "Creating Account..." : "Create account"} <FiArrowRight />
                    </button>

                    <div className="text-center">
                        <span style={{ color: "#6b7280" }}>Already have an account? </span>
                        <button
                            className="btn btn-link p-0"
                            style={{ color: "#4f7fe8", fontWeight: 600, textDecoration: "none" }}
                            onClick={() => navigate("/login")}>
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Register;