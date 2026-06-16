import axios from "axios";
import { useState } from "react";
import "./App.css";
function App() {

  const [resume, setResume] = useState(null);

  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);

  const analyzeResume = async () => {
  if (!resume) {

  alert("Please upload a resume");

  return;
}
  if (!jobDescription) {

  alert("Please enter a job description");

  return;
}
   const formData = new FormData();

    formData.append("resume", resume);

    formData.append(
      "job_description",
      jobDescription
    );

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/analyze",
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="App">

      <h1>Resume Screening System</h1>

      <br />

      <input
        type="file"
        onChange={(event) =>
          setResume(event.target.files[0])
        }
      />

      <br />
      <br />

      <textarea
        rows="10"
        cols="50"
        placeholder="Enter Job Description"
        value={jobDescription}
        onChange={(event) =>
          setJobDescription(event.target.value)
        }
      />

      <br />
      <br />

      <button onClick={analyzeResume}>
        Analyze Resume
      </button>

      {result && (

       <div className="result-box">
          <h2>Analysis Result</h2>

          <p>
            Match Score: {result.match_score}%
          </p>

          <p>
            Recommendation: {result.recommendation}
          </p>

          <h3>Matching Skills</h3>

          <ul>

            {result.matching_skills.map(
              (skill, index) => (

                <li key={index}>
                  {skill}
                </li>

              )
            )}

          </ul>

          <h3>Missing Skills</h3>

          <ul>

            {result.missing_skills.map(
              (skill, index) => (

                <li key={index}>
                  {skill}
                </li>

              )
            )}

          </ul>

        </div>

      )}

    </div>

  );

}

export default App;