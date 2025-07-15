# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables (optional, for auto-create)
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # TODO: Replace '*' with your frontend domain in production for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve React static files
app.mount("/static", StaticFiles(directory="../frontend/public"), name="static")


# Root endpoint (must be above catch-all)
@app.get("/")
def read_root():
    return {"message": "User Management System is running"}

# API Routers (must be before catch-all route)
from users import router as users_router
from roles import router as roles_router
from permissions import router as permissions_router
from permission_groups import router as permission_groups_router
from auth import router as auth_router

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(roles_router, prefix="/roles", tags=["Roles"])
app.include_router(permissions_router, prefix="/permissions", tags=["Permissions"])
app.include_router(permission_groups_router, prefix="/permission-groups", tags=["Permission Groups"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

# Serve index.html for all other frontend routes (SPA fallback) - must be last
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    if full_path == "":
        return {"message": "User Management System is running"}
    file_path = os.path.join(os.path.dirname(__file__), "../frontend/public/index.html")
    return FileResponse(file_path)
