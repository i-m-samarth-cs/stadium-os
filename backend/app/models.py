from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import enum
from datetime import datetime


Base = declarative_base()


class UserRole(str, enum.Enum):
    FAN = "fan"
    DISABLED_FAN = "disabled_fan"
    VOLUNTEER = "volunteer"
    OPS_STAFF = "ops_staff"
    TRANSPORT_COORDINATOR = "transport_coordinator"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.FAN)
    is_active = Column(Boolean, default=True)
    language_preference = Column(String, default="en")
    accessibility_needs = Column(JSON, default={})  # Store accessibility preferences
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    capacity = Column(Integer)
    timezone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Gate(Base):
    __tablename__ = "gates"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"))
    name = Column(String, nullable=False)
    location = Column(String)
    capacity = Column(Integer)
    is_accessible = Column(Boolean, default=False)
    current_load = Column(Integer, default=0)  # Current number of people
    status = Column(String, default="open")  # open, closed, congested
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"))
    name = Column(String, nullable=False)
    description = Column(Text)
    is_accessible = Column(Boolean, default=False)
    estimated_time = Column(Integer)  # in minutes
    crowd_level = Column(String, default="low")  # low, medium, high
    sensory_level = Column(String, default="low")  # low, medium, high
    status = Column(String, default="open")  # open, closed, restricted
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"))
    type = Column(String, nullable=False)  # medical, security, accessibility, congestion, etc.
    severity = Column(String, default="low")  # low, medium, high, critical
    description = Column(Text)
    location = Column(String)
    reported_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="open")  # open, in_progress, resolved, closed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class MobilityAlert(Base):
    __tablename__ = "mobility_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    affected_routes = Column(JSON, default=[])  # List of route IDs
    affected_gates = Column(JSON, default=[])   # List of gate IDs
    severity = Column(String, default="low")    # low, medium, high
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AccessibilityFacility(Base):
    __tablename__ = "accessibility_facilities"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # wheelchair_ramp, elevator, wheelchair_restroom, sensory_room, etc.
    location = Column(String)
    is_available = Column(Boolean, default=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class VolunteerAssignment(Base):
    __tablename__ = "volunteer_assignments"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("users.id"))
    venue_id = Column(Integer, ForeignKey("venues.id"))
    assignment_type = Column(String)  # gate_guide, accessibility_assistant, info_desk, medical_support, etc.
    location = Column(String)
    shift_start = Column(DateTime(timezone=True))
    shift_end = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class DecisionCard(Base):
    __tablename__ = "decision_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    venue_id = Column(Integer, ForeignKey("venues.id"))
    title = Column(String, nullable=False)
    recommendation = Column(String, nullable=False)
    reason = Column(Text)
    confidence_level = Column(String)  # high, medium, low
    accessibility_note = Column(Text)
    fallback_option = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    source_tags = Column(JSON, default=[])  # crowd, transit, accessibility, policy, volunteer, venue_rule
    is_active = Column(Boolean, default=True)


class FeedbackEvent(Base):
    __tablename__ = "feedback_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    decision_card_id = Column(Integer, ForeignKey("decision_cards.id"))
    rating = Column(Integer)  # 1-5 scale
    feedback_text = Column(Text)
    was_helpful = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())