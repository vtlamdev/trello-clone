from pydantic import BaseModel, validator
from shared_actions.operations.validation_operation import is_email_valid
from fastapi import HTTPException, status
from datetime import datetime

class AuthenticationLoginRequest(BaseModel):
    email: str
    password: str

    @validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not is_email_valid(value):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "email": "",
                "password": ""
            }
        }

class AuthenticationRegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    verification_code: str
    is_active: bool = True
    is_deleted: bool = False
    delete_date: str = ""
    created_at: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    updated_at: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

    @validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not is_email_valid(value):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if value == "":
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
                "username": "",
                "email": "",
                "password": "",
                "verification_code": ""
            }
        }

class AuthenticationResponse(BaseModel):
    username: str
    email: str
    token: str