from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db
from ml_logic import analyze_resume
from models import User, Job, Applicant, AnalysisResult
from werkzeug.security import generate_password_hash, check_password_hash
import PyPDF2
import os
import uuid 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/resume_screening'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Avoids a warning
db.init_app(app)
CORS(app)

os.makedirs("uploads", exist_ok=True)#uploads to save data

def read_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

def extract_resume_text(file_path):
    try:
        if file_path.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as file:
                return file.read()
        return read_pdf(file_path)
    except Exception as e:
        raise Exception(f"Error reading resume: {e}")# هون ازاصار اي غلط اثناء القراءة بلاقيه هون 
    
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
        }), 400
    resume_file = request.files["resume"]
    job_description = request.form["job_description"]
    filename = f"{uuid.uuid4()}_{resume_file.filename}"
    file_path = os.path.join("uploads", filename)
    resume_file.save(file_path)
    resume_text = extract_resume_text(file_path)
    result= analyze_resume(resume_text, job_description)
    return jsonify(result), 200

@app.route("/test")
def test():
    return jsonify({
        "message": "API Working"
    })

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}# receive data from React or Thunder Client 
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400
    password = generate_password_hash(password)
    existing_user=User.query.filter_by(email=email).first() # ابحث جوا جدول ال user  عن مستخدم ايميله نفس الايميل يلي دخله المستخدم  
    if existing_user:
        return jsonify({"message":"Email already exists"}), 400 # يعني الطلب مو صح لان الايميل مستخدم اصلا 
    new_user= User(username=username, email = email, password= password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message":"User registered successfully"}), 201
    
@app.route("/login", methods=["POST"])
def login():
    data= request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    user=User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email not found"}), 404
    if not check_password_hash(user.password, password):
        return jsonify({"message": "Incorrect password"}), 401
    return jsonify({"message": "Login successful"}), 200

@app.route("/jobs", methods=["POST"])
def create_job():
    data = request.get_json() or {}
    title = data.get("title")
    description = data.get("description")
    required_skills = data.get("required_skills")
    user_id = data.get("user_id")
    department = data.get("department")
    employment_type=data.get("employment_type")
    status=data.get("status", "Open")
    if not title or not description:
        return jsonify({"message": "Missing required fields"}), 400
    new_job = Job(title=title,description=description,required_skills=required_skills,user_id=user_id, department=department,employment_type=employment_type,status=status)
    db.session.add(new_job)
    db.session.commit()
    return jsonify({"message": "Job created successfully"}), 201

@app.route("/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.all()
    job_list = []
    for job in jobs:
        applicant_count = Applicant.query.filter_by(job_id=job.id).count()
        job_list.append({
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "required_skills": job.required_skills,
            "user_id": job.user_id,
            "department": job.department,
            "employment_type": job.employment_type,
            "status": job.status,
            "applicant_count": applicant_count
        })
    return jsonify(job_list)

@app.route("/applicants", methods=["POST"])
def create_applicant():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    resume_path = data.get("resume_path")
    job_id = data.get("job_id")
    experience_years = data.get("experience_years")
    status = data.get("status", "New")
    if not name or not email or not phone or not resume_path or not job_id:
        return jsonify({"message": "All fields are required"}), 400
    existing_applicant = Applicant.query.filter_by(email=email).first()
    if existing_applicant:
        return jsonify({
            "message": "Applicant already exists"
        }), 400
    new_applicant = Applicant(
        name=name,
        email=email,
        phone=phone,
        resume_path=resume_path,
        job_id=job_id,
        experience_years=experience_years,
        status=status)
    db.session.add(new_applicant)
    db.session.commit()
    return jsonify({"message": "Applicant created successfully"}), 201

@app.route("/applicants", methods=["GET"])
def get_applicants():
    applicants = Applicant.query.all()
    applicant_list = []
    for applicant in applicants:
        job = Job.query.get(applicant.job_id)
        analysis = AnalysisResult.query.filter_by(
            applicant_id=applicant.id).first()
        applicant_list.append({
            "id": applicant.id,
            "name": applicant.name,
            "email": applicant.email,
            "phone": applicant.phone,
            "resume_path": applicant.resume_path,
            "job_id": applicant.job_id,
            "job_title": job.title if job else "—",
            "experience_years": applicant.experience_years,
            "status": applicant.status,
            "match_score": analysis.match_score if analysis else None})
    return jsonify(applicant_list)
    
@app.route("/applicants/<int:applicant_id>/status", methods=["PUT"])
def update_applicant_status(applicant_id):
    data = request.get_json() or {}
    new_status = data.get("status")

    valid_statuses = ["New", "Screened", "Interview", "Offer"]
    if new_status not in valid_statuses:
        return jsonify({"message": "Invalid status"}), 400

    applicant = Applicant.query.get(applicant_id)
    if not applicant:
        return jsonify({"message": "Applicant not found"}), 404

    applicant.status = new_status
    db.session.commit()
    return jsonify({"message": "Status updated successfully"}), 200

@app.route("/analysis-results", methods=["GET"])
def get_analysis_results():
    results = AnalysisResult.query.all()
    analysis_list = []
    for result in results:
        applicant = Applicant.query.get(result.applicant_id)
        job = Job.query.get(applicant.job_id) if applicant else None

        analysis_list.append({
            "id": result.id,
            "match_score": result.match_score,
            "recommendation": result.recommendation,
            "matching_skills": result.matching_skills,
            "missing_skills": result.missing_skills,
            "applicant_id": result.applicant_id,
            "applicant_name": applicant.name if applicant else "Unknown",
            "applicant_email": applicant.email if applicant else "",
            "job_title": job.title if job else "—"
        })
    return jsonify(analysis_list), 200

@app.route("/apply", methods=["POST"])
def apply():

    if "resume" not in request.files:
        return jsonify({"message": "No resume uploaded"}), 400

    name = request.form["name"]
    email = request.form["email"]
    phone = request.form["phone"]
    job_id = request.form["job_id"]
    experience_years = request.form.get("experience_years")
    if not name or not email or not phone or not job_id:
        return jsonify({"message": "All fields are required"}), 400
    existing = Applicant.query.filter_by(email=email).first()

    if existing:
        return jsonify({"message": "Applicant already exists"}), 400

    resume = request.files["resume"]
    filename = f"{uuid.uuid4()}_{resume.filename}"
    file_path = os.path.join("uploads", filename)  
    resume.save(file_path)
    resume_text = extract_resume_text(file_path)

    new_applicant = Applicant(
        name=name,
        email=email,
        phone=phone,
        resume_path=file_path,
        job_id=job_id,
        experience_years=int(experience_years) if experience_years else None,
        status="New"
    )

    db.session.add(new_applicant)
    db.session.commit()

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message":"Job not found"}), 404

    result = analyze_resume(
        resume_text,
        job.description,
        job.required_skills
    )

    analysis = AnalysisResult(
        match_score=result["match_score"],
        recommendation=result["recommendation"],
        matching_skills=", ".join(result["matching_skills"]),
        missing_skills=", ".join(result["missing_skills"]),
        applicant_id=new_applicant.id
    )

    db.session.add(analysis)
    db.session.commit()
    new_applicant.status = "Screened"
    db.session.commit()

    return jsonify(result), 200

@app.route("/dashboard-stats", methods=["GET"])
def dashboard_stats():
    total_jobs = Job.query.count()
    total_applicants = Applicant.query.count()
    screened = AnalysisResult.query.count()
    shortlisted = AnalysisResult.query.filter(AnalysisResult.match_score >= 80).count()

    return jsonify({
        "active_jobs": total_jobs,
        "total_applicants": total_applicants,
        "screened": screened,
        "shortlisted": shortlisted
    }), 200


@app.route("/recent-applicants", methods=["GET"])
def recent_applicants():
    applicants = Applicant.query.order_by(Applicant.id.desc()).limit(5).all()
    result = []
    for a in applicants:
        analysis = AnalysisResult.query.filter_by(applicant_id=a.id).first()
        job = Job.query.get(a.job_id)
        result.append({
            "id": a.id,
            "name": a.name,
            "job_title": job.title if job else "—",
            "match_score": analysis.match_score if analysis else None,
            "status": "Screened" if analysis else "Not screened yet"
        })
    return jsonify(result), 200

with app.app_context():
    print(db.engine.url)
    db.create_all()
if __name__ == "__main__":
    app.run(debug=True)