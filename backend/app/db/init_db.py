from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import engine

def init_db(db: Session) -> None:
    # Create tables
    models.Base.metadata.create_all(bind=engine)

    # Check if we already have gates
    gates = crud.gate.get_gates(db, limit=1)
    if not gates:
        print("Seeding database with mock data...")
        
        # Add Admin User
        admin_user = schemas.UserCreate(
            email="admin@stadiumos.com",
            password="admin",
            full_name="Command Center Admin",
            is_superuser=True
        )
        crud.user.create(db, obj_in=admin_user)

        # Add Venue
        venue = models.Venue(name="Nexus Arena", location="Metropolis", capacity=68000)
        db.add(venue)
        db.commit()
        db.refresh(venue)

        # Add Gates
        gates_data = [
            {"name": "Gate A (North)", "current_load": 85, "status": "open"},
            {"name": "Gate B (East)", "current_load": 45, "status": "open"},
            {"name": "Gate C (South)", "current_load": 92, "status": "congested"},
            {"name": "VIP Entrance", "current_load": 15, "status": "open"},
        ]
        for g in gates_data:
            db.add(models.Gate(venue_id=venue.id, name=g["name"], current_load=g["current_load"], status=g["status"]))

        # Add Incidents
        incidents_data = [
            {"type": "Medical", "severity": "high", "location": "Section 114", "status": "open", "description": "Fan requires medical attention"},
            {"type": "Congestion", "severity": "medium", "location": "Concourse B", "status": "open", "description": "Crowd buildup near concession stands"},
            {"type": "Security", "severity": "critical", "location": "Gate C", "status": "open", "description": "Unauthorized access attempt"},
        ]
        for i in incidents_data:
            db.add(models.Incident(venue_id=venue.id, type=i["type"], severity=i["severity"], location=i["location"], status=i["status"], description=i["description"]))

        # Add Decisions
        decisions_data = [
            {
                "title": "Redirect Flow to Gate A",
                "recommendation": "Execute Redirect",
                "reason": "Gate C is approaching critical congestion (92%). Gate A has low utilization.",
                "confidence_level": "98%"
            },
            {
                "title": "Dispatch Medical to Sec 114",
                "recommendation": "Dispatch Unit 4",
                "reason": "High severity medical incident reported. Nearest unit is Unit 4 (2 mins away).",
                "confidence_level": "95%"
            }
        ]
        for d in decisions_data:
            db.add(models.DecisionCard(venue_id=venue.id, title=d["title"], recommendation=d["recommendation"], reason=d["reason"], confidence_level=d["confidence_level"]))
        
        db.commit()
        print("Seeding completed.")
