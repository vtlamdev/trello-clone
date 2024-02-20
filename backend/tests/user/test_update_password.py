from fastapi import FastAPI, HTTPException, status
from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE, USER_COLLECTION

global_mode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE

from database.mongodb.database import DatabaseService
from main import app
from modules.authentication_module.authentication_model import AuthenticationRegisterRequest
from shared_actions.operations.data_operation import encrypt, generate_token

database_service: DatabaseService = DatabaseService.getInstance()
database = database_service.database
user_collection = database[USER_COLLECTION]

def test_update_password_success():
    with TestClient(app) as client:
        encrypted_password = encrypt("khangnv")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="khangnv", email="khangnv@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        payload = {
            "user_id": str(user_id),
            "email": "khangnv@gmail.com",
            "username": "khangnv"
        }

        token = generate_token(payload)
        response = client.put("/user/updatePassword", json={"old_password": "khangnv", "new_password": "khangnvtest"}, headers={"Authorization": token})

        assert response.status_code == 200
        assert response.json()["success"] == True
        assert response.json()["status_code"] == 200
        assert response.json()["data"] != {}

        user_collection.delete_one({"_id": user_id})

def test_update_password_missing_body():
    with TestClient(app) as client:
        encrypted_password = encrypt("khangnv")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="khangnv", email="khangnv@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        payload = {
            "user_id": str(user_id),
            "email": "khangnv@gmail.com",
            "username": "khangnv"
        }

        token = generate_token(payload)
        response = client.put("/user/updatePassword", json={}, headers={"Authorization": token})

        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

        user_collection.delete_one({"_id": user_id})

def test_update_password_invalid_password():
    with TestClient(app) as client:
        encrypted_password = encrypt("khangnv")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="khangnv", email="khangnv@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        payload = {
            "user_id": str(user_id),
            "email": "khangnv@gmail.com",
            "username": "khangnv"
        }

        token = generate_token(payload)
        response = client.put("/user/updatePassword", json={"old_password": "", "new_password": ""}, headers={"Authorization": token})

        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

        user_collection.delete_one({"_id": user_id})

def test_update_password_wrong_old_password():
    with TestClient(app) as client:
        encrypted_password = encrypt("khangnv")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="khangnv", email="khangnv@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        payload = {
            "user_id": str(user_id),
            "email": "khangnv@gmail.com",
            "username": "khangnv"
        }

        token = generate_token(payload)
        response = client.put("/user/updatePassword", json={"old_password": "khang", "new_password": "khangnv"}, headers={"Authorization": token})

        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

        user_collection.delete_one({"_id": user_id})

def test_update_password_missing_token():
    with TestClient(app) as client:
        encrypted_password = encrypt("khangnv")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="khangnv", email="khangnv@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response = client.put("/user/updatePassword", json={"old_password": "khangnv", "new_password": "khangnvtest"})

        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}

        user_collection.delete_one({"_id": user_id})
    
def test_update_password_invalid_token():
    with TestClient(app) as client:
        encrypted_password = encrypt("khangnv")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="khangnv", email="khangnv@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response = client.put("/user/updatePassword", json={"old_password": "khangnv", "new_password":"khangnvtest"}, headers={"Authorization": "123456"})

        assert response.status_code == 401
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 401
        assert response.json()["data"] == {}

        user_collection.delete_one({"_id": user_id})