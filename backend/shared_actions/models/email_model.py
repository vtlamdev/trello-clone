from pydantic import BaseModel, validator
from typing import List
from shared_actions.operations.validation_operation import is_email_valid
from fastapi import HTTPException, status

class EmailSendingRequest(BaseModel):
    sender: str
    recipients: List[str]
    password: str
    subject: str
    body: str

class EmailRequest(BaseModel):
    email: str

    @validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not is_email_valid(value):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "email": ""
            }
        }

class EmailVerificationRequest(BaseModel):
    email: str
    verification_code: str

    @validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not is_email_valid(value):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("verification_code")
    @classmethod
    def validate_verification_code(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "email": "",
                "verification_code": ""
            }
        }