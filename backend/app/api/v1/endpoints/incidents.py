from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from app.schemas.incident import IncidentResponse

router = APIRouter()

@router.get("/active", response_model=List[IncidentResponse])
def read_active_incidents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    incidents = crud.incident.get_active_incidents(db, skip=skip, limit=limit)
    return incidents
