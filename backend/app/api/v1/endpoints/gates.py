from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from app.schemas.gate import GateResponse

router = APIRouter()

@router.get("/", response_model=List[GateResponse])
def read_gates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    gates = crud.gate.get_gates(db, skip=skip, limit=limit)
    return gates
