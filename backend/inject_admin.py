from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
from app import crud, schemas, models
from app.database import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

from app.core.security import get_password_hash

admin = db.query(models.User).filter(models.User.email == "admin@stadiumos.com").first()
if not admin:
    print("Creating admin user...")
    admin_user = models.User(
        email="admin@stadiumos.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        full_name="Command Center Admin",
        role="admin"
    )
    db.add(admin_user)
    db.commit()
    print("Admin user created successfully.")
else:
    print("Admin user already exists.")

db.close()
