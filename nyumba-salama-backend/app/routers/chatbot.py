from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter(tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    message = request.message or ""
    
    msg = message.lower()
    
    # Simple responses without database
    if "ifm" in msg:
        response = "📍 IFM iko Posta/Kivukoni, Dar es Salaam"
    elif "magomeni" in msg:
        response = "📍 Magomeni iko Kinondoni"
    elif "udsm" in msg:
        response = "📍 UDSM iko Mlimani, Ubungo"
    elif "aru" in msg:
        response = "📍 ARU iko Observation Hill"
    elif "sinza" in msg:
        response = "📍 Sinza iko Ubungo"
    else:
        response = "Habari! Karibu NyumbaSalama AI. Uliza swali lako."
    
    return ChatResponse(
        response=response,
        session_id=session_id,
        timestamp=datetime.now().isoformat()
    )

@router.get("/chat/health")
async def chatbot_health():
    return {"status": "online", "service": "NyumbaSalama AI"}
