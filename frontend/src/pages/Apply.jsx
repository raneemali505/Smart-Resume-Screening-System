import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUpload, FiFileText, FiCheck } from "react-icons/fi";

function Apply() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedInfo, setSubmittedInfo] = useState({ name: "", jobTitle: "" });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/jobs");
            setJobs(response.data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to load jobs.");
        }
    };

    const submitApplication = async () => {
        if (!name || !email || !phone || !selectedJob || !resume) {
            alert("Please fill in all fields.");
            return;
        }
        const jobTitle = jobs.find((j) => String(j.id) === String(selectedJob))?.title || "";

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("job_id", selectedJob);
        formData.append("resume", resume);
        formData.append("experience_years", experienceYears);

        try {
            setLoading(true);
            await axios.post("http://127.0.0.1:5000/apply", formData);
            setSubmittedInfo({ name, jobTitle });
            setSubmitted(true);
            setName("");
            setEmail("");
            setPhone("");
            setSelectedJob("");
            setResume(null);
            setExperienceYears("");
        } catch (error) {
            alert(error.response?.data?.message || "Application Failed");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ background: "#eaf2ff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <div
                    className="text-center"
                    style={{
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "48px 40px",
                        maxWidth: "480px",
                        width: "100%",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
                    }}>
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "#dcf9e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px"
                        }}>
                        <FiCheck size={28} color="#16a34a" />
                    </div>

                    <h2 className="fw-bold mb-3" style={{ color: "#122a5e", fontSize: "26px" }}>
                        Application received
                    </h2>

                    <p className="text-muted mb-4" style={{ fontSize: "16px", lineHeight: "26px" }}>
                        Thanks, {submittedInfo.name}! Our AI is screening your resume for
                        the <strong>{submittedInfo.jobTitle}</strong> role. You'll hear back soon.
                    </p>

                    <button
                        className="btn"
                        style={{
                            background: "#4f7fe8",
                            color: "#fff",
                            fontWeight: 600,
                            padding: "12px 32px",
                            borderRadius: "10px",
                            border: "none",
                            textDecoration: "underline"
                        }}
                        onClick={() => {
                            setSubmitted(false);
                            navigate("/");
                        }}>
                        Back to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#eaf2ff", minHeight: "100vh", padding: "60px 20px" }}>
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                <div className="text-center mb-3">
                    <span
                        style={{
                            display: "inline-block",
                            background: "#dbe7fb",
                            color: "#3b6fe0",
                            fontWeight: 600,
                            fontSize: "13px",
                            padding: "6px 16px",
                            borderRadius: "20px"
                        }}>
                        For Candidates
                    </span>
                </div>

                <h1 className="text-center fw-bold mb-2" style={{ color: "#122a5e", fontSize: "40px" }}>
                    Apply for a role
                </h1>
                <p className="text-center text-muted mb-5">
                    Upload your resume and let our AI match you to the best-fit opportunity.
                </p>

                <div
                    className="mb-4"
                    style={{
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "36px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                    }}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                                Full name
                            </label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                style={{ padding: "12px 14px", borderRadius: "10px" }}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                                Email
                            </label>
                            <input
                                className="form-control"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@email.com"
                                style={{ padding: "12px 14px", borderRadius: "10px" }}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                            Phone number
                        </label>
                        <input
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            style={{ padding: "12px 14px", borderRadius: "10px" }}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                            Position
                        </label>
                        <select
                            className="form-select"
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                            style={{ padding: "12px 14px", borderRadius: "10px" }}>
                            <option value="">Select a position</option>
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-1">
                        <label className="fw-semibold mb-2" style={{ color: "#122a5e", fontSize: "14px" }}>
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            placeholder="e.g. 3"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                            style={{ padding: "12px 14px", borderRadius: "10px" }}
                        />
                    </div>
                </div>

                <div
                    className="mb-4"
                    style={{
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "36px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                    }}>
                    <label className="fw-semibold mb-3 d-block" style={{ color: "#122a5e", fontSize: "14px" }}>
                        Resume
                    </label>

                    <label
                        htmlFor="resumeUpload"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px dashed #d6e0f0",
                            borderRadius: "16px",
                            padding: "40px 20px",
                            cursor: "pointer",
                            background: resume ? "#f7faff" : "transparent"
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
                                marginBottom: "16px"
                            }}>
                            {resume ? <FiFileText size={22} color="#4f7fe8" /> : <FiUpload size={22} color="#4f7fe8" />}
                        </div>
                        <div className="fw-bold mb-1" style={{ color: "#4f7fe8", fontSize: "16px" }}>
                            {resume ? resume.name : "Click to upload your resume"}
                        </div>
                        <div className="text-muted" style={{ fontSize: "13px" }}>
                            PDF, DOC or DOCX up to 5MB
                        </div>
                        <input
                            id="resumeUpload"
                            type="file"
                            accept=".pdf,.txt,.doc,.docx"
                            onChange={(e) => setResume(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </label>
                </div>

                <button
                    className="btn w-100"
                    style={{
                        background: "#4f7fe8",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "14px",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "16px"
                    }}
                    onClick={submitApplication}
                    disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                </button>
            </div>
        </div>
    );
}
export default Apply;