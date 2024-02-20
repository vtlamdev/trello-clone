from fastapi import FastAPI, HTTPException, status
from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE, USER_COLLECTION, EMAIL_VERIFICATION_COLLECTION

global_mode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE

from database.mongodb.database import DatabaseService
from main import app
from modules.authentication_module.authentication_model import AuthenticationRegisterRequest
from shared_actions.operations.data_operation import encrypt, generate_token

database_service: DatabaseService = DatabaseService.getInstance()
database = database_service.database
user_collection = database[USER_COLLECTION]
email_verification_collection = database[EMAIL_VERIFICATION_COLLECTION]

def test_update_email():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        email_verification_collection.insert_one({"email": "testing@gmail.com", "verification_code": "123456"})
        payload = {
            "user_id": str(user_id),
            "username": authentication_register_request.username,
            "email": authentication_register_request.email
        }
        token = generate_token(payload)
        response = client.put("/user/updateEmail", json={"email": "testing@gmail.com", "verification_code": "123456"}, headers={"Authorization": token})
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert response.json()["status_code"] == 200
        assert response.json()["data"] != {}
        user_collection.delete_one({"_id": user_id})
        email_verification_collection.delete_one({"email": "testing@gmail.com"})

def test_update_email_missing_email():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        email_verification_collection.insert_one({"email": "testing@gmail.com", "verification_code": "123456"})
        payload = {
            "user_id": str(user_id),
            "username": authentication_register_request.username,
            "email": authentication_register_request.email
        }
        token = generate_token(payload)
        response = client.put("/user/updateEmail", json={"verification_code": "123456"}, headers={"Authorization": token})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}
        user_collection.delete_one({"_id": user_id})
        email_verification_collection.delete_one({"email": "testing@gmail.com"})

def test_update_email_missing_verification_code():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        email_verification_collection.insert_one({"email": "testing@gmail.com", "verification_code": "123456"})
        payload = {
            "user_id": str(user_id),
            "username": authentication_register_request.username,
            "email": authentication_register_request.email
        }
        token = generate_token(payload)
        response = client.put("/user/updateEmail", json={"email": "testing@gmail.com"}, headers={"Authorization": token})
        assert response.status_code == 400
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 400
        assert response.json()["data"] == {}
        user_collection.delete_one({"_id": user_id})
        email_verification_collection.delete_one({"email": "testing@gmail.com"})

def test_update_email_invalid_email():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        email_verification_collection.insert_one({"email": "testing@gmail.com", "verification_code": "123456"})
        payload = {
            "user_id": str(user_id),
            "username": authentication_register_request.username,
            "email": authentication_register_request.email
        }
        token = generate_token(payload)
        response = client.put("/user/updateEmail", json={"email": "unknown@gmail.com", "verification_code": "000000"}, headers={"Authorization": token})
        assert response.status_code == 401
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 401
        assert response.json()["data"] == {}
        user_collection.delete_one({"_id": user_id})
        email_verification_collection.delete_one({"email": "testing@gmail.com"})

def test_update_email_invalid_verification_code():
    with TestClient(app) as client:
        encrypted_password = encrypt("unknown")
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="unknown", email="unknown@gmail.com", password=encrypted_password, verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        email_verification_collection.insert_one({"email": "testing@gmail.com", "verification_code": "123456"})
        payload = {
            "user_id": str(user_id),
            "username": authentication_register_request.username,
            "email": authentication_register_request.email
        }
        token = generate_token(payload)
        response = client.put("/user/updateEmail", json={"email": "testing@gmail.com", "verification_code": "000000"}, headers={"Authorization": token})
        assert response.status_code == 401
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 401
        assert response.json()["data"] == {}
        user_collection.delete_one({"_id": user_id})
        email_verification_collection.delete_one({"email": "testing@gmail.com"})

def test_update_email_invalid_token():
    with TestClient(app) as client:
        response = client.put("/user/updateEmail", json={"email": "testing@gmail.com", "verification_code": "123456"}, headers={"Authorization": "testing"})
        assert response.status_code == 401
        assert response.json()["success"] == False
        assert response.json()["status_code"] == 401
        assert response.json()["data"] == {}