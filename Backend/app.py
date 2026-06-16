from flask import Flask, jsonify, request
from flask_cors import CORS

from ml_logic import analyze_resume

import PyPDF2
import os

app = Flask(__name__)

CORS(app)


def read_pdf(pdf_path):

    reader = PyPDF2.PdfReader(pdf_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text

    return text


@app.route("/")
def home():

    return jsonify({
        "message": "Resume Screening API Running"
    })


@app.route("/analyze", methods=["POST"])
def analyze():

    if "resume" not in request.files:

        return jsonify({
            "error": "No resume uploaded"
        })

    resume_file = request.files["resume"]

    job_description = request.form["job_description"]

    file_path = os.path.join(
        "uploads",
        resume_file.filename
    )

    resume_file.save(file_path)

    if resume_file.filename.endswith(".txt"):

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            resume_text = file.read()

    else:

        resume_text = read_pdf(file_path)

    result = analyze_resume(
        resume_text,
        job_description
    )

    return jsonify(result)


@app.route("/test")
def test():

    return jsonify({
        "message": "API Working"
    })


@app.route("/upload")
def upload():

    return """
    <h2>Resume Screening</h2>

    <form action="/analyze" method="post" enctype="multipart/form-data">

        <input type="file" name="resume">

        <br><br>

        <textarea
        name="job_description"
        rows="10"
        cols="50"></textarea>

        <br><br>

        <button type="submit">
            Analyze
        </button>

    </form>
    """


if __name__ == "__main__":

    app.run(debug=True)