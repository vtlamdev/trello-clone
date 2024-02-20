from fastapi import APIRouter, Body, HTTPException, status
from shared_actions.models.email_model import EmailRequest
from shared_actions.operations.communication_operation import send_smtp_email
from shared_actions.operations.data_operation import generate_token
from config.config import config
from shared_actions.models.message_response_model import MessageResponse
from fastapi.responses import JSONResponse
from modules.operation_module.operation_service import OperationService
import random

operation_router = APIRouter()
operation_service = OperationService()

@operation_router.post("/sendEmail")
def send_email(email_request: EmailRequest = Body(...)):
    operation_service.send_email(email_request.email)
    message_response: MessageResponse = MessageResponse(success=True, status_code=status.HTTP_200_OK, data={})
    return JSONResponse(status_code=status.HTTP_200_OK, content=message_response.dict())