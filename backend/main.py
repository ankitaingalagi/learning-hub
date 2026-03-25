from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import programs_router
from routers import assessments

app = FastAPI(title="LMS Mentorship Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "http://localhost:5181",
        "http://localhost:5173",
        "http://127.0.0.1:5178",
        "http://127.0.0.1:5179",
        "http://127.0.0.1:5180",
        "http://127.0.0.1:5181",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Generic Health Route
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI backend is running modularly"}

# Attach routers
app.include_router(programs_router.router)
app.include_router(assessments.router)
