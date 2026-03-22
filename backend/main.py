from fastapi import FastAPI, Depends, HTTPException, Header
from typing import Optional

app = FastAPI(title="LMS Mentorship Platform API")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI backend is running"}

@app.get("/api/assessments")
def get_assessments():
    return {"data": "This would securely return assessments using Row Level Security."}
