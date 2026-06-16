import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


SKILLS = [
    "python",
    "java",
    "sql",
    "flask",
    "react",
    "docker",
    "aws",
    "machine learning"
]


def clean_text(text):

    text = text.lower()

    text = re.sub(r'[^a-zA-Z ]', ' ', text)

    text = " ".join(text.split())

    return text


def extract_skills(text):

    found = []

    for skill in SKILLS:

        if skill in text:

            found.append(skill)

    return found


def calculate_score(resume_text, job_text):

    documents = [
        resume_text,
        job_text
    ]

    vectorizer = TfidfVectorizer()

    matrix = vectorizer.fit_transform(documents)

    similarity = cosine_similarity(
        matrix[0:1],
        matrix[1:2]
    )

    score = float(
    round(
        similarity[0][0] * 100,
        2
    )
)

    return score


def analyze_resume(resume_text, job_description):

    clean_resume = clean_text(resume_text)

    clean_job = clean_text(job_description)

    score = calculate_score(
        clean_resume,
        clean_job
    )

    resume_skills = extract_skills(
        clean_resume
    )

    job_skills = extract_skills(
        clean_job
    )

    matching_skills = []

    for skill in resume_skills:

        if skill in job_skills:

            matching_skills.append(skill)

    missing_skills = []

    for skill in job_skills:

        if skill not in resume_skills:

            missing_skills.append(skill)

    if score >= 80:

        recommendation = "Excellent Match"

    elif score >= 60:

        recommendation = "Good Match"

    else:

        recommendation = "Needs Improvement"

    return {
        "match_score": score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "recommendation": recommendation
    }


