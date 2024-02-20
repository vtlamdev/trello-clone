from fastapi import APIRouter, Body, Depends, HTTPException, status
from shared_actions.dependencies.authentication.authentication_dependency import verify_token
from shared_actions.models.email_model import EmailVerificationRequest
from modules.user_module.user_service import UserService
from modules.authentication_module.authentication_model import AuthenticationResponse
from shared_actions.models.message_response_model import MessageResponse
from shared_actions.operations.data_operation import clean_dict
from fastapi.responses import JSONResponse
from bson.objectid import ObjectId
from modules.user_module.user_model import UserUpdatePasswordRequest, User, UserUpdateUsernameRequest, UserForgotPasswordRequest, SearchUserResponse, DeleteUserResponse
from typing import Union
import re

user_router = APIRouter()
user_service = UserService()

@user_router.get("/searchUsers")
def search_users(keyword: Union[str, None] = None, offset: int = 0, limit: int = 5):
    search_user_response: SearchUserResponse = user_service.search_users(keyword, offset, limit)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=search_user_response.dict())
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@user_router.put("/updateEmail")
def update_email(email_verification_request: EmailVerificationRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    authentication_response: AuthenticationResponse = user_service.update_email(email_verification_request, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=authentication_response.dict())
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@user_router.put("/updatePassword")
def update_password(user_update_password_request: UserUpdatePasswordRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    user: User = user_service.update_password(user_update_password_request, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=user.dict(include={"username", "email"}))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@user_router.put("/updateUsername")
def update_username(user_update_username_request: UserUpdateUsernameRequest = Body(...), payload: dict = Depends(verify_token)):
    data: dict = payload["data"]
    authentication_response: AuthenticationResponse = user_service.update_username(user_update_username_request, ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=authentication_response.dict())
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@user_router.put("/forgotPassword")
def update_password_by_verification_code(user_forgot_password_request: UserForgotPasswordRequest):
    user: User = user_service.update_password_by_verification_code(user_forgot_password_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=user.dict(include={"username", "email"}))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@user_router.put("/deleteAccount")
def delete_account(payload: dict=Depends(verify_token)):
    data: dict=payload["data"]
    deleteResponse:DeleteUserResponse= user_service.delete_user(ObjectId(data["user_id"]))
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=clean_dict(deleteResponse.dict()))
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())
