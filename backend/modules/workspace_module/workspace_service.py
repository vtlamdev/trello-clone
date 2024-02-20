from database.mongodb.database import DatabaseService
from modules.workspace_module.workspace_model import WorkspaceAddRequest, Workspace, WorkspaceUpdateRequest, WorkspaceList, WorkspaceListAggregation, WorkspaceInviteMemberRequest, WorkspaceChangeRoleRequest, WorkspaceVisibility, WorkspaceAggregation, SearchResponse
from bson.objectid import ObjectId
from modules.user_module.user_model import Member, UserRole
from datetime import datetime
from config.constant import WORKSPACE_COLLECTION, USER_COLLECTION, BOARD_COLLECTION
from typing import Union, List
from pymongo import ReturnDocument, ASCENDING
from fastapi import HTTPException, status
from modules.board_module.board_model import BoardVisibility

class WorkspaceService():
    def __init__(self):
        self.database_service: DatabaseService = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.workspace_collection = self.database[WORKSPACE_COLLECTION]
        self.user_collection = self.database[USER_COLLECTION]
        self.board_collection=self.database[BOARD_COLLECTION]

    def add_workspace(self, workspace_add_request: WorkspaceAddRequest, user_id: ObjectId) -> Workspace:
        member: Member = Member(user_id=user_id, role=UserRole.OWNER)
        current_date: str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
        workspace: Workspace = Workspace(name=workspace_add_request.name, description=workspace_add_request.description, visibility=workspace_add_request.visibility, invite_link= "", members=[member], boards=[], created_at=current_date, updated_at=current_date, is_deleted=False)
        workspace_id: ObjectId = self.workspace_collection.insert_one(workspace.dict(exclude={"workspace_id"})).inserted_id
        workspace.workspace_id = workspace_id
        return workspace
    
    def update_workspace(self, workspace_update_request: WorkspaceUpdateRequest) -> Workspace:
        update_values = {}

        if workspace_update_request.name is not None:
            update_values["name"] = workspace_update_request.name
        
        if workspace_update_request.description is not None:
            update_values["description"] = workspace_update_request.description
        
        if workspace_update_request.visibility is not None:
            update_values["visibility"] = workspace_update_request.visibility
        
        data: Union[dict, None] = self.workspace_collection.find_one_and_update({"_id": ObjectId(workspace_update_request.workspace_id)}, {"$set": update_values}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        workspace: Workspace = Workspace.parse_obj(data)

        return workspace
    
    def delete_workspace(self, workspace_id: ObjectId):
        data: Union[dict, None] = self.workspace_collection.find_one_and_update({"_id": workspace_id}, {"$set": {"is_deleted": True}})

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    def get_workspaces(self, user_id: ObjectId) -> WorkspaceListAggregation:
        data: List[dict] = list(self.workspace_collection.aggregate([
            {
                "$match": {
                    "$and": [
                        {
                            "members.user_id": user_id,
                            "is_deleted": False
                        }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": USER_COLLECTION,
                    "localField": "members.user_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            {
                "$lookup": {
                    "from": BOARD_COLLECTION,
                    "localField": "boards",
                    "foreignField": "_id",
                    "as": "boards"
                }
            },
            {
                "$project": {
                    "name": 1,
                    "description": 1,
                    "visibility": 1,
                    "invite_link": 1,
                    "members": {
                        "$map": {
                            "input": "$members",
                            "as": "member",
                            "in": {
                                "user": {
                                    "$arrayElemAt": [
                                        {
                                            "$filter": {
                                                "input": "$user",
                                                "as": "user",
                                                "cond": {
                                                    "$eq": [
                                                        "$$user._id",
                                                        "$$member.user_id"
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                },
                                "role": "$$member.role"
                            }
                        }
                    },
                    "boards": {
                        "$filter": {
                            "input": "$boards",
                            "as": "board",
                            "cond": {
                                "$or": [
                                    {
                                        "$eq": [
                                            "$$board.visibility",
                                            BoardVisibility.PUBLIC
                                        ]
                                    },
                                    {
                                        "$eq": [
                                            "$$board.visibility",
                                            BoardVisibility.WORKSPACE
                                        ]
                                    },
                                    {
                                        "$and": [
                                            {
                                                "$eq": [
                                                    "$$board.visibility",
                                                    BoardVisibility.PRIVATE
                                                ]
                                            },
                                            {
                                                "$in": [
                                                    user_id,
                                                    "$$board.members"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    "created_at": 1,
                    "updated_at": 1,
                    "is_deleted": 1
                }
            }
        ]))
        
        workspace_list_aggregation: WorkspaceListAggregation = WorkspaceListAggregation(workspaces=data)
        
        return workspace_list_aggregation
    
    def invite_member(self, workspace_invite_member_request: WorkspaceInviteMemberRequest) -> Workspace:
        data: Union[dict, None] = self.user_collection.find_one({"_id": ObjectId(workspace_invite_member_request.user_id)})

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        member: Member = Member(user_id=ObjectId(workspace_invite_member_request.user_id), role=UserRole.MEMBER)

        data: Union[dict, None] = self.workspace_collection.find_one_and_update({"_id": ObjectId(workspace_invite_member_request.workspace_id), "members.user_id": {"$nin": [ObjectId(workspace_invite_member_request.user_id)]}}, {"$push": {"members": member.dict()}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        workspace: Workspace = Workspace.parse_obj(data)

        return workspace
    
    def change_role(self, workspace_change_role_request: WorkspaceChangeRoleRequest) -> Workspace:
        data: Union[dict, None] = self.workspace_collection.find_one_and_update({"_id": ObjectId(workspace_change_role_request.workspace_id), "members.user_id": ObjectId(workspace_change_role_request.user_id)}, {"$set": {"members.$.role": workspace_change_role_request.role}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        workspace: Workspace = Workspace.parse_obj(data)

        return workspace
    
    def get_workspace(self, user_id: ObjectId, workspace_id: ObjectId) -> WorkspaceAggregation:
        data: List[dict] = list(self.workspace_collection.aggregate([
            {
                "$match": {
                    "$and": [
                        {
                            "_id": workspace_id,
                            "is_deleted": False
                        },
                        {
                            "$or": [
                                {
                                    "visibility": WorkspaceVisibility.PUBLIC
                                },
                                {
                                    "members.user_id": user_id
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": USER_COLLECTION,
                    "localField": "members.user_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            {
                "$lookup": {
                    "from": BOARD_COLLECTION,
                    "localField": "boards",
                    "foreignField": "_id",
                    "as": "boards"
                }
            },
            {
                "$project": {
                    "name": 1,
                    "description": 1,
                    "visibility": 1,
                    "invite_link": 1,
                    "members": {
                        "$map": {
                            "input": "$members",
                            "as": "member",
                            "in": {
                                "user": {
                                    "$arrayElemAt": [
                                        {
                                            "$filter": {
                                                "input": "$user",
                                                "as": "user",
                                                "cond": {
                                                    "$eq": [
                                                        "$$user._id",
                                                        "$$member.user_id"
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                },
                                "role": "$$member.role"
                            }
                        }
                    },
                    "boards": {
                        "$filter": {
                            "input": "$boards",
                            "as": "board",
                            "cond": {
                                "$or": [
                                    {
                                        "$eq": [
                                            "$$board.visibility",
                                            BoardVisibility.PUBLIC
                                        ]
                                    },
                                    {
                                        "$and": [
                                            {
                                                "$eq": [
                                                    "$$board.visibility",
                                                    BoardVisibility.WORKSPACE
                                                ]
                                            },
                                            {
                                                "$eq": [
                                                    "$members.user._id",
                                                    user_id
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "$and": [
                                            {
                                                "$eq": [
                                                    "$$board.visibility",
                                                    BoardVisibility.PRIVATE
                                                ]
                                            },
                                            {
                                                "$in": [
                                                    user_id,
                                                    "$$board.members"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    "created_at": 1,
                    "updated_at": 1,
                    "is_deleted": 1
                }
            }
        ]))
        
        if len(data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        workspace_aggregation: WorkspaceAggregation = WorkspaceAggregation.parse_obj(data[0])
        
        return workspace_aggregation
    
    def search(self, keyword:Union[str, None], workspace_offset:int,board_offset:int, workspace_limit:int,board_limit:int, user_id:ObjectId)->SearchResponse:
        workspaces:List[dict]=[]
        boards:List[dict]=[]

        search_response:SearchResponse=SearchResponse(workspaces=workspaces, boards=boards,workspace_next_offset=0,board_next_offset=0, workspace_has_next=False, board_has_next=False)
        
        if keyword is None:
            return search_response
        
        workspaces=list(self.workspace_collection.find({"$and":[{'name':{"$regex":keyword,"$options": 'i'}},{"$or":[{"visibility":WorkspaceVisibility.PUBLIC},{"$and":[{"members.user_id":user_id},{"visibility":WorkspaceVisibility.PRIVATE}]}]}] },{"name":1,"_id":0,"workspace_id":{"$toString": "$_id"}}).skip(workspace_offset).limit(workspace_limit).sort("_id",ASCENDING)) 
        boards=list(self.board_collection.aggregate([
            {
                "$match":{
                    "title":{"$regex":keyword,"$options": 'i'}
                }
                
            },
            {
                "$lookup": {
                    "from": WORKSPACE_COLLECTION,
                    "let": { "board_id": "$_id"},
                    "pipeline": [
                            { 
                                "$match":{
                                    "$expr":{
                                        "$in":[
                                            "$$board_id",
                                            "$boards"
                                        ]
                                    }
                                    # "$boards":"$$board_id"
                                }
                            }
                        ],
                    "as": "workspaces"
                }
            },
            {
                "$match":{
                    "$or": [
                        {
                            "visibility":BoardVisibility.PUBLIC
                        },
                        {
                            "visibility":BoardVisibility.WORKSPACE,
                            "workspaces.0.members.user_id":user_id
                        },
                        {
                            "visibility":BoardVisibility.PRIVATE,
                            "members":user_id
                        }
                    ]
                }
            },
            {
                "$project":{
                    "title":1,
                    "updated_at":1,
                    "_id":0,
                    "board_id":{"$toString": "$_id"},
                    "workspace":{
                        "$arrayElemAt":["$workspaces",0]
                    }
                }
            },
            {
                "$project":{
                    "title":1,
                    "updated_at":1,
                    "_id":0,
                    "board_id":1,
                    "workspace_name":"$workspace.name",
                    "workspace_id":{ "$toString": "$workspace._id" }
                }
            },
            { "$skip" : board_offset }
            ,
            { "$limit" : board_limit },
            { "$sort" : { "board_id" : 1} }

        ]))

        workspace_has_next=len(workspaces) == workspace_limit

        board_has_next=len(boards)==board_limit

        search_response:SearchResponse=SearchResponse(workspaces=workspaces, boards=boards, workspace_next_offset=(workspace_offset+len(workspaces)), workspace_has_next=workspace_has_next, board_next_offset=(board_offset+len(boards)), board_has_next=board_has_next)

        return search_response
    
    def remove_member(self, workspace_remove_member_request: WorkspaceChangeRoleRequest):
        data: Union[dict, None] = self.workspace_collection.find_one_and_update(
            {
                "_id": ObjectId(workspace_remove_member_request.workspace_id),
            }, 
            {
            "$pull": {"members": {"user_id": ObjectId(workspace_remove_member_request.user_id)}}
            },
            return_document=ReturnDocument.AFTER
        )

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)