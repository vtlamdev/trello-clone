from database.mongodb.database import DatabaseService
from config.constant import BOARD_COLLECTION, WORKSPACE_COLLECTION, USER_COLLECTION, CARD_COLLECTION
from modules.board_module.board_model import BoardAddRequest, BoardList, Board, BoardUpdateRequest, BoardAggregation, BoardChangeVisibilityRequest, BoardMoveListRequest, BoardVisibility, BoardInviteMemberRequest, BoardAddListRequest, BoardUpdateListRequest, BoardArchiveListRequest
from bson.objectid import ObjectId
from modules.user_module.user_model import Member, UserRole
from typing import List, Union
from datetime import datetime
from pymongo import ReturnDocument
from fastapi import HTTPException, status

class BoardService():
    def __init__(self):
        self.database_service = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.board_collection = self.database[BOARD_COLLECTION]
        self.workspace_collection = self.database[WORKSPACE_COLLECTION]
    
    def add_board(self, board_add_request: BoardAddRequest, user_id: ObjectId) -> Board:
        lists: List[BoardList] = []
        lists.append(BoardList(cards=[], title="To Do", position=0.0, is_default=True, is_todo=True, is_archived=False))
        lists.append(BoardList(cards=[], title="Doing", position=1.0, is_default=True, is_todo=False, is_archived=False))
        lists.append(BoardList(cards=[], title="Done", position=2.0, is_default=True, is_todo=False, is_archived=False))
        current_date = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
        labels = [
            {
                "title": "",
                "value": "#4BCE97",
            },
            {
                "title": "",
                "value": "#F5CD47",
            },
            {
                "title": "",
                "value": "#FEA362",
            },
            {
                "title": "",
                "value": "#F87168",
            },
            {
                "title": "",
                "value": "#9F8FEF",
            },
            {
                "title": "",
                "value": "#579DFF",
            }
        ]
        board: Board = Board(title=board_add_request.title, description=board_add_request.description, visibility=board_add_request.visibility, invite_link="", members=[user_id], lists=lists, labels=labels, star=[], created_at=current_date, updated_at=current_date, is_deleted=False)
        board_id: ObjectId = self.board_collection.insert_one(board.dict(exclude={"board_id"})).inserted_id
        data: Union[dict, None] = self.workspace_collection.find_one_and_update({"_id": ObjectId(board_add_request.workspace_id)}, {"$push": {"boards": board_id}}, return_document=ReturnDocument.AFTER)
        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        board.board_id = board_id
        return board
    
    def update_board(self,board_update_request: BoardUpdateRequest) -> Board:
        update_values = {}
        if board_update_request.title is not None:
            update_values["title"] = board_update_request.title
        if board_update_request.description is not None:
            update_values["description"] = board_update_request.description
        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_update_request.board_id)}, {"$set": update_values}, return_document=ReturnDocument.AFTER)
        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        board: Board = Board.parse_obj(data)
        return board
    
    def get_board(self, board_id: ObjectId, user_id: ObjectId) -> BoardAggregation:
        data: List[dict] = list(self.board_collection.aggregate([
            {
                "$match": {
                    "_id": board_id,
                    "is_deleted": False
                }
            },
            {
                "$lookup": {
                    "from": WORKSPACE_COLLECTION,
                    "let": {"board_id": "$_id"},
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$in": [
                                        "$$board_id",
                                        "$boards"
                                    ]
                                }
                            }
                        }
                    ],
                    "as": "workspaces"
                }
            },
            {
                "$match": {
                    "$or": [
                        {
                            "visibility": BoardVisibility.PUBLIC
                        },
                        {
                            "visibility": BoardVisibility.WORKSPACE,
                            "workspaces.0.members.user_id": user_id
                        },
                        {
                            "visibility": BoardVisibility.PRIVATE,
                            "members": user_id
                        }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": USER_COLLECTION,
                    "localField": "members",
                    "foreignField": "_id",
                    "as": "members"
                }
            },
            {
                "$lookup": {
                    "from": CARD_COLLECTION,
                    "localField": "lists.cards",
                    "foreignField": "_id",
                    "as": "aggregatedCards"
                }
            },
            {
                "$project": {
                    "title": 1,
                    "description": 1,
                    "visibility": 1,
                    "invite_link": 1,
                    "members": 1,
                    "lists": {
                        "$map": {
                            "input": "$lists",
                            "as": "list",
                            "in": {
                                "list_id": "$$list.list_id",
                                "title": "$$list.title",
                                "position": "$$list.position",
                                "cards": {
                                    "$map": {
                                        "input": "$$list.cards",
                                        "as": "card",
                                        "in": {
                                            "$arrayElemAt": [
                                                {
                                                    "$filter": {
                                                        "input": "$aggregatedCards",
                                                        "as": "aggregatedCard",
                                                        "cond": {
                                                            "$eq": [
                                                                "$$aggregatedCard._id",
                                                                "$$card"
                                                            ]
                                                        }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                },
                                "is_default": "$$list.is_default",
                                "is_todo": "$$list.is_todo",
                                "is_archived": "$$list.is_archived"
                            }
                        }
                    },
                    "labels": 1,
                    "star": 1,
                    "created_at": 1,
                    "updated_at": 1,
                    "is_deleted": 1
                }
            }
        ]))

        if len(data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board_aggregation: BoardAggregation = BoardAggregation.parse_obj(data[0])

        return board_aggregation
    
    def change_visibility(self, board_change_visibility_request: BoardChangeVisibilityRequest, user_id: ObjectId) -> Board:
        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_change_visibility_request.board_id)}, {"$set": {"visibility": board_change_visibility_request.visibility}, "$addToSet": {"members": user_id}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board = Board.parse_obj(data)

        return board
    
    def move_list(self, board_move_list_request: BoardMoveListRequest) -> Board:
        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_move_list_request.board_id), "lists.list_id": ObjectId(board_move_list_request.list_id)}, {"$set": {"lists.$.position": board_move_list_request.position}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board = Board.parse_obj(data)

        return board
    
    def invite_member(self, board_invite_member_request: BoardInviteMemberRequest) -> Board:
        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_invite_member_request.board_id)}, {"$addToSet": {"members": ObjectId(board_invite_member_request.user_id)}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board = Board.parse_obj(data)

        return board
    
    def add_list(self, board_add_list_request: BoardAddListRequest) -> Board:
        board_list: BoardList = BoardList(cards=[], title=board_add_list_request.title, position=board_add_list_request.position, is_default=False, is_todo=False, is_archived=False)

        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_add_list_request.board_id)}, {"$push": {"lists": board_list.dict()}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board = Board.parse_obj(data)

        return board
    
    def update_list(self, board_update_list_request: BoardUpdateListRequest) -> Board:
        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_update_list_request.board_id), "lists.list_id": ObjectId(board_update_list_request.list_id)}, {"$set": {"lists.$.title": board_update_list_request.title}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board = Board.parse_obj(data)

        return board
    
    def archive_list(self, board_archive_list_request: BoardArchiveListRequest) -> Board:
        data: Union[dict, None] = self.board_collection.find_one_and_update({"_id": ObjectId(board_archive_list_request.board_id), "lists.list_id": ObjectId(board_archive_list_request.list_id)}, {"$set": {"lists.$.is_archived": True}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board = Board.parse_obj(data)

        return board
    
    def un_archive_list(self, board_archive_list_request:BoardArchiveListRequest)->Board:
        data: Union[dict, None]=self.board_collection.find_one_and_update({"_id":ObjectId(board_archive_list_request.board_id),"lists.list_id":ObjectId(board_archive_list_request.list_id)},{"$set":{"lists.$.is_archived": False}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        board:Board=Board.parse_obj(data)

        return board
      
    def star_boad(self, board_id: ObjectId, user_id:ObjectId) -> Board:
        # data: Union[dict, None]=self.board_collection.find_one_and_update({"_id":board_id},{"$addToSet":{"star": user_id}}, return_document=ReturnDocument.AFTER)
        
        data: Union[dict, None]=self.board_collection.find_one({"_id":board_id})

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        if user_id in data["star"]:
            data: Union[dict, None]=self.board_collection.find_one_and_update({"_id":board_id},{"$pull":{"star":user_id}}, return_document=ReturnDocument.AFTER)

        else :
            data: Union[dict, None]=self.board_collection.find_one_and_update({"_id":board_id},{"$addToSet":{"star":user_id}}, return_document=ReturnDocument.AFTER)

        board: Board =Board.parse_obj(data)

        return board
    
    def leave_board(self, board_id:ObjectId, user_id:ObjectId)->Board:

        data: Union[dict, None]=self.board_collection.find_one_and_update({"_id":board_id},{"$pull":{"members":user_id}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board=Board.parse_obj(data)

        return board
    def assign_member(self, board_id:ObjectId, member_id:ObjectId, user_id:ObjectId)->Board:
        data: Union[dict, None]=self.board_collection.find_one_and_update({"_id":board_id},{"$addToSet":{"members":member_id}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        board: Board=Board.parse_obj(data)

        return board

