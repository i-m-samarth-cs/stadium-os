from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, gates, incidents, decisions

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(gates.router, prefix="/gates", tags=["gates"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(decisions.router, prefix="/decisions", tags=["decisions"])
# api_router.include_router(venues.router, prefix="/venues", tags=["venues"])
# api_router.include_router(routes.router, prefix="/routes", tags=["routes"])
# api_router.include_router(mobility.router, prefix="/mobility", tags=["mobility"])
# api_router.include_router(accessibility.router, prefix="/accessibility", tags=["accessibility"])
# api_router.include_router(volunteer.router, prefix="/volunteer", tags=["volunteer"])