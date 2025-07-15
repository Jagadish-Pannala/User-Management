from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import PermissionGroup, User
from schemas import PermissionGroupCreate, PermissionGroupRead
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

@router.post("/", response_model=PermissionGroupRead)
def create_permission_group(group: PermissionGroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_group = PermissionGroup(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.get("/", response_model=List[PermissionGroupRead])
def read_permission_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(PermissionGroup).offset(skip).limit(limit).all()

@router.get("/{group_id}", response_model=PermissionGroupRead)
def read_permission_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = db.query(PermissionGroup).filter(PermissionGroup.group_id == group_id).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Permission group not found")
    return group

@router.put("/{group_id}", response_model=PermissionGroupRead)
def update_permission_group(group_id: int, group: PermissionGroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_group = db.query(PermissionGroup).filter(PermissionGroup.group_id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Permission group not found")
    for key, value in group.dict(exclude_unset=True).items():
        setattr(db_group, key, value)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.delete("/{group_id}")
def delete_permission_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_group = db.query(PermissionGroup).filter(PermissionGroup.group_id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Permission group not found")
    db.delete(db_group)
    db.commit()
    return {"ok": True} 