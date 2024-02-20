from database.mongodb.database import DatabaseService
import random
from shared_actions.operations.communication_operation import send_smtp_email
from shared_actions.models.email_model import EmailSendingRequest
from fastapi import HTTPException, status
from config.config import config
from shared_actions.operations.data_operation import get_email_HTML_format
from config.constant import EMAIL_VERIFICATION_COLLECTION
from datetime import datetime, timedelta

class OperationService:
    def __init__(self):
        self.database_service: DatabaseService = DatabaseService.getInstance()
        self.database = self.database_service.database
        self.email_verification_collection = self.database[EMAIL_VERIFICATION_COLLECTION]

    def send_email(self, email: str):
        verification_code = "{:0<6}".format(str(random.randint(0, 999999)))
        expired_at = datetime.now() + timedelta(minutes=1)
        self.email_verification_collection.update_one({"email": email}, {"$set": {"verification_code": verification_code, "email": email, "expired_at": expired_at.strftime("%d/%m/%Y, %H:%M:%S")}}, upsert=True)
        email_sending_request: EmailSendingRequest = EmailSendingRequest(sender=config["SENDER"], recipients=[email], password=config["SENDER_PASSWORD"], subject="Email Verification", body=get_email_HTML_format(verification_code))
    
        if not send_smtp_email(email_sending_request):
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)