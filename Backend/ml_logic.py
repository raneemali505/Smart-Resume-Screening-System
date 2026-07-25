import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9+#. ]", " ", text)
    tokens = word_tokenize(text)
    tokens = [
      lemmatizer.lemmatize(word)
      for word in tokens
      if len(word) > 2]
    return " ".join(tokens)

def calculate_text_similarity(resume_text, job_text):
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
    return float(similarity[0][0] * 100)

def extract_matching_skills(resume_text, required_skills):
    matching = []
    for skill in required_skills:
        skill = skill.strip().lower()
        if skill and skill in resume_text:
            matching.append(skill)
    return matching

def analyze_resume(resume_text, job_description, required_skills):
    clean_resume = clean_text(resume_text)
    clean_job = clean_text(job_description)
    text_score = calculate_text_similarity(
        clean_resume,
        clean_job
    )
    if isinstance(required_skills, str):
        required_skills = [
            skill.strip().lower()
            for skill in required_skills.split(",")
            if skill.strip()
        ]
    matching_skills = extract_matching_skills(
        clean_resume,
        required_skills
    )
    missing_skills = [
        skill
        for skill in required_skills
        if skill not in matching_skills
    ]
    if len(required_skills) == 0:
        skills_score = 0
    else:
        skills_score = (
            len(matching_skills)
            / len(required_skills)
        ) * 100
    if text_score == 0 and len(matching_skills) > 0:
     final_score = round(skills_score, 2)

    else:
     final_score = round(
        (0.7 * text_score) +
        (0.3 * skills_score),
        2
    )
    if final_score >= 80:
        recommendation = "Excellent Match"
    elif final_score >= 60:
        recommendation = "Good Match"
    else:
        recommendation = "Needs Improvement"
    return {
        "match_score": final_score,
        "text_similarity": round(text_score, 2),
        "skills_score": round(skills_score, 2),
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "recommendation": recommendation
    }