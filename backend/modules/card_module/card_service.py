from fastapi import HTTPException, status
from pymongo import ReturnDocument
from typing import Union, List
from bson.objectid import ObjectId
from datetime import datetime
from database.mongodb.database import DatabaseService
from modules.card_module.card_model import (
    CreateCardRequest,
    Card,
    Comment,
    Attachment,
    Checklist,
    ChecklistItem,
    AssignedCardListResponses,
    CardAggregation,
    UpdateCardRequest,
    MoveCardRequest,
    UpdateAssignMemberRequest,
    UpdateWatchRequest,
    UpdateCardLabelRequest,
    AddCommentRequest,
    UpdateCardCommentRequest,
    AddAttachmentRequest,
    UpdateCardAttachmentRequest,
    AddChecklistRequest,
    UpdateCardChecklistRequest,
    AddChecklistItemRequest,
    UpdateCardChecklistItemRequest,
)
from modules.user_module.user_model import Member, UserRole
from config.constant import (
    WORKSPACE_COLLECTION,
    USER_COLLECTION,
    BOARD_COLLECTION,
    CARD_COLLECTION,
)


class CardService:
    def __init__(self):
        self.database_service: DatabaseService = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.workspace_collection = self.database[WORKSPACE_COLLECTION]
        self.board_collection = self.database[BOARD_COLLECTION]
        self.card_collection = self.database[CARD_COLLECTION]
        self.user_collection = self.database[USER_COLLECTION]

    def create_card(self, create_card_request: CreateCardRequest) -> Card:
        board: Union[dict, None] = self.board_collection.find_one(
            {
                "_id": ObjectId(create_card_request.board_id),
                "lists.list_id": ObjectId(create_card_request.list_id),
            }
        )

        if board is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        current_date: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

        card: Card = Card(
            name=create_card_request.name,
            description="",
            position=create_card_request.position,
            assign=[],
            label=[],
            check_list=[],
            start_date="",
            due_date="",
            is_completed=False,
            is_archived=False,
            attachment=[],
            watch=[],
            comment=[],
            created_at=current_date,
            updated_at=current_date,
            is_deleted=False,
        )
        card_id: ObjectId = self.card_collection.insert_one(
            card.dict(exclude={"card_id"})
        ).inserted_id
        card.card_id = card_id

        data: Union[dict, None] = self.board_collection.find_one_and_update(
            {
                "_id": ObjectId(create_card_request.board_id),
                "lists.list_id": ObjectId(create_card_request.list_id),
            },
            {"$push": {"lists.$.cards": card_id}},
            return_document=ReturnDocument.AFTER,
        )
        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return card

    def get_card(self, card_id: ObjectId) -> CardAggregation:
        board: Union[dict, None] = self.board_collection.find_one(
            {"lists.cards": card_id, "is_deleted": False},
        )

        if board is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        data: List[dict] = list(
            self.card_collection.aggregate(
                [
                    {"$match": {"_id": card_id, "is_deleted": False}},
                    {
                        "$lookup": {
                            "from": USER_COLLECTION,
                            "localField": "assign",
                            "foreignField": "_id",
                            "as": "assign",
                        }
                    },
                    {
                        "$lookup": {
                            "from": USER_COLLECTION,
                            "localField": "comment.user_id",
                            "foreignField": "_id",
                            "as": "aggregatedUsers",
                        }
                    },
                    {
                        "$project": {
                            "name": 1,
                            "description": 1,
                            "position": 1,
                            "assign": 1,
                            "label": 1,
                            "check_list": 1,
                            "start_date": 1,
                            "due_date": 1,
                            "is_completed": 1,
                            "is_archived": 1,
                            "attachment": 1,
                            "watch": 1,
                            "comment": {
                                "$map": {
                                    "input": "$comment",
                                    "as": "comment",
                                    "in": {
                                        "user": {
                                            "$arrayElemAt": [
                                                {
                                                    "$filter": {
                                                        "input": "$aggregatedUsers",
                                                        "as": "aggregatedUser",
                                                        "cond": {
                                                            "$eq": [
                                                                "$$aggregatedUser._id",
                                                                "$$comment.user_id",
                                                            ]
                                                        },
                                                    }
                                                },
                                                0,
                                            ]
                                        },
                                        "comment_id": "$$comment.comment_id",
                                        "content": "$$comment.content",
                                        "created_at": "$$comment.created_at",
                                    },
                                }
                            },
                            "created_at": 1,
                            "updated_at": 1,
                            "is_deleted": 1,
                        }
                    },
                ]
            )
        )

        if len(data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        data[0]["label"] = [
            x
            for y in list(
                map(
                    lambda label_id: [
                        label_item
                        for label_item in board["labels"]
                        if (label_item["label_id"] == label_id)
                    ],
                    data[0]["label"],
                )
            )
            for x in y
        ]

        boardInfo = {"board_id": board["_id"], "title": board["title"]}

        list_info = list(
            list
            for list in board["lists"]
            for card_item_id in list["cards"]
            if card_item_id == card_id
        )

        listInfo = {"list_id": list_info[0]["list_id"], "title": list_info[0]["title"]}

        data[0]["board"] = boardInfo
        data[0]["list"] = listInfo

        card: CardAggregation = CardAggregation(**data[0])

        return card

    def get_assigned_card(self, user_id: ObjectId) -> AssignedCardListResponses:
        data: List[dict] = list(
            self.card_collection.find({"assign": user_id, "is_deleted": False})
        )

        result = []

        for data_item in data:
            board: Union[dict, None] = self.board_collection.find_one(
                {"lists.cards": data_item["_id"], "is_deleted": False},
            )

            if board is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

            data_item["label"] = [
                x
                for y in list(
                    map(
                        lambda label_id: [
                            label_item
                            for label_item in board["labels"]
                            if (label_item["label_id"] == label_id)
                        ],
                        data_item["label"],
                    )
                )
                for x in y
            ]

            boardInfo = {"board_id": board["_id"], "title": board["title"]}

            list_info = list(
                list
                for list in board["lists"]
                for card_item_id in list["cards"]
                if card_item_id == data_item["_id"]
            )

            listInfo = {
                "list_id": list_info[0]["list_id"],
                "title": list_info[0]["title"],
            }

            data_item["board"] = boardInfo
            data_item["list"] = listInfo

            result.append(data_item)

        assigned_card_list: AssignedCardListResponses = AssignedCardListResponses(
            card_list_response=result
        )
        return assigned_card_list

    def delete_card(self, card_id: ObjectId):
        data: Union[dict, None] = self.board_collection.find_one_and_update(
            {"lists.cards": card_id},
            {"$pull": {"lists.$.cards": card_id}},
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        data: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": card_id}, {"$set": {"is_deleted": True}}
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def update_card(self, card_id: str, card_update_request: UpdateCardRequest) -> Card:
        update_values = {}

        if card_update_request.name is not None:
            update_values["name"] = card_update_request.name

        if card_update_request.description is not None:
            update_values["description"] = card_update_request.description

        if card_update_request.start_date is not None:
            update_values["start_date"] = card_update_request.start_date

        if card_update_request.due_date is not None:
            update_values["due_date"] = card_update_request.due_date

        if card_update_request.is_completed is not None:
            update_values["is_completed"] = card_update_request.is_completed

        if card_update_request.is_archived is not None:
            update_values["is_archived"] = card_update_request.is_archived

        current_date: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

        update_values["updated_at"] = current_date

        data: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": card_id},
            {"$set": update_values},
            return_document=ReturnDocument.AFTER,
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        card: Card = Card(**data)

        return card

    def move_card(self, card_move_request: MoveCardRequest):
        old_board_list: Union[dict, None] = self.board_collection.find_one(
            {
                "_id": ObjectId(card_move_request.old_board_id),
                "lists.list_id": ObjectId(card_move_request.old_list_id),
                "lists.cards": ObjectId(card_move_request.card_id),
            }
        )

        if old_board_list is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        new_board_list: Union[dict, None] = self.board_collection.find_one(
            {
                "_id": ObjectId(card_move_request.new_board_id),
                "lists.list_id": ObjectId(card_move_request.new_list_id),
            }
        )

        if new_board_list is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        if (
            card_move_request.old_board_id != card_move_request.new_board_id
            or card_move_request.old_list_id != card_move_request.new_list_id
        ):
            old_board: Union[dict, None] = self.board_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_move_request.old_board_id),
                    "lists.list_id": ObjectId(card_move_request.old_list_id),
                },
                {"$pull": {"lists.$.cards": ObjectId(card_move_request.card_id)}},
            )

            if old_board is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

            new_board: Union[dict, None] = self.board_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_move_request.new_board_id),
                    "lists.list_id": ObjectId(card_move_request.new_list_id),
                },
                {"$push": {"lists.$.cards": ObjectId(card_move_request.card_id)}},
            )

            if new_board is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_move_request.card_id)},
            {"$set": {"position": card_move_request.position}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def update_assigned_member(
        self, card_id: str, card_update_request: UpdateAssignMemberRequest
    ) -> Card:
        card: Union[dict, None] = self.card_collection.find_one(
            {"_id": ObjectId(card_id), "is_deleted": False}
        )
        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        board: Union[dict, None] = self.board_collection.find_one(
            {
                "lists.cards": ObjectId(card_id),
                "members": ObjectId(card_update_request.member_id),
                "is_deleted": False,
            }
        )

        if board is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        if card_update_request.is_assigned:
            data: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {"$push": {"assign": ObjectId(card_update_request.member_id)}},
                return_document=ReturnDocument.AFTER,
            )
            if data is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        else:
            data: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {"$pull": {"assign": ObjectId(card_update_request.member_id)}},
                return_document=ReturnDocument.AFTER,
            )
            if data is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return card

    def update_watch(
        self, card_id: str, user_id: str, card_update_request: UpdateWatchRequest
    ) -> Card:
        card: Union[dict, None] = self.card_collection.find_one(
            {"_id": ObjectId(card_id), "is_deleted": False}
        )
        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        if card_update_request.is_watch:
            data: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {"$push": {"watch": ObjectId(user_id)}},
                return_document=ReturnDocument.AFTER,
            )
            if data is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        else:
            data: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {"$pull": {"watch": ObjectId(user_id)}},
                return_document=ReturnDocument.AFTER,
            )
            if data is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return card

    def update_label(
        self, card_id: str, card_update_request: UpdateCardLabelRequest
    ) -> Card:
        card: Union[dict, None] = self.card_collection.find_one(
            {"_id": ObjectId(card_id), "is_deleted": False}
        )
        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        board: Union[dict, None] = self.board_collection.find_one(
            {
                "lists.cards": ObjectId(card_id),
                "labels.label_id": ObjectId(card_update_request.label_id),
                "is_deleted": False,
            }
        )

        if board is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        if card_update_request.is_selected:
            data: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {"$push": {"label": ObjectId(card_update_request.label_id)}},
                return_document=ReturnDocument.AFTER,
            )
            if data is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        else:
            data: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {"$pull": {"label": ObjectId(card_update_request.label_id)}},
                return_document=ReturnDocument.AFTER,
            )
            if data is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return card

    def add_comment(self, card_id: str, comment_add_request: AddCommentRequest):
        card: Union[dict, None] = self.card_collection.find_one(
            {
                "_id": ObjectId(card_id),
            }
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        current_date: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

        comment: Comment = Comment(
            user_id=ObjectId(comment_add_request.user_id),
            content=comment_add_request.content,
            created_at=current_date,
        )

        data: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id)},
            {"$push": {"comment": comment.dict()}},
            return_document=ReturnDocument.AFTER,
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def update_comment(
        self,
        card_id: str,
        comment_id: str,
        card_update_request: UpdateCardCommentRequest,
    ) -> Card:

        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id), "comment.comment_id": ObjectId(comment_id)},
            {"$set": {"comment.$.content": card_update_request.content}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return Card(**card)

    def delete_comment(self, card_id: str, comment_id: str):
        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id)},
            {"$pull": {"comment": {"comment_id": ObjectId(comment_id)}}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def add_attachment(self, card_id: str, comment_add_request: AddAttachmentRequest):
        card: Union[dict, None] = self.card_collection.find_one(
            {
                "_id": ObjectId(card_id),
            }
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        current_date: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

        attachment: Attachment = Attachment(
            url=comment_add_request.url,
            name=comment_add_request.name,
            type=comment_add_request.type,
            added_date=current_date,
        )

        data: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id)},
            {"$push": {"attachment": attachment.dict()}},
            return_document=ReturnDocument.AFTER,
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def update_attachment(
        self,
        card_id: str,
        attachment_id: str,
        card_update_request: UpdateCardAttachmentRequest,
    ) -> Card:

        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id), "attachment.file_id": ObjectId(attachment_id)},
            {"$set": {"attachment.$.name": card_update_request.name}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return Card(**card)

    def delete_attachment(self, card_id: str, attachment_id: str):
        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id)},
            {"$pull": {"attachment": {"file_id": ObjectId(attachment_id)}}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def add_checklist(self, card_id: str, checklist_add_request: AddChecklistRequest):
        card: Union[dict, None] = self.card_collection.find_one(
            {
                "_id": ObjectId(card_id),
            }
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        check_list: Checklist = Checklist(title=checklist_add_request.title, item=[])

        data: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id)},
            {"$push": {"check_list": check_list.dict()}},
            return_document=ReturnDocument.AFTER,
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def update_checklist(
        self,
        card_id: str,
        checklist_id: str,
        card_update_request: UpdateCardChecklistRequest,
    ) -> Card:

        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {
                "_id": ObjectId(card_id),
                "check_list.check_list_id": ObjectId(checklist_id),
            },
            {"$set": {"check_list.$.title": card_update_request.title}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return Card(**card)

    def delete_checklist(self, card_id: str, checklist_id: str):
        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {"_id": ObjectId(card_id)},
            {"$pull": {"check_list": {"check_list_id": ObjectId(checklist_id)}}},
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def add_checklist_item(
        self,
        card_id: str,
        checklist_id: str,
        checklist_item_add_request: AddChecklistItemRequest,
    ):
        card: Union[dict, None] = self.card_collection.find_one(
            {
                "_id": ObjectId(card_id),
            }
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        check_list_item: ChecklistItem = ChecklistItem(
            name=checklist_item_add_request.name, is_checked=False
        )

        data: Union[dict, None] = self.card_collection.find_one_and_update(
            {
                "_id": ObjectId(card_id),
                "check_list.check_list_id": ObjectId(checklist_id),
            },
            {"$push": {"check_list.$.item": check_list_item.dict()}},
            return_document=ReturnDocument.AFTER,
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def update_checklist_item(
        self,
        card_id: str,
        checklist_id: str,
        checklist_item_id: str,
        card_update_request: UpdateCardChecklistItemRequest,
    ) -> Card:

        if card_update_request.name is not None:

            card: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {
                    "$set": {
                        "check_list.$[outer].item.$[inter].name": card_update_request.name
                    }
                },
                array_filters=[
                    {"outer.check_list_id": ObjectId(checklist_id)},
                    {"inter.item_id": ObjectId(checklist_item_id)},
                ],
            )

            if card is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        if card_update_request.is_checked is not None:

            card: Union[dict, None] = self.card_collection.find_one_and_update(
                {
                    "_id": ObjectId(card_id),
                },
                {
                    "$set": {
                        "check_list.$[outer].item.$[inter].is_checked": card_update_request.is_checked
                    }
                },
                array_filters=[
                    {"outer.check_list_id": ObjectId(checklist_id)},
                    {"inter.item_id": ObjectId(checklist_item_id)},
                ],
            )

            if card is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        return Card(**card)

    def delete_checklist_item(
        self, card_id: str, checklist_id: str, checklist_item_id: str
    ):
        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {
                "_id": ObjectId(card_id),
            },
            {
                "$pull": {
                    "check_list.$[outer].item": {"item_id": ObjectId(checklist_item_id)}
                }
            },
            array_filters=[
                {"outer.check_list_id": ObjectId(checklist_id)},
            ],
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def convert_to_card(
        self,
        card_id: str,
        checklist_id: str,
        checklist_item_id: str,
        create_card_request: CreateCardRequest,
    ):

        self.create_card(create_card_request)

        card: Union[dict, None] = self.card_collection.find_one_and_update(
            {
                "_id": ObjectId(card_id),
            },
            {
                "$pull": {
                    "check_list.$[outer].item": {"item_id": ObjectId(checklist_item_id)}
                }
            },
            array_filters=[
                {"outer.check_list_id": ObjectId(checklist_id)},
            ],
        )

        if card is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
