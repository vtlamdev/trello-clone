from fastapi import FastAPI, HTTPException, status
from fastapi.testclient import TestClient
from config.global_mode import GlobalMode
from config.constant import TESTING_MODE, USER_COLLECTION,EMAIL_VERIFICATION_COLLECTION

global_mode = GlobalMode.getInstance()
global_mode.mode = TESTING_MODE

from database.mongodb.database import DatabaseService
from main import app
from shared_actions.operations.data_operation import encrypt
from modules.user_module.user_model import UserForgotPasswordRequest
from modules.authentication_module.authentication_model import AuthenticationRegisterRequest

database_service: DatabaseService = DatabaseService.getInstance()
database = database_service.database
user_collection = database[USER_COLLECTION]
email_verification_collection=database[EMAIL_VERIFICATION_COLLECTION]

def test_forgotpassword():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":user_forgot_password_request.email,"password":user_forgot_password_request.password,"verification_code":user_forgot_password_request.verification_code})
        assert response.status_code==200
        assert response.json()["success"]==True
        assert response.json()["status_code"]==200
        assert response.json()["data"]!={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})

def test_forgotpassword_missing_body():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})
def test_forgotpassword_missing_email():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":"","password":user_forgot_password_request.password,"verification_code":user_forgot_password_request.verification_code})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})
def test_forgotpassword_missing_password():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":user_forgot_password_request.email,"password":"","verification_code":user_forgot_password_request.verification_code})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})
def test_forgotpassword_missing_code():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":user_forgot_password_request.email,"password":user_forgot_password_request.password,"verification_code":""})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})
def test_forgotpassword_invalid_email():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":"aaaaaaa","password":user_forgot_password_request.password,"verification_code":user_forgot_password_request.verification_code})
        assert response.status_code==400
        assert response.json()["success"]==False
        assert response.json()["status_code"]==400
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})

def test_forgotpassword_invalid_code():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":user_forgot_password_request.email,"password":user_forgot_password_request.password,"verification_code":"1"})
        assert response.status_code==401
        assert response.json()["success"]==False
        assert response.json()["status_code"]==401
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})

def test_forgotpassword_wrong_email():
    with TestClient(app) as client:
        user_forgot_password_request:UserForgotPasswordRequest=UserForgotPasswordRequest(email="tunglam@gmail.com", password="12345678", verification_code="123456")
        email_verification_id= email_verification_collection.insert_one({"email":"tunglam@gmail.com","verification_code":"123456"}).inserted_id
        authentication_register_request: AuthenticationRegisterRequest = AuthenticationRegisterRequest(username="lamvt", email="tunglam@gmail.com", password="88888888", verification_code="123456")
        user_id = user_collection.insert_one(authentication_register_request.dict(exclude={"verification_code"})).inserted_id
        response=client.put("/user/forgotPassword",json={"email":"abc@abc.abc","password":user_forgot_password_request.password,"verification_code":user_forgot_password_request.verification_code})
        assert response.status_code==401
        assert response.json()["success"]==False
        assert response.json()["status_code"]==401
        assert response.json()["data"]=={}
        email_verification_collection.delete_one({"_id":email_verification_id})
        user_collection.delete_one({"_id": user_id})


        


