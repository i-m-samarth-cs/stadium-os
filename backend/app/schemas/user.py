from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "fan"  # fan, volunteer, ops_admin, accessibility_coordinator, transport_coordinator
    language: str = "en"  # en, es, fr, hi
    accessibility_needs: Optional[List[str]] = None  # wheelchair, low_vision, blind, deaf_hard_of_hearing, neurodivergent, limited_mobility
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(UserBase):
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


class UserInDB(UserInDBBase):
    hashed_password: str


class User(UserInDBBase):
    pass