from pydantic import BaseModel, EmailStr
from typing import Optional, List
import enum

class HTTPMethodEnum(str, enum.Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"

# User Schemas
class UserBase(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    mail: EmailStr
    contact: Optional[str]
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str]

class UserRead(UserBase):
    user_id: int
    class Config:
        orm_mode = True

# Role Schemas
class RoleBase(BaseModel):
    role_name: str

class RoleCreate(RoleBase):
    pass

class RoleRead(RoleBase):
    role_id: int
    class Config:
        orm_mode = True

# Permissions Schemas
class PermissionsBase(BaseModel):
    permission_code: str
    description: Optional[str]

class PermissionsCreate(PermissionsBase):
    pass

class PermissionsRead(PermissionsBase):
    permission_id: int
    class Config:
        orm_mode = True

# PermissionGroup Schemas
class PermissionGroupBase(BaseModel):
    group_name: str

class PermissionGroupCreate(PermissionGroupBase):
    pass

class PermissionGroupRead(PermissionGroupBase):
    group_id: int
    class Config:
        orm_mode = True 