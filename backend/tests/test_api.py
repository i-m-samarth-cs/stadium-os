import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.api import deps
from app.models import Base
from app import crud, schemas

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[deps.get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Create test user
    user_in = schemas.UserCreate(email="test@stadiumos.com", password="password", full_name="Test User", is_superuser=False)
    crud.user.create(db, obj_in=user_in)
    
    # Create test gate
    gate_in = schemas.GateCreate(name="Gate A", current_load=45, capacity=1000, status="optimal", is_active=True)
    crud.gate.create(db, obj_in=gate_in)
    
    # Create test incident
    inc_in = schemas.IncidentCreate(type="medical", severity="high", location="Section 114", description="Testing", status="active")
    crud.incident.create(db, obj_in=inc_in)
    
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

def test_login():
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@stadiumos.com", "password": "password"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_read_gates():
    response = client.get("/api/v1/gates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Gate A"

def test_read_active_incidents():
    response = client.get("/api/v1/incidents/active")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["type"] == "medical"
