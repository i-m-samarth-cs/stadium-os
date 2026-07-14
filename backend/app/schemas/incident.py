from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentBase(BaseModel):
    type: str
    severity: Optional[str] = "low"
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "open"

class IncidentCreate(IncidentBase):
    venue_id: Optional[int] = None
    reported_by: Optional[int] = None

class IncidentUpdate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: int
    venue_id: Optional[int]
    reported_by: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
