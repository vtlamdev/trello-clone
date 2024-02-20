from enum import Enum
from pydantic import BaseModel, validator, Field
from datetime import datetime
from fastapi import HTTPException, status
from bson.objectid import ObjectId
from typing import List, Union
from modules.user_module.user_model import Member, MemberResponse, MemberAggregation, UserRole
from modules.board_module.board_model import Board

class WorkspaceVisibility(str, Enum):
    PRIVATE = "PRIVATE"
    PUBLIC = "PUBLIC"

class WorkspaceAddRequest(BaseModel):
    name: str
    description: str
    visibility: WorkspaceVisibility
    
    @validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "",
                "description": "",
                "visibility": "",
            }
        }

class Workspace(BaseModel):
    workspace_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    description: str
    visibility: WorkspaceVisibility
    invite_link: str
    members: List[Member]
    boards: List[ObjectId]
    created_at: str
    updated_at: str
    is_deleted: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "workspace_id": "",
                "name": "",
                "description": "",
                "visibility": "",
                "invite_link": "",
                "members": [],
                "boards": [],
                "created_at": "",
                "updated_at": "",
                "is_deleted": False
            }
        }

class WorkspaceResponse(BaseModel):
    workspace_id: str
    name: str
    description: str
    visibility: WorkspaceVisibility
    members: List[MemberResponse]
    boards: List[str]
    created_at: str
    updated_at: str
    is_deleted: bool

class WorkspaceUpdateRequest(BaseModel):
    workspace_id: str
    name: Union[str, None] = None
    description: Union[str, None] = None
    visibility: Union[WorkspaceVisibility, None] = None

    @validator("workspace_id")
    @classmethod
    def validate_workspace_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "workspace_id": "",
                "name": "",
                "description": "",
                "visibility": ""
            }
        }

class WorkspaceList(BaseModel):
    workspaces: List[Workspace]

class WorkspaceAggregation(BaseModel):
    workspace_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    description: str
    visibility: WorkspaceVisibility
    invite_link: str
    members: List[MemberAggregation]
    boards: List[Board]
    created_at: str
    updated_at: str
    is_deleted: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "workspace_id": "",
                "name": "",
                "description": "",
                "visibility": "",
                "invite_link": "",
                "members": [],
                "boards": [],
                "created_at": "",
                "updated_at": "",
                "is_deleted": False
            }
        }

class WorkspaceListAggregation(BaseModel):
    workspaces: List[WorkspaceAggregation]

class WorkspaceInviteMemberRequest(BaseModel):
    workspace_id: str
    user_id: str

    @validator("workspace_id")
    @classmethod
    def validate_workspace_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("user_id")
    @classmethod
    def validate_user_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "workspace_id": "",
                "user_id": ""
            }
        }

class WorkspaceChangeRoleRequest(BaseModel):
    workspace_id: str
    user_id: str
    role: UserRole

    @validator("workspace_id")
    @classmethod
    def validate_workspace_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("user_id")
    @classmethod
    def validate_user_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "workspace_id": "",
                "user_id": ""
            }
        }

class SearchResponse(BaseModel):
    workspaces:List[dict]
    boards:List[dict]
    workspace_next_offset:int
    board_next_offset:int
    workspace_has_next:bool
    board_has_next:bool