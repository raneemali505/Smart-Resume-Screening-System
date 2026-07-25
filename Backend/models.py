from database import db
from datetime import datetime
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(225), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Job(db.Model):
    __tablename__ = "job"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    required_skills = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"), nullable=False)
    department = db.Column(db.String(50), nullable=True)
    employment_type = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), nullable=False, default="Open")

class Applicant(db.Model):
    __tablename__ = "applicant"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100),unique=True,nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    resume_path = db.Column(db.String(255), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("job.id"), nullable=False)
    experience_years = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(20), nullable=False, default="New")  # New, Screened, Interview, Offer

class AnalysisResult(db.Model):
    __tablename__ = "analysis_result"
    id = db.Column(db.Integer, primary_key=True)
    match_score = db.Column(db.Float, nullable=False)
    recommendation = db.Column(db.String(100), nullable=False)
    matching_skills = db.Column(db.Text, nullable=False)
    missing_skills = db.Column(db.Text, nullable=False)
    applicant_id = db.Column( db.Integer, db.ForeignKey("applicant.id"), nullable=False)