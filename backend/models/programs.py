from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProgramBase(BaseModel):
    title: str
    description: Optional[str] = None

class ProgramResponse(ProgramBase):
    id: str
    created_at: datetime
