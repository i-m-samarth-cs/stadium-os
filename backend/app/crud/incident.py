from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate

def get_incident(db: Session, incident_id: int) -> Optional[Incident]:
    return db.query(Incident).filter(Incident.id == incident_id).first()

def get_active_incidents(db: Session, skip: int = 0, limit: int = 100) -> List[Incident]:
    return db.query(Incident).filter(Incident.status.in_(["open", "in_progress"])).order_by(Incident.created_at.desc()).offset(skip).limit(limit).all()

def create_incident(db: Session, incident: IncidentCreate) -> Incident:
    db_obj = Incident(**incident.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
