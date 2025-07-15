from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Permissions, User
from schemas import PermissionsCreate, PermissionsRead
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

@router.post("/", response_model=PermissionsRead)
def create_permission(permission: PermissionsCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_permission = Permissions(**permission.dict())
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

@router.get("/", response_model=List[PermissionsRead])
def read_permissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Permissions).offset(skip).limit(limit).all()

@router.get("/{permission_id}", response_model=PermissionsRead)
def read_permission(permission_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    permission = db.query(Permissions).filter(Permissions.permission_id == permission_id).first()
    if permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    return permission

@router.put("/{permission_id}", response_model=PermissionsRead)
def update_permission(permission_id: int, permission: PermissionsCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_permission = db.query(Permissions).filter(Permissions.permission_id == permission_id).first()
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    for key, value in permission.dict(exclude_unset=True).items():
        setattr(db_permission, key, value)
    db.commit()
    db.refresh(db_permission)
    return db_permission

@router.delete("/{permission_id}")
def delete_permission(permission_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_permission = db.query(Permissions).filter(Permissions.permission_id == permission_id).first()
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    db.delete(db_permission)
    db.commit()
    return {"ok": True} 