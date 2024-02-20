from pydantic import BaseModel, Field, validator
from enum import Enum
from bson.objectid import ObjectId
from typing import List, Union
from modules.user_module.user_model import Member, MemberAggregation, UserAggregation
from shared_actions.operations.validation_operation import is_email_valid
from fastapi import HTTPException, status
from modules.card_module.card_model import Card

class BoardVisibility(str, Enum):
    PUBLIC = "PUBLIC"
    WORKSPACE = "WORKSPACE"
    PRIVATE = "PRIVATE"

class BoardList(BaseModel):
    list_id: ObjectId = Field(default_factory=ObjectId)
    cards: List[ObjectId]
    title: str
    position: float
    is_default: bool
    is_todo: bool
    is_archived: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "list_id": "",
                "cards": [],
                "title": "",
                "position": 0.0,
                "is_default": False,
                "is_todo": False,
                "is_archived": False
            }
        }

class BoardLabel(BaseModel):
    label_id: ObjectId = Field(default_factory=ObjectId)
    title: str
    value: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "label_id": "",
                "title": "",
                "value": ""
            }
        }

class Board(BaseModel):
    board_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    title: str
    description: str
    visibility: BoardVisibility
    invite_link: str
    members: List[ObjectId]
    lists: List[BoardList]
    labels: List[BoardLabel]
    star: List[ObjectId]
    created_at: str
    updated_at: str
    is_deleted: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "title": "",
                "description": "",
                "visibility": "",
                "invite_link": "",
                "members": [],
                "lists": [],
                "labels": [],
                "star": [],
                "created_at": "",
                "updated_at": "",
                "is_deleted": False
            }
        }

class BoardAddRequest(BaseModel):
    workspace_id: str
    title: str
    description: str
    visibility: BoardVisibility

    @validator("workspace_id")
    @classmethod
    def validate_workspace_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
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
                "workspace_id": "",
                "title": "",
                "description": "",
                "visibility": ""
            }
        }

class BoardUpdateRequest(BaseModel):
    board_id: str
    title: Union[str, None] = None
    description: Union[str, None] = None

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "title": "",
                "description": ""
            }
        }

class BoardListAggregation(BaseModel):
    list_id: ObjectId = Field(default_factory=ObjectId)
    cards: List[Card]
    title: str
    position: float
    is_default: bool
    is_todo: bool
    is_archived: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "list_id": "",
                "cards": [],
                "title": "",
                "position": 0.0,
                "is_default": False,
                "is_todo": False,
                "is_archived": False
            }
        }

class BoardAggregation(BaseModel):
    board_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    title: str
    description: str
    visibility: BoardVisibility
    invite_link: str
    members: List[UserAggregation]
    lists: List[BoardListAggregation]
    labels: List[BoardLabel]
    star: List[ObjectId]
    created_at: str
    updated_at: str
    is_deleted: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "title": "",
                "description": "",
                "visibility": "",
                "invite_link": "",
                "members": [],
                "lists": [],
                "labels": [],
                "star": [],
                "created_at": "",
                "updated_at": "",
                "is_deleted": False
            }
        }

class BoardChangeVisibilityRequest(BaseModel):
    board_id: str
    visibility: BoardVisibility

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "workspace_id": "",
                "visibility": ""
            }
        }

class BoardMoveListRequest(BaseModel):
    board_id: str
    list_id: str
    position: float

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("list_id")
    @classmethod
    def validate_list_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "list_id": "",
                "position": 0.0
            }
        }

class BoardInviteMemberRequest(BaseModel):
    board_id: str
    user_id: str

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
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
                "board_id": "",
                "user_id": ""
            }
        }

class BoardAddListRequest(BaseModel):
    board_id: str
    title: str
    position: float

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "title": "",
                "position": 0.0
            }
        }

class BoardUpdateListRequest(BaseModel):
    board_id: str
    list_id: str
    title: str

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("list_id")
    @classmethod
    def validate_list_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "list_id": "",
                "title": ""
            }
        }

class BoardArchiveListRequest(BaseModel):
    board_id: str
    list_id: str

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    @validator("list_id")
    @classmethod
    def validate_list_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "list_id": ""
            }
        }

class BoardStarRequest(BaseModel):
    board_id:str

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value:str)->str:
        if value =="":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
            }
        }

class BoardLeaveRequest(BaseModel):
    board_id:str

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value:str)->str:
        if value =="":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return value
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
            }
        }

class AssignMemberRequest(BaseModel):
    board_id:str
    member_id:str

    @validator("board_id")
    @classmethod
    def validate_board_id(cls, value:str)->str:
        if value =="":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return value
    
    @validator("member_id")
    @classmethod
    def validate_member_id(cls, value:str)->str:
        if value =="":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return value
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "board_id": "",
                "member_id":""
            }
        }