from fastapi import FastAPI
from app.routers.routers import router

app = FastAPI(title="Interview Service",
              description="Manages candidate and company interviews inside MongoDB container."
              )

app.include_router(router, prefix="/interviews", tags=["interviews"])