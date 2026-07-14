from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from app.schemas.decision import DecisionCardResponse
from app.core.config import settings
from datetime import datetime
import httpx
import json

router = APIRouter()

@router.get("", response_model=List[DecisionCardResponse])
async def read_decisions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    # 1. Fetch live stadium data to feed into the AI
    gates = crud.gate.get_gates(db, skip=0, limit=100)
    incidents = crud.incident.get_active_incidents(db, skip=0, limit=100)
    
    gates_data = [{"name": g.name, "load": g.current_load, "status": g.status} for g in gates]
    incidents_data = [{"type": i.type, "severity": i.severity, "location": i.location} for i in incidents]
    
    # 2. Construct the AI Prompt
    prompt = f"""
    You are an AI stadium operator. Analyze the following live data and generate 2 operational recommendations.
    Return ONLY a raw JSON array of objects. Do NOT use markdown code blocks (```json).
    Each object must have exactly these string fields: "title", "recommendation", "reason", "confidence_level" (e.g. "95%").
    
    Live Gates: {json.dumps(gates_data)}
    Active Incidents: {json.dumps(incidents_data)}
    """
    
    # 3. Call the NVIDIA NIM API
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta/llama-3.1-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 512,
        "temperature": 0.3
    }
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, headers=headers, json=payload, timeout=10.0)
            res.raise_for_status()
            ai_response = res.json()["choices"][0]["message"]["content"]
            
            # Clean up potential markdown formatting from the LLM
            ai_response = ai_response.strip()
            if ai_response.startswith("```json"):
                ai_response = ai_response[7:-3].strip()
            elif ai_response.startswith("```"):
                ai_response = ai_response[3:-3].strip()
            import re
            match = re.search(r'\[.*\]', ai_response, re.DOTALL)
            if match:
                decisions_json = json.loads(match.group(0))
            else:
                decisions_json = json.loads(ai_response)
            
            # 4. Format into DecisionCardResponse
            response_cards = []
            for idx, d in enumerate(decisions_json):
                response_cards.append({
                    "id": 9000 + idx, # Mock ID
                    "title": d.get("title", "AI Recommendation"),
                    "recommendation": d.get("recommendation", "Review required"),
                    "reason": d.get("reason", "No reason provided"),
                    "confidence_level": d.get("confidence_level", "80%"),
                    "user_id": None,
                    "venue_id": 1,
                    "timestamp": datetime.utcnow()
                })
            return response_cards

    except Exception as e:
        print(f"AI API Error: {e}")
        with open("ai_error.log", "a") as f:
            f.write(f"AI API Error: {e}\n")
            import traceback
            traceback.print_exc(file=f)
        # Fallback to database
        return crud.decision.get_decisions(db, skip=skip, limit=limit)
