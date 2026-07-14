from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

def authenticate(db: Session, *, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, obj_in: UserCreate):
    hashed_password = get_password_hash(obj_in.password)
    db_obj = User(
        email=obj_in.email,
        full_name=obj_in.full_name,
        role=obj_in.role,
        language=obj_in.language,
        accessibility_needs=obj_in.accessibility_needs,
        is_active=obj_in.is_active,
        hashed_password=hashed_password,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_user(
    db: Session, *, db_obj: User, obj_in: UserUpdate
):
    update_data = obj_in.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(
            update_data.pop("password")
        )
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def remove_user(db: Session, *, id: int):
    obj = db.query(User).get(id)
    db.delete(obj)
    db.commit()
    return obj