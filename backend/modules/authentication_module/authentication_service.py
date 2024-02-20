from database.mongodb.database import DatabaseService
from modules.authentication_module.authentication_model import AuthenticationLoginRequest, AuthenticationResponse, AuthenticationRegisterRequest
from fastapi import HTTPException, status
from modules.user_module.user_model import User
from shared_actions.operations.data_operation import generate_token, encrypt, verify
from typing import Union
from bson.objectid import ObjectId
from config.constant import USER_COLLECTION, EMAIL_VERIFICATION_COLLECTION
from datetime import datetime

class AuthenticationService:
    def __init__(self):
        self.database_service: DatabaseService = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.user_collection = self.database[USER_COLLECTION]
        self.email_verification_collection = self.database[EMAIL_VERIFICATION_COLLECTION]

    def login(self, authentication_login_request: AuthenticationLoginRequest) -> AuthenticationResponse:
        data: Union[dict, None] = self.user_collection.find_one({"email": authentication_login_request.email})

        if data is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        user: User = User.parse_obj(data)

        if not verify(authentication_login_request.password, user.password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        payload = {
            "user_id": str(user.user_id),
            "username": user.username,
            "email": user.email
        }

        token = generate_token(payload)

        authentication_response: AuthenticationResponse = AuthenticationResponse(username=user.username, email=user.email, token=token)
        
        return authentication_response
    
    def register(self, authentication_register_request: AuthenticationRegisterRequest) -> AuthenticationResponse:
        data: Union[dict, None] = self.email_verification_collection.find_one_and_delete({"email": authentication_register_request.email, "verification_code": authentication_register_request.verification_code})

        if data is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        current_date = datetime.now()
        expired_at = datetime.strptime(data["expired_at"], "%d/%m/%Y, %H:%M:%S")

        if current_date > expired_at:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        data: Union[dict, None] = self.user_collection.find_one({"email": authentication_register_request.email})

        if data is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
        
        encrypted_password = encrypt(authentication_register_request.password)

        authentication_register_request.password = encrypted_password
        
        user_id: ObjectId = self.user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id

        payload = {
            "user_id": str(user_id),
            "username": authentication_register_request.username,
            "email": authentication_register_request.email
        }
        
        token = generate_token(payload)
        
        authentication_response: AuthenticationResponse = AuthenticationResponse(username=authentication_register_request.username, email=authentication_register_request.email, token=token)

        return authentication_response