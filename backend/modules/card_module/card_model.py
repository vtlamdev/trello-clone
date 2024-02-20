from pydantic import BaseModel, validator, Field
from fastapi import HTTPException, status
from bson.objectid import ObjectId
from typing import List, Union
from modules.user_module.user_model import UserAggregation


class ChecklistItem(BaseModel):
    item_id: ObjectId = Field(default_factory=ObjectId)
    name: str
    is_checked: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class Checklist(BaseModel):
    check_list_id: ObjectId = Field(default_factory=ObjectId)
    title: str
    item: List[ChecklistItem]

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class Attachment(BaseModel):
    file_id: ObjectId = Field(default_factory=ObjectId)
    url: str
    name: str
    type: str
    added_date: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class Comment(BaseModel):
    comment_id: ObjectId = Field(default_factory=ObjectId)
    user_id: ObjectId
    content: str
    created_at: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class BoardInfo(BaseModel):
    board_id: ObjectId
    title: str

    class Config:
        arbitrary_types_allowed = True


class ListInfo(BaseModel):
    list_id: ObjectId
    title: str

    class Config:
        arbitrary_types_allowed = True


class Card(BaseModel):
    card_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    description: str
    position: float
    assign: List[ObjectId]  # lookup user info from User
    label: List[ObjectId]  # lookup label info from Board
    check_list: List[Checklist]
    start_date: str
    due_date: str
    is_completed: bool
    is_archived: bool
    attachment: List[Attachment]
    watch: List[ObjectId]
    comment: List[Comment]  # lookup user info from User
    created_at: str
    updated_at: str
    is_deleted: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class CreateCardRequest(BaseModel):
    board_id: str
    list_id: str
    name: str
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

    @validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return value

    class Config:
        populate_by_name = True


class UpdateCardRequest(BaseModel):
    name: Union[str, None] = None
    description: Union[str, None] = None
    start_date: Union[str, None] = None
    due_date: Union[str, None] = None
    is_completed: Union[bool, None] = None
    is_archived: Union[bool, None] = None

    validator("name")

    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class MoveCardRequest(BaseModel):
    card_id: str
    old_board_id: str
    old_list_id: str
    new_board_id: str
    new_list_id: str
    position: float

    validator("card_id")

    @classmethod
    def validate_card_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    validator("old_board_id")

    @classmethod
    def validate_old_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    validator("old_list_id")

    @classmethod
    def validate_old_list_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    validator("new_board_id")

    @classmethod
    def validate_new_board_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    validator("new_list_id")

    @classmethod
    def validate_new_list_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True


class UpdateAssignMemberRequest(BaseModel):
    member_id: str
    is_assigned: bool

    @validator("member_id")
    @classmethod
    def validate_member_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True


class UpdateWatchRequest(BaseModel):
    is_watch: bool

    class Config:
        populate_by_name = True


class UpdateCardLabelRequest(BaseModel):
    label_id: str
    is_selected: bool

    @validator("label_id")
    @classmethod
    def validate_label_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True


class UpdateCardCommentRequest(BaseModel):
    content: str

    @validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True


class BoardLabelAggregation(BaseModel):
    label_id: ObjectId
    title: str
    value: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class CommentAggregation(BaseModel):
    comment_id: ObjectId
    user: UserAggregation
    content: str
    created_at: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class CardAggregation(BaseModel):
    card_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    description: str
    position: float
    assign: List[UserAggregation]  # lookup user info from User
    label: List[BoardLabelAggregation]  # lookup label info from Board
    check_list: List[Checklist]
    start_date: str
    due_date: str
    is_completed: bool
    is_archived: bool
    attachment: List[Attachment]
    watch: List[ObjectId]
    comment: List[CommentAggregation]  # lookup user info from User
    created_at: str
    updated_at: str
    is_deleted: bool
    board: BoardInfo
    list: ListInfo

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class AssignedCardResponse(BaseModel):
    card_id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    description: str
    position: float
    assign: List[ObjectId]
    label: List[BoardLabelAggregation]
    check_list: List[Checklist]
    start_date: str
    due_date: str
    is_completed: bool
    is_archived: bool
    attachment: List[Attachment]
    watch: List[ObjectId]
    comment: List[Comment]
    created_at: str
    updated_at: str
    is_deleted: bool
    board: BoardInfo
    list: ListInfo

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class AssignedCardListResponses(BaseModel):
    card_list_response: List[AssignedCardResponse]


class AddCommentRequest(BaseModel):
    user_id: str
    content: str

    @validator("user_id")
    @classmethod
    def validate_user_id(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    @validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class AddAttachmentRequest(BaseModel):
    url: str
    name: str
    type: str

    @validator("url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    @validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    @validator("type")
    @classmethod
    def validate_type(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class UpdateCardAttachmentRequest(BaseModel):
    name: str

    @validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class AddChecklistRequest(BaseModel):
    title: str

    @validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class UpdateCardChecklistRequest(BaseModel):
    title: str

    @validator("title")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class AddChecklistItemRequest(BaseModel):
    name: str

    @validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class UpdateCardChecklistItemRequest(BaseModel):
    name: Union[str, None] = None
    is_checked: Union[bool, None] = None

    @validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if value == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

        return value

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
