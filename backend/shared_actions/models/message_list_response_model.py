from pydantic import BaseModel
from typing import List, Union

class MessageListResponse(BaseModel):
    success: bool
    status_code: int
    data: List[dict]