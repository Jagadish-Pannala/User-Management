from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Role, User
from schemas import RoleCreate, RoleRead
from main import SessionLocal
from auth import get_current_user
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RoleRead)
def create_role(role: RoleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.get("/", response_model=List[RoleRead])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Role).offset(skip).limit(limit).all()

@router.get("/{role_id}", response_model=RoleRead)
def read_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    role = db.query(Role).filter(Role.role_id == role_id).first()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.put("/{role_id}", response_model=RoleRead)
def update_role(role_id: int, role: RoleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_role = db.query(Role).filter(Role.role_id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    for key, value in role.dict(exclude_unset=True).items():
        setattr(db_role, key, value)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_role = db.query(Role).filter(Role.role_id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(db_role)
    db.commit()
    return {"ok": True} 