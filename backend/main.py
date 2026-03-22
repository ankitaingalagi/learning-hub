from fastapi import FastAPI
from routes import programs_router

app = FastAPI(title="LMS Mentorship Platform API")

# Generic Health Route
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI backend is running modularly"}

# Attach routers
app.include_router(programs_router.router)
