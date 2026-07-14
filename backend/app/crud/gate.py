from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Gate
from app.schemas.gate import GateCreate, GateUpdate

def get_gate(db: Session, gate_id: int) -> Optional[Gate]:
    return db.query(Gate).filter(Gate.id == gate_id).first()

def get_gates(db: Session, skip: int = 0, limit: int = 100) -> List[Gate]:
    return db.query(Gate).offset(skip).limit(limit).all()

def create_gate(db: Session, gate: GateCreate) -> Gate:
    db_obj = Gate(**gate.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_gate(db: Session, db_obj: Gate, obj_in: GateUpdate) -> Gate:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
