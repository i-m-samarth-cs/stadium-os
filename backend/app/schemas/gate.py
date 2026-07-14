from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GateBase(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: Optional[int] = None
    is_accessible: Optional[bool] = False
    current_load: Optional[int] = 0
    status: Optional[str] = "open"

class GateCreate(GateBase):
    venue_id: int

class GateUpdate(GateBase):
    pass

class GateResponse(GateBase):
    id: int
    venue_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
