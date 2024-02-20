from fastapi import FastAPI, HTTPException, status
from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE, EMAIL_VERIFICATION_COLLECTION

global_mode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE

from database.mongodb.database import DatabaseService
from main import app
from modules.authentication_module.authentication_model import AuthenticationRegisterRequest
from shared_actions.operations.data_operation import encrypt
from shared_actions.models.email_model import EmailRequest
from typing import Union

database_service: DatabaseService = DatabaseService.getInstance()
database = database_service.database
email_verification_collection = database[EMAIL_VERIFICATION_COLLECTION]

def test_send_email():
    with TestClient(app) as client:
        email_request: EmailRequest = EmailRequest(email="unknown@gmail.com")
        response = client.post("/operation/sendEmail", json={"email": "unknown@gmail.com"})
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert response.json()["status_code"] == 200
        assert response.json()["data"] == {}
        data: Union[dict, None] = email_verification_collection.find_one(email_request.dict())
        assert data is not None

def test_send_email_missing_email():
    with TestClient(app) as client:
        response = client.post("/operation/sendEmail", json={})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

def test_send_email_invalid_email():
    with TestClient(app) as client:
        response = client.post("/operation/sendEmail", json={"email": "unknown"})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}