from pydantic import BaseModel
from typing import Union

class MessageResponse(BaseModel):
    success: bool
    status_code: int
    data: dict