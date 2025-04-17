from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ListElementBase(BaseModel):
    first_name: str
    last_name: str
    country: str

class ListElementCreate(ListElementBase):
    pass

class ListElement(ListElementBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 