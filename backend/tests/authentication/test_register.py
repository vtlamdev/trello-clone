from fastapi import FastAPI, HTTPException, status
from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE, USER_COLLECTION,EMAIL_VERIFICATION_COLLECTION

global_mode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE

from database.mongodb.database import DatabaseService
from main import app
from modules.authentication_module.authentication_model import AuthenticationRegisterRequest
from shared_actions.operations.data_operation import encrypt

database_service: DatabaseService = DatabaseService.getInstance()
database = database_service.database
user_collection = database[USER_COLLECTION]
email_verification_collection=database[EMAIL_VERIFICATION_COLLECTION]

def test_register():
    with TestClient(app) as client:
        encrypted_password=encrypt("12345678")
        authentication_register_request:AuthenticationRegisterRequest=AuthenticationRegisterRequest(username="lamvt", email="lamlam@gmail.com", password=encrypted_password, verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":authentication_register_request.email,"verification_code":"123456"}).inserted_id
        response=client.post("/authentication/register",json={"username":authentication_register_request.username,"email":authentication_register_request.email,"password":authentication_register_request.password,"verification_code":authentication_register_request.verification_code})
        assert response.status_code==200
        assert response.json()["success"]==True
        assert response.json()["status_code"]==200
        assert response.json()["data"]!={}
        user_collection.delete_one({"email":authentication_register_request.email})
        email_verification_collection.delete_one({"_id":email_verification_id})

def test_register_missing_body():
    with TestClient(app) as client:
        response=client.post("/authentication/register",json={})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}

def test_register_missing_username():
    with TestClient(app) as client:
        response=client.post("/authentication/register",json={"username":"","email":"tunglam@gmail.com","password":"12345678","verification_code":"123456"})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}
def test_register_missing_email():
    with TestClient(app) as client:
        response=client.post("/authentication/register",json={"username":"lamvt","email":"","password":"12345678","verification_code":"123456"})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}

def test_register_missing_password():
    with TestClient(app) as client:
        response=client.post("/authentication/register",json={"username":"vtlam","email":"tunglam@gmail.com","password":"","verification_code":"123456"})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}

def test_register_missing_verifi_code():
    with TestClient(app) as client:
        response=client.post("/authentication/register",json={"username":"lamvt","email":"tunglam@gmail.com","password":"12345678","verification_code":""})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}

def test_register_invalid_email():
     with TestClient(app) as client:
        response=client.post("/authentication/register",json={"username":"lamvt","email":"tunggmailcom","password":"12345678","verification_code":"123456"})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}


def test_register_invalid_code():
    with TestClient(app) as client:
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        response=client.post("/authentication/register",json={"username":"lamvt","email":"tunglam@gmail.com","password":"12345678","verification_code":"1"})
        assert response.status_code==401
        assert response.json()["success"]==False
        assert response.json()["status_code"]==401
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})





