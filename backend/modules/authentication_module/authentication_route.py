from fastapi import APIRouter, Body, status, Depends
from modules.authentication_module.authentication_model import AuthenticationLoginRequest, AuthenticationResponse, AuthenticationRegisterRequest
from modules.authentication_module.authentication_service import AuthenticationService
from shared_actions.models.message_response_model import MessageResponse
from fastapi.responses import JSONResponse
from shared_actions.dependencies.authentication.authentication_dependency import verify_token

authentication_router = APIRouter()
authentication_service = AuthenticationService()

@authentication_router.post("/login")
def login(authentication_login_request: AuthenticationLoginRequest = Body(...)):
    authentication_response: AuthenticationResponse = authentication_service.login(authentication_login_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=authentication_response.dict())
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())

@authentication_router.post("/register")
def register(authentication_register_request: AuthenticationRegisterRequest = Body(...)):
    authentication_response: AuthenticationResponse = authentication_service.register(authentication_register_request)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data=authentication_response.dict())
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())