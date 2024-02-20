from bson.objectid import ObjectId
from typing import List, Union
from modules.user_module.user_model import UserRole
from database.mongodb.database import DatabaseService
from config.constant import BOARD_COLLECTION, WORKSPACE_COLLECTION
from fastapi import HTTPException, status
from shared_actions.services.authorization.workspace_authorization_service import (
    WorkspaceAuthorizationService,
)
from modules.board_module.board_model import BoardVisibility


class BoardAuthorizationService:
    def __init__(self):
        self.database_service = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.board_collection = self.database[BOARD_COLLECTION]
        self.workspace_collection = self.database[WORKSPACE_COLLECTION]

    def validate_update_board_request(
        self, user_id: ObjectId, board_id: ObjectId, roles: List[UserRole]
    ):
        data: List[dict] = list(
            self.workspace_collection.aggregate(
                [
                    {
                        "$match": {
                            "members": {
                                "$elemMatch": {
                                    "user_id": user_id,
                                    "role": {"$in": roles},
                                }
                            },
                            "boards": board_id,
                        }
                    },
                    {
                        "$lookup": {
                            "from": BOARD_COLLECTION,
                            "localField": "boards",
                            "foreignField": "_id",
                            "as": "boards",
                        }
                    },
                    {
                        "$match": {
                            "$or": [
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.PUBLIC,
                                        }
                                    }
                                },
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.WORKSPACE,
                                        }
                                    }
                                },
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.PRIVATE,
                                            "members": user_id,
                                        }
                                    }
                                },
                            ]
                        }
                    },
                ]
            )
        )

        if len(data) == 0:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    def validate_invite_member_request(
        self,
        user_id: ObjectId,
        invited_user_id: ObjectId,
        board_id: ObjectId,
        roles: List[UserRole],
    ):
        data: List[dict] = list(
            self.workspace_collection.aggregate(
                [
                    {
                        "$match": {
                            "$and": [
                                {
                                    "members": {
                                        "$elemMatch": {
                                            "user_id": user_id,
                                            "role": {"$in": roles},
                                        }
                                    }
                                },
                                {
                                    "members": {
                                        "$elemMatch": {"user_id": invited_user_id}
                                    }
                                },
                                {"boards": board_id},
                            ]
                        }
                    },
                    {
                        "$lookup": {
                            "from": BOARD_COLLECTION,
                            "localField": "boards",
                            "foreignField": "_id",
                            "as": "boards",
                        }
                    },
                    {
                        "$match": {
                            "$or": [
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.PUBLIC,
                                        }
                                    }
                                },
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.WORKSPACE,
                                        }
                                    }
                                },
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.PRIVATE,
                                            "members": user_id,
                                        }
                                    }
                                },
                            ]
                        }
                    },
                ]
            )
        )

        if len(data) == 0:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    def validate_card_request(
        self, user_id: ObjectId, card_id: ObjectId, roles: List[UserRole]
    ):
        board: Union[dict, None] = self.board_collection.find_one(
            {
                "lists.cards": card_id,
            }
        )

        if board is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        print(board)
        board_id = board["_id"]

        data: List[dict] = list(
            self.workspace_collection.aggregate(
                [
                    {
                        "$match": {
                            "members": {
                                "$elemMatch": {
                                    "user_id": user_id,
                                    "role": {"$in": roles},
                                }
                            },
                            "boards": board_id,
                        }
                    },
                    {
                        "$lookup": {
                            "from": BOARD_COLLECTION,
                            "localField": "boards",
                            "foreignField": "_id",
                            "as": "boards",
                        }
                    },
                    {
                        "$match": {
                            "$or": [
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.PUBLIC,
                                        }
                                    }
                                },
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.WORKSPACE,
                                        }
                                    }
                                },
                                {
                                    "boards": {
                                        "$elemMatch": {
                                            "_id": board_id,
                                            "visibility": BoardVisibility.PRIVATE,
                                            "members": user_id,
                                        }
                                    }
                                },
                            ]
                        }
                    },
                ]
            )
        )

        if len(data) == 0:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
