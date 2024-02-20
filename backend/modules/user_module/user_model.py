from pydantic import BaseModel, Field, validator
from bson.objectid import ObjectId
from shared_actions.operations.validation_operation import is_email_valid
from fastapi import HTTPException, status
from typing import List, Union
from enum import Enum

class UserRole(str, Enum):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"

class User(BaseModel):
    user_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    username: str
    email: str
    password: str
    is_active: bool
    is_deleted: bool
    delete_date: str
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "user_id": "",
                "username": "",
                "email": "",
                "password": "",
                "is_active": False,
                "is_deleted": False,
                "delete_date": "",
                "created_at": "",
                "updated_at": ""
            }
        }

class UserUpdatePasswordRequest(BaseModel):
    old_password: str
    new_password: str

    @validator("old_password")
    @classmethod
    def validate_old_password(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "old_password": "",
                "new_password": ""
            }
        }

class UserUpdateUsernameRequest(BaseModel):
    username: str

    @validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "username": ""
            }
        }

class UserForgotPasswordRequest(BaseModel):
    email: str
    password: str
    verification_code: str

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
                "email": "",
                "password": "",
                "verification_code": ""
            }
        }

class SearchUserResponse(BaseModel):
    users: List[dict]
    next_offset: int
    has_next: bool

class Member(BaseModel):
    user_id: ObjectId
    role: UserRole

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "user_id": "",
                "role": ""
            }
        }

class MemberResponse(BaseModel):
    user_id: str
    role: UserRole

class UserAggregation(BaseModel):
    user_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    username: str
    email: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "user_id": "",
                "username": "",
                "email": ""
            }
        }

class MemberAggregation(BaseModel):
    user: UserAggregation
    role: UserRole

class DeleteUserResponse(BaseModel):
    workspaces:List[dict]
    users:Union[dict,None]