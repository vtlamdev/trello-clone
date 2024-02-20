from fastapi import FastAPI, HTTPException, status
from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE, USER_COLLECTION

global_mode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE

from database.mongodb.database import DatabaseService
from main import app
from modules.authentication_module.authentication_model import AuthenticationRegisterRequest
from shared_actions.operations.data_operation import encrypt

database_service: DatabaseService = DatabaseService.getInstance()
database = database_service.database
user_collection = database[USER_COLLECTION]

def test_login():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response = client.post("/authentication/login", json={"email": "unknown@gmail.com", "password": "unknown"})
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert response.json()["status_code"] == 200
        assert response.json()["data"] != {}
        user_collection.delete_one({"_id": user_id})

def test_login_missing_body():
    with TestClient(app) as client:
        response = client.post("/authentication/login", json={})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

def test_login_missing_email():
    with TestClient(app) as client:
        response = client.post("/authentication/login", json={"password": "unknown"})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

def test_login_missing_password():
    with TestClient(app) as client:
        response = client.post("/authentication/login", json={"email": "unknown@gmail.com"})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

def test_login_invalid_email():
    with TestClient(app) as client:
        response = client.post("/authentication/login", json={"email": "unknown@gmail.com", "password": "unknown"})
        assert response.status_code == 404
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 404
        assert response.json()["data"] == {}

def test_login_invalid_password():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response = client.post("/authentication/login", json={"email": "unknown@gmail.com", "password": "place"})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}
        user_collection.delete_one({"_id": user_id})