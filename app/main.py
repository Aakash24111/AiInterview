from fastapi import FastAPI
from app.routers.company_router import router as company_router  # Correct import
from app.routers.job_router import router as job_router  # Correct import for job_router
from app.db.database import SessionLocal, Base, engine

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    print("Successfully Created Tables")
except Exception as e:
    print("Error creating tables: ", e)

# Initialize FastAPI app
app = FastAPI()

# Include company and job routers
app.include_router(company_router)  # This includes the company router
app.include_router(job_router)  # This includes the job router with a prefix

# Root endpoint
@app.get("/")
def root():
    return {"message": "Company Service is Running"}
