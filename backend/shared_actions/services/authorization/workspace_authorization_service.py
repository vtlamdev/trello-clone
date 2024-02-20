from bson.objectid import ObjectId
from typing import List, Union
from modules.user_module.user_model import UserRole
from database.mongodb.database import DatabaseService
from config.constant import WORKSPACE_COLLECTION
from fastapi import HTTPException, status

class WorkspaceAuthorizationService:
    def __init__(self):
        self.database_service = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.workspace_collection = self.database[WORKSPACE_COLLECTION]
    def require_role(self, user_id: ObjectId, workspace_id: ObjectId, roles: List[UserRole]):
        role_queries = []
        for role in roles:
            role_queries.append({"members": {"user_id": user_id, "role": role}})
        data: Union[dict, None] = self.workspace_collection.find_one({"$and": [{"_id": workspace_id}, {"$or": role_queries}]})
        if data is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    def validate_change_role_request(self, user_id: ObjectId, changed_user_id: ObjectId, workspace_id: ObjectId, role: UserRole):
        base_roles: List[UserRole] = [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER, UserRole.VIEWER]
        roles: List[UserRole] = []
        if role == UserRole.OWNER:
            roles = [UserRole.OWNER]
        elif role == UserRole.ADMIN:
            roles = [UserRole.OWNER, UserRole.ADMIN]
        elif role == UserRole.MEMBER:
            roles = [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER]
        elif role == UserRole.VIEWER:
            roles = [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER]
        role_queries = []
        count = 0
        for required_role in roles:
            and_queries = []
            and_queries.append({"members": {"user_id": user_id, "role": required_role}})
            or_queries = []
            for i in range(count, len(base_roles)):
                or_queries.append({"members": {"user_id": changed_user_id, "role": base_roles[i]}})
            and_queries.append({"$or": or_queries})
            role_queries.append({"$and": and_queries})
            count = count + 1
        data: Union[dict, None] = self.workspace_collection.find_one({"$and": [{"_id": workspace_id}, {"$or": role_queries}]})
        if data is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)