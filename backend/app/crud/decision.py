from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import DecisionCard
from app.schemas.decision import DecisionCardCreate

def get_decisions(db: Session, skip: int = 0, limit: int = 100) -> List[DecisionCard]:
    return db.query(DecisionCard).filter(DecisionCard.is_active == True).order_by(DecisionCard.timestamp.desc()).offset(skip).limit(limit).all()

def create_decision(db: Session, decision: DecisionCardCreate) -> DecisionCard:
    db_obj = DecisionCard(**decision.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
