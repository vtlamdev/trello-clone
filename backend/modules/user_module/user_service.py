from database.mongodb.database import DatabaseService
from shared_actions.models.email_model import EmailVerificationRequest
from bson.objectid import ObjectId
from typing import Union, List
from fastapi import HTTPException, status
from shared_actions.operations.data_operation import generate_token, encrypt, verify
from modules.user_module.user_model import User, UserUpdatePasswordRequest, UserUpdateUsernameRequest, UserForgotPasswordRequest, SearchUserResponse, DeleteUserResponse, UserRole
from modules.authentication_module.authentication_model import AuthenticationResponse
from pymongo import ReturnDocument, ASCENDING
from config.constant import USER_COLLECTION, EMAIL_VERIFICATION_COLLECTION, WORKSPACE_COLLECTION
from datetime import datetime

class UserService():
    def __init__(self):
        self.database_service: DatabaseService = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.user_collection = self.database[USER_COLLECTION]
        self.email_verification_collection = self.database[EMAIL_VERIFICATION_COLLECTION]
        self.workspace_collection=self.database[WORKSPACE_COLLECTION]

    def update_email(self, email_verification_request: EmailVerificationRequest, user_id: ObjectId) -> AuthenticationResponse:
        data: Union[dict, None] = self.email_verification_collection.find_one_and_delete({"email": email_verification_request.email, "verification_code": email_verification_request.verification_code})

        if data is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        current_date = datetime.now()
        expired_at = datetime.strptime(data["expired_at"], "%d/%m/%Y, %H:%M:%S")

        if current_date > expired_at:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        data: Union[dict, None] = self.user_collection.find_one({"email": email_verification_request.email})

        if data is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        data: Union[dict, None] = self.user_collection.find_one_and_update({"_id": user_id}, {"$set": {"email": email_verification_request.email}}, return_document = ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        user: User = User.parse_obj(data)
        
        payload = {
            "user_id": str(user.user_id),
            "email": user.email,
            "username": user.username
        }

        token = generate_token(payload)

        authentication_response: AuthenticationResponse = AuthenticationResponse(username=user.username, email=user.email, token=token)

        return authentication_response
    
    def update_password(self, user_update_password_request: UserUpdatePasswordRequest, user_id: ObjectId) -> User:
        data: Union[dict, None] = self.user_collection.find_one({"_id": user_id})

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        user: User = User.parse_obj(data)

        if not verify(user_update_password_request.old_password, user.password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        encrypted_password = encrypt(user_update_password_request.new_password)
        
        data: dict = self.user_collection.find_one_and_update({"_id": user.user_id}, {"$set": {"password": encrypted_password}}, return_document = ReturnDocument.AFTER)

        user: User = User.parse_obj(data)

        return user
    
    def update_username(self, user_update_username_request: UserUpdateUsernameRequest, user_id: ObjectId) -> AuthenticationResponse:
        data: Union[dict, None] = self.user_collection.find_one_and_update({"_id": user_id}, {"$set": {"username": user_update_username_request.username}}, return_document = ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        user: User = User.parse_obj(data)

        print(user)

        payload = {
            "user_id": str(user.user_id),
            "email": user.email,
            "username": user.username
        }

        token = generate_token(payload)
        
        authentication_response: AuthenticationResponse = AuthenticationResponse(username=user.username, email=user.email, token=token)

        return authentication_response
    
    def update_password_by_verification_code(self, user_forgot_password_request: UserForgotPasswordRequest) -> User:
        data: Union[dict, None] = self.email_verification_collection.find_one_and_delete({"email": user_forgot_password_request.email, "verification_code": user_forgot_password_request.verification_code})

        if data is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        current_date = datetime.now()
        expired_at = datetime.strptime(data["expired_at"], "%d/%m/%Y, %H:%M:%S")

        if current_date > expired_at:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        encrypted_password = encrypt(user_forgot_password_request.password)
        
        data: Union[dict, None] = self.user_collection.find_one_and_update({"email": user_forgot_password_request.email}, {"$set": {"password": encrypted_password}}, return_document=ReturnDocument.AFTER)

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        user: User = User.parse_obj(data)

        return user
    
    def search_users(self, keyword: Union[str, None], offset: int, limit: int) -> SearchUserResponse:
        users: List[dict] = []

        search_user_response: SearchUserResponse = SearchUserResponse(users=users, next_offset=0, has_next=False)
        
        if keyword is None:
            return search_user_response
        
        users = list(self.user_collection.find({"$or": [{"username": {"$regex": keyword}}, {"email": {"$regex": keyword}}]}, {"username": 1, "email": 1, "_id": 0, "user_id": {"$toString": "$_id"}}).skip(offset).limit(limit).sort("_id", ASCENDING))

        has_next = len(users) == limit
        
        search_user_response: SearchUserResponse = SearchUserResponse(users=users, next_offset=(offset + len(users)), has_next=has_next)
        
        return search_user_response
    
    def delete_user(self, user_id:ObjectId)->DeleteUserResponse:
        workspaces:List[dict]=[]
        users:List[dict]=[]

        data_response=DeleteUserResponse(workspaces=workspaces, users=users) 

        workspaces=list(
            self.workspace_collection.find({
                "members.user_id":user_id,
                "members.role":UserRole.OWNER
            })
        ) 
        
        if len(workspaces) >0 :
            raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)
        
        current_date=datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
        
        users:Union[dict,None]=self.user_collection.find_one_and_update({"_id":user_id},{"$set":{"is_deleted":True,"is_active":False, "delete_date":current_date}}, return_document=ReturnDocument.AFTER)

        data_response:DeleteUserResponse=DeleteUserResponse(workspaces=workspaces, users=users)
        return data_response
    


        
        
