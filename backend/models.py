# backend/models.py

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Enum, Table
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()

# Enum for method types
class HTTPMethodEnum(str, enum.Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"

# Association Tables
UserRole = Table(
    "User_Role",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("User.user_id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("Role.role_id", ondelete="CASCADE"), primary_key=True)
)

PermissionGroupMapping = Table(
    "Permission_Group_Mapping",
    Base.metadata,
    Column("permission_id", Integer, ForeignKey("Permissions.permission_id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", Integer, ForeignKey("Permission_Group.group_id", ondelete="CASCADE"), primary_key=True)
)

RolePermissionGroup = Table(
    "Role_Permission_Group",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("Role.role_id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", Integer, ForeignKey("Permission_Group.group_id", ondelete="CASCADE"), primary_key=True)
)

# Tables
class Role(Base):
    __tablename__ = "Role"
    role_id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(100), nullable=False)
    users = relationship("User", secondary=UserRole, back_populates="roles")
    permission_groups = relationship("PermissionGroup", secondary=RolePermissionGroup, back_populates="roles")


class User(Base):
    __tablename__ = "User"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    mail = Column(String(150), unique=True)
    contact = Column(String(15))
    password = Column(String(255))
    is_active = Column(Boolean, default=True)
    roles = relationship("Role", secondary=UserRole, back_populates="users")


class Permissions(Base):
    __tablename__ = "Permissions"
    permission_id = Column(Integer, primary_key=True, autoincrement=True)
    permission_code = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    groups = relationship("PermissionGroup", secondary=PermissionGroupMapping, back_populates="permissions")


class PermissionGroup(Base):
    __tablename__ = "Permission_Group"
    group_id = Column(Integer, primary_key=True, autoincrement=True)
    group_name = Column(String(100), unique=True, nullable=False)
    permissions = relationship("Permissions", secondary=PermissionGroupMapping, back_populates="groups")
    roles = relationship("Role", secondary=RolePermissionGroup, back_populates="permission_groups")


class AccessPoint(Base):
    __tablename__ = "Access_Point"
    access_id = Column(Integer, primary_key=True, autoincrement=True)
    endpoint_path = Column(String(255), nullable=False)
    method = Column(Enum(HTTPMethodEnum), nullable=False)
    permission_code = Column(String(100), ForeignKey("Permissions.permission_code"))
    module = Column(String(100))
