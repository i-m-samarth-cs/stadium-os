from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DecisionCardBase(BaseModel):
    title: str
    recommendation: str
    reason: Optional[str] = None
    confidence_level: Optional[str] = None
    accessibility_note: Optional[str] = None
    fallback_option: Optional[str] = None
    source_tags: Optional[List[str]] = []
    is_active: Optional[bool] = True

class DecisionCardCreate(DecisionCardBase):
    user_id: Optional[int] = None
    venue_id: Optional[int] = None

class DecisionCardResponse(DecisionCardBase):
    id: int
    user_id: Optional[int]
    venue_id: Optional[int]
    timestamp: Optional[datetime]

    class Config:
        from_attributes = True
